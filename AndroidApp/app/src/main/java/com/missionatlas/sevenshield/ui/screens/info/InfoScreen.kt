package com.missionatlas.sevenshield.ui.screens.info

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.missionatlas.sevenshield.ui.theme.*

private val QUICK_CHIPS = listOf("Safety Tips", "Emergency Contacts", "Nearest Hospital", "Weather Alert", "Local Laws")

@Composable
fun InfoScreen(viewModel: ChatViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()
    var inputText by remember { mutableStateOf("") }

    // Pulsing green dot
    val inf = rememberInfiniteTransition(label = "chat_inf")
    val dotAlpha by inf.animateFloat(
        1f, 0.3f, infiniteRepeatable(tween(1000), RepeatMode.Reverse), "dotAlpha"
    )

    // Auto-scroll to bottom when messages change
    LaunchedEffect(state.messages.size) {
        if (state.messages.isNotEmpty()) listState.animateScrollToItem(state.messages.size - 1)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Black900),
    ) {
        // ── Header ─────────────────────────────────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceDark)
                .border(width = 0.dp, color = Color.Transparent)
                .padding(horizontal = 20.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // "7" avatar
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(ElectricBlueDim),
                contentAlignment = Alignment.Center,
            ) {
                Text("7", color = Color.White, fontWeight = FontWeight.Black, fontSize = 16.sp)
            }
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Text("SevenShield AI", style = MaterialTheme.typography.titleMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .clip(CircleShape)
                            .background(SafeGreen.copy(alpha = dotAlpha)),
                    )
                    Spacer(Modifier.width(5.dp))
                    Text("Online", style = MaterialTheme.typography.bodySmall, color = SafeGreen)
                }
            }
        }

        // ── Quick chips ────────────────────────────────────────────────────────
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceDark)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(QUICK_CHIPS) { chip ->
                Surface(
                    onClick = {
                        viewModel.sendMessage(chip)
                        inputText = ""
                    },
                    color = SurfaceElevated,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.border(1.dp, SurfaceBorder, RoundedCornerShape(20.dp)),
                ) {
                    Text(
                        chip,
                        style = MaterialTheme.typography.labelLarge,
                        color = TextSecondary,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
                    )
                }
            }
        }

        // ── Chat messages ──────────────────────────────────────────────────────
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(vertical = 12.dp),
        ) {
            items(state.messages) { msg ->
                if (msg.isUser) {
                    UserBubble(msg.text)
                } else {
                    AiBubble(msg.text)
                }
            }

            if (state.isTyping) {
                item { TypingIndicator() }
            }
        }

        // ── Input bar ──────────────────────────────────────────────────────────
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceDark)
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(24.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp),
            ) {
                if (inputText.isEmpty()) {
                    Text("Ask anything about NE India safety…", style = MaterialTheme.typography.bodyMedium, color = TextTertiary)
                }
                BasicTextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = TextPrimary),
                    cursorBrush = SolidColor(ElectricBlue),
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            Spacer(Modifier.width(8.dp))
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(if (inputText.isNotBlank()) ElectricBlue else SurfaceElevated)
                    .clickable {
                        if (inputText.isNotBlank()) {
                            viewModel.sendMessage(inputText)
                            inputText = ""
                        }
                    },
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    Icons.Filled.Send,
                    contentDescription = "Send",
                    tint = if (inputText.isNotBlank()) Color.White else TextTertiary,
                    modifier = Modifier.size(20.dp),
                )
            }
        }
    }
}

@Composable
private fun UserBubble(text: String) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
        Surface(
            color = ElectricBlue,
            shape = RoundedCornerShape(18.dp, 18.dp, 4.dp, 18.dp),
        ) {
            Text(
                text,
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            )
        }
    }
}

@Composable
private fun AiBubble(text: String) {
    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clip(CircleShape)
                .background(ElectricBlueDim),
            contentAlignment = Alignment.Center,
        ) {
            Text("7", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        Surface(
            color = SurfaceElevated,
            shape = RoundedCornerShape(4.dp, 18.dp, 18.dp, 18.dp),
            modifier = Modifier.weight(1f),
        ) {
            Text(
                text,
                style = MaterialTheme.typography.bodyMedium,
                color = TextPrimary,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                lineHeight = 22.sp,
            )
        }
    }
}

@Composable
private fun TypingIndicator() {
    val inf = rememberInfiniteTransition(label = "typing")
    val dot1 by inf.animateFloat(0.3f, 1f, infiniteRepeatable(tween(600, 0),    RepeatMode.Reverse), "d1")
    val dot2 by inf.animateFloat(0.3f, 1f, infiniteRepeatable(tween(600, 200),  RepeatMode.Reverse), "d2")
    val dot3 by inf.animateFloat(0.3f, 1f, infiniteRepeatable(tween(600, 400),  RepeatMode.Reverse), "d3")

    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier.size(28.dp).clip(CircleShape).background(ElectricBlueDim),
            contentAlignment = Alignment.Center,
        ) {
            Text("7", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        Surface(color = SurfaceElevated, shape = RoundedCornerShape(4.dp, 18.dp, 18.dp, 18.dp)) {
            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                listOf(dot1, dot2, dot3).forEach { alpha ->
                    Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(TextTertiary.copy(alpha = alpha)))
                }
            }
        }
    }
}
