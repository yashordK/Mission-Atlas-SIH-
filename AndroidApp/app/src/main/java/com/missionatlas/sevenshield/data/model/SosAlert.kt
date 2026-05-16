package com.missionatlas.sevenshield.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class SosAlert(
    val id: String = "",
    @SerialName("user_id")    val userId: String? = null,
    @SerialName("tourist_id") val touristId: String? = null,
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val message: String? = null,
    val status: String = "active",
    @SerialName("blockchain_hash") val blockchainHash: String? = null,
    @SerialName("responded_at") val respondedAt: String? = null,
    @SerialName("created_at") val createdAt: String = "",
)

@Serializable
data class SosAlertInsert(
    val latitude: Double,
    val longitude: Double,
    val message: String = "SOS activated from Mission Atlas Android app",
    val status: String = "active",
)
