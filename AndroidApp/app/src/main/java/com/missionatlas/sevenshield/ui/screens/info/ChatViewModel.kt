package com.missionatlas.sevenshield.ui.screens.info

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

data class ChatMessage(
    val text: String,
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis(),
)

data class ChatUiState(
    val messages: List<ChatMessage> = listOf(
        ChatMessage(
            text = "Hello! I'm SevenShield AI. How can I help you stay safe in Northeast India?",
            isUser = false,
        )
    ),
    val isTyping: Boolean = false,
)

private const val SYSTEM_PROMPT = """You are SevenShield AI, a safety assistant for tourists in
Northeast India. Provide helpful, concise safety advice, emergency contacts (Police: 100,
Ambulance: 108, Emergency: 112), local tips, and travel guidance for Arunachal Pradesh, Assam,
Manipur, Meghalaya, Mizoram, Nagaland, and Tripura. Keep responses under 150 words. Be warm and
practical."""

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val groqRepository: GroqRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState.asStateFlow()

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        _uiState.update { it.copy(messages = it.messages + ChatMessage(text, true), isTyping = true) }

        viewModelScope.launch {
            val response = groqRepository.chat(SYSTEM_PROMPT, text)
            _uiState.update {
                it.copy(
                    messages = it.messages + ChatMessage(response, false),
                    isTyping = false,
                )
            }
        }
    }
}
