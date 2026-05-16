package com.missionatlas.sevenshield.ui.screens.map

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.missionatlas.sevenshield.data.model.Incident
import com.missionatlas.sevenshield.data.repository.SupabaseRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class MapUiState(
    val userLat: Double = 26.1445,  // default: Guwahati
    val userLng: Double = 91.7362,
    val incidents: List<Incident> = emptyList(),
    val isLoadingLocation: Boolean = true,
    val isLoadingIncidents: Boolean = true,
    val locationError: String? = null,
    val incidentError: String? = null,
)

@HiltViewModel
class MapViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val supabaseRepository: SupabaseRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(MapUiState())
    val uiState: StateFlow<MapUiState> = _uiState.asStateFlow()

    private val fusedLocation: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    init {
        loadIncidents()
        // Auto-refresh incidents every 60s
        viewModelScope.launch {
            while (true) {
                delay(60_000)
                loadIncidents()
            }
        }
    }

    @SuppressLint("MissingPermission")
    fun fetchLocation() {
        _uiState.update { it.copy(isLoadingLocation = true, locationError = null) }
        val cts = CancellationTokenSource()
        fusedLocation.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, cts.token)
            .addOnSuccessListener { location: Location? ->
                if (location != null) {
                    _uiState.update {
                        it.copy(
                            userLat = location.latitude,
                            userLng = location.longitude,
                            isLoadingLocation = false,
                        )
                    }
                } else {
                    _uiState.update { it.copy(isLoadingLocation = false, locationError = "Location unavailable") }
                }
            }
            .addOnFailureListener { err ->
                _uiState.update { it.copy(isLoadingLocation = false, locationError = err.message) }
            }
    }

    private fun loadIncidents() {
        viewModelScope.launch {
            supabaseRepository.getActiveIncidents()
                .onSuccess { incidents ->
                    _uiState.update { it.copy(incidents = incidents, isLoadingIncidents = false) }
                }
                .onFailure { err ->
                    _uiState.update { it.copy(isLoadingIncidents = false, incidentError = err.message) }
                }
        }
    }

    fun refresh() {
        fetchLocation()
        loadIncidents()
    }
}
