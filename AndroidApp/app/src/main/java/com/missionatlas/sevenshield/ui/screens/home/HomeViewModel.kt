package com.missionatlas.sevenshield.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.missionatlas.sevenshield.data.repository.GroqRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val selectedState: String? = null,
    val selectedPlaces: List<String> = emptyList(),
    val tripDates: String = "",
    val modalStep: Int = 1,           // 1 = select places, 2 = dates, 3 = itinerary
    val itinerary: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val showModal: Boolean = false,
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val groqRepository: GroqRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun openModal(stateName: String) {
        _uiState.update {
            it.copy(
                selectedState = stateName,
                selectedPlaces = emptyList(),
                tripDates = "",
                modalStep = 1,
                itinerary = "",
                error = null,
                showModal = true,
            )
        }
    }

    fun dismissModal() {
        _uiState.update { it.copy(showModal = false) }
    }

    fun togglePlace(place: String) {
        _uiState.update { state ->
            val updated = if (state.selectedPlaces.contains(place))
                state.selectedPlaces - place
            else
                state.selectedPlaces + place
            state.copy(selectedPlaces = updated)
        }
    }

    fun setTripDates(dates: String) {
        _uiState.update { it.copy(tripDates = dates) }
    }

    fun nextStep() {
        _uiState.update { it.copy(modalStep = it.modalStep + 1) }
    }

    fun prevStep() {
        _uiState.update { it.copy(modalStep = maxOf(1, it.modalStep - 1)) }
    }

    fun generateItinerary() {
        val state = _uiState.value
        if (state.selectedPlaces.isEmpty() || state.tripDates.isBlank()) {
            _uiState.update { it.copy(error = "Select at least one place and enter trip dates") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            groqRepository.generateItinerary(
                places = state.selectedPlaces,
                state = state.selectedState ?: "",
                dates = state.tripDates,
            ).onSuccess { itinerary ->
                _uiState.update { it.copy(isLoading = false, itinerary = itinerary, modalStep = 3) }
            }.onFailure { err ->
                _uiState.update { it.copy(isLoading = false, error = err.message ?: "Failed to generate itinerary") }
            }
        }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}
