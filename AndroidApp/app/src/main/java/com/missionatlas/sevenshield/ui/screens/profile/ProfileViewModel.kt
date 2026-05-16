package com.missionatlas.sevenshield.ui.screens.profile

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

data class ProfileData(
    val name: String = "Tourist",
    val email: String = "",
    val phone: String = "",
    val nationality: String = "Indian",
    val bloodGroup: String = "Unknown",
    val emergencyContactName: String = "",
    val emergencyContactPhone: String = "",
    val blockchainId: String? = null,
    val walletAddress: String? = null,
)

@HiltViewModel
class ProfileViewModel @Inject constructor() : ViewModel() {

    private val _profile = MutableStateFlow(ProfileData())
    val profile: StateFlow<ProfileData> = _profile.asStateFlow()
}
