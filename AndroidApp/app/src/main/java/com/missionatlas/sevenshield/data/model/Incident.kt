package com.missionatlas.sevenshield.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Incident(
    val id: String = "",
    val title: String = "",
    val description: String? = null,
    val severity: String = "low",         // low | medium | high
    @SerialName("alert_type") val alertType: String = "warning",  // warning | emergency | info
    val latitude: Double? = null,
    val longitude: Double? = null,
    val location: String? = null,
    @SerialName("reported_by") val reportedBy: String? = null,
    val status: String = "active",
    @SerialName("tourist_id")  val touristId: String? = null,
    @SerialName("blockchain_hash") val blockchainHash: String? = null,
    @SerialName("created_at")  val createdAt: String = "",
    @SerialName("updated_at")  val updatedAt: String = "",
)

@Serializable
data class IncidentInsert(
    val title: String,
    val description: String? = null,
    val severity: String = "low",
    @SerialName("alert_type") val alertType: String = "warning",
    val latitude: Double? = null,
    val longitude: Double? = null,
    val location: String? = null,
    @SerialName("reported_by") val reportedBy: String? = null,
    val status: String = "active",
)
