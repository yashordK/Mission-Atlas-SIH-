package com.missionatlas.sevenshield.ui.screens.sos

import android.annotation.SuppressLint
import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.os.Build
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.missionatlas.sevenshield.data.repository.SupabaseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class SosStatus { IDLE, SENDING, SENT, ERROR }

data class SosUiState(
    val status: SosStatus = SosStatus.IDLE,
    val lat: Double? = null,
    val lng: Double? = null,
    val errorMessage: String = "",
)

@HiltViewModel
class SosViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val supabaseRepository: SupabaseRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(SosUiState())
    val uiState: StateFlow<SosUiState> = _uiState.asStateFlow()

    private val fusedLocation: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun activateSOS() {
        if (_uiState.value.status == SosStatus.SENDING) return
        _uiState.update { it.copy(status = SosStatus.SENDING, errorMessage = "") }
        vibrate()

        val cts = CancellationTokenSource()
        fusedLocation.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, cts.token)
            .addOnSuccessListener { location ->
                val lat = location?.latitude ?: 26.1445
                val lng = location?.longitude ?: 91.7362
                viewModelScope.launch {
                    supabaseRepository.insertSosAlert(lat, lng)
                        .onSuccess {
                            _uiState.update { state ->
                                state.copy(status = SosStatus.SENT, lat = lat, lng = lng)
                            }
                        }
                        .onFailure { err ->
                            _uiState.update { state ->
                                state.copy(status = SosStatus.ERROR, errorMessage = err.message ?: "SOS failed")
                            }
                        }
                }
            }
            .addOnFailureListener {
                // No location — still send alert with no coords (default Guwahati as fallback)
                viewModelScope.launch {
                    supabaseRepository.insertSosAlert(26.1445, 91.7362, "SOS — location unavailable")
                        .onSuccess {
                            _uiState.update { state -> state.copy(status = SosStatus.SENT) }
                        }
                        .onFailure { err ->
                            _uiState.update { state ->
                                state.copy(status = SosStatus.ERROR, errorMessage = err.message ?: "SOS failed")
                            }
                        }
                }
            }
    }

    fun reset() {
        _uiState.update { SosUiState() }
    }

    private fun vibrate() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vm.defaultVibrator.vibrate(
                VibrationEffect.createWaveform(longArrayOf(0, 400, 200, 400), -1)
            )
        } else {
            @Suppress("DEPRECATION")
            val v = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            @Suppress("DEPRECATION")
            v.vibrate(longArrayOf(0, 400, 200, 400), -1)
        }
    }
}
