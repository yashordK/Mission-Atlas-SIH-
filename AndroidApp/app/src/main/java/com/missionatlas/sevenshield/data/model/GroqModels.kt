package com.missionatlas.sevenshield.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class GroqRequest(
    val model: String = "llama3-8b-8192",
    val messages: List<GroqMessage>,
    @SerialName("max_tokens") val maxTokens: Int = 1500,
    val temperature: Double = 0.7,
)

@Serializable
data class GroqMessage(
    val role: String,   // "system" | "user" | "assistant"
    val content: String,
)

@Serializable
data class GroqResponse(
    val id: String = "",
    val choices: List<GroqChoice> = emptyList(),
)

@Serializable
data class GroqChoice(
    val message: GroqMessage,
    @SerialName("finish_reason") val finishReason: String = "",
)
