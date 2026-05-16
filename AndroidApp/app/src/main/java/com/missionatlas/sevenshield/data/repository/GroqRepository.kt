package com.missionatlas.sevenshield.data.repository

import com.missionatlas.sevenshield.data.model.GroqMessage
import com.missionatlas.sevenshield.data.model.GroqRequest
import com.missionatlas.sevenshield.data.model.GroqResponse
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import javax.inject.Inject
import javax.inject.Named
import javax.inject.Singleton

@Singleton
class GroqRepository @Inject constructor(
    private val httpClient: HttpClient,
    @Named("groqApiKey") private val apiKey: String,
) {
    private companion object {
        const val GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
        const val MODEL = "llama3-8b-8192"
        const val SYSTEM_PROMPT = """You are a knowledgeable travel assistant specializing in
Northeast India tourism. Provide practical, safety-aware, culturally sensitive travel itineraries.
Keep responses concise, well-structured with Day headings, and include safety tips."""
    }

    suspend fun generateItinerary(
        places: List<String>,
        state: String,
        dates: String,
    ): Result<String> = runCatching {
        val prompt = """Create a detailed day-wise travel itinerary for visiting ${places.joinToString(", ")}
in $state (Northeast India) for the dates $dates.

For each day include:
- Morning, afternoon, and evening activities with timings
- Local food recommendations
- Transportation tips
- Safety advice specific to $state
Format clearly with Day headings."""

        val response = httpClient.post(GROQ_URL) {
            header("Authorization", "Bearer $apiKey")
            contentType(ContentType.Application.Json)
            setBody(
                GroqRequest(
                    model = MODEL,
                    messages = listOf(
                        GroqMessage(role = "system", content = SYSTEM_PROMPT),
                        GroqMessage(role = "user", content = prompt),
                    ),
                    maxTokens = 1500,
                    temperature = 0.7,
                )
            )
        }
        val groqResponse = response.body<GroqResponse>()
        groqResponse.choices.firstOrNull()?.message?.content
            ?: error("Empty response from Groq")
    }

    suspend fun chat(systemPrompt: String, userMessage: String): String =
        runCatching {
            val response = httpClient.post(GROQ_URL) {
                header("Authorization", "Bearer $apiKey")
                contentType(ContentType.Application.Json)
                setBody(
                    GroqRequest(
                        model = MODEL,
                        messages = listOf(
                            GroqMessage(role = "system", content = systemPrompt),
                            GroqMessage(role = "user",   content = userMessage),
                        ),
                        maxTokens = 300,
                        temperature = 0.7,
                    )
                )
            }
            response.body<GroqResponse>().choices.firstOrNull()?.message?.content
                ?: "I couldn't generate a response. Please try again."
        }.getOrElse { err ->
            "Sorry, I'm having trouble connecting right now. Please check your connection and try again."
        }
}
