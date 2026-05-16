package com.missionatlas.sevenshield.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Tourist(
    val id: String = "",
    val name: String = "",
    @SerialName("user_id")      val userId: String? = null,
    val location: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    @SerialName("safety_score") val safetyScore: Int = 100,
    val status: String = "safe",
    @SerialName("current_state") val currentState: String? = null,
    @SerialName("last_seen")    val lastSeen: String = "",
    @SerialName("blockchain_id") val blockchainId: String? = null,
    @SerialName("created_at")   val createdAt: String = "",
)
