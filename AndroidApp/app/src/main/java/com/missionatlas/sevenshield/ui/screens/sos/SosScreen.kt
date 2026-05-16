package com.missionatlas.sevenshield.ui.screens.sos

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.missionatlas.sevenshield.ui.theme.AtlasGreen
import com.missionatlas.sevenshield.ui.theme.AtlasRed
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.foundation.Canvas

private const val HOLD_DURATION_MS = 3000L

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun SosScreen(viewModel: SosViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val locationPermission = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)
    val callPermission = rememberPermissionState(Manifest.permission.CALL_PHONE)

    // Hold progress 0f..1f
    var holdProgress by remember { mutableFloatStateOf(0f) }
    var holdJob by remember { mutableStateOf<Job?>(null) }

    val progressAnim by animateFloatAsState(
        targetValue = holdProgress,
        animationSpec = tween(durationMillis = if (holdProgress > 0f) HOLD_DURATION_MS.toInt() else 150),
        label = "sos_progress",
    )
    val buttonScale by animateFloatAsState(
        targetValue = if (holdProgress > 0f) 1.1f else 1f,
        label = "button_scale",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(Modifier.height(40.dp))

        // Header
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(Icons.Filled.Warning, contentDescription = null, tint = AtlasRed, modifier = Modifier.size(28.dp))
            Text("Emergency SOS", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onBackground)
        }

        Spacer(Modifier.height(16.dp))

        // Status text
        Text(
            text = when (state.status) {
                SosStatus.IDLE    -> "Hold the button for 3 seconds to send an emergency alert"
                SosStatus.SENDING -> "Sending SOS alert…"
                SosStatus.SENT    -> "SOS Alert Sent! Help is on the way."
                SosStatus.ERROR   -> "Error: ${state.errorMessage}"
            },
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center,
            color = when (state.status) {
                SosStatus.SENT  -> AtlasGreen
                SosStatus.ERROR -> AtlasRed
                else            -> MaterialTheme.colorScheme.onSurfaceVariant
            },
            modifier = Modifier.padding(horizontal = 16.dp),
        )

        Spacer(Modifier.height(12.dp))

        // Zone indicator
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)),
        ) {
            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("●", color = AtlasGreen, fontSize = 12.sp)
                Spacer(Modifier.width(6.dp))
                Text("You are in a monitored zone", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Spacer(Modifier.height(48.dp))

        // SOS button with circular progress
        Box(
            modifier = Modifier.size(180.dp),
            contentAlignment = Alignment.Center,
        ) {
            // Animated ring
            if (state.status == SosStatus.IDLE || holdProgress > 0f) {
                Canvas(modifier = Modifier.size(175.dp)) {
                    val strokeWidth = 8.dp.toPx()
                    drawArc(
                        color = AtlasRed.copy(alpha = 0.25f),
                        startAngle = -90f,
                        sweepAngle = 360f,
                        useCenter = false,
                        style = Stroke(strokeWidth, cap = StrokeCap.Round),
                    )
                    drawArc(
                        color = AtlasRed,
                        startAngle = -90f,
                        sweepAngle = 360f * progressAnim,
                        useCenter = false,
                        style = Stroke(strokeWidth, cap = StrokeCap.Round),
                    )
                }
            }

            when (state.status) {
                SosStatus.IDLE -> {
                    Box(
                        modifier = Modifier
                            .size(140.dp)
                            .scale(buttonScale)
                            .clip(CircleShape)
                            .background(AtlasRed)
                            .pointerInput(Unit) {
                                detectTapGestures(
                                    onPress = {
                                        if (!locationPermission.status.isGranted) {
                                            locationPermission.launchPermissionRequest()
                                        }
                                        holdProgress = 1f
                                        holdJob = scope.launch {
                                            delay(HOLD_DURATION_MS)
                                            viewModel.activateSOS()
                                            holdProgress = 0f
                                        }
                                        tryAwaitRelease()
                                        holdJob?.cancel()
                                        holdProgress = 0f
                                    },
                                )
                            },
                        contentAlignment = Alignment.Center,
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Filled.Warning, contentDescription = "SOS", tint = Color.White, modifier = Modifier.size(48.dp))
                            Text("SOS", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            if (holdProgress > 0f) Text("HOLD…", color = Color.White.copy(alpha = 0.8f), fontSize = 11.sp)
                        }
                    }
                }
                SosStatus.SENDING -> {
                    Box(
                        modifier = Modifier.size(140.dp).clip(CircleShape).background(Color(0xFFFF8C00)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(40.dp))
                            Spacer(Modifier.height(6.dp))
                            Text("Sending", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                SosStatus.SENT -> {
                    Box(
                        modifier = Modifier.size(140.dp).clip(CircleShape).background(AtlasGreen),
                        contentAlignment = Alignment.Center,
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Filled.CheckCircle, contentDescription = "Sent", tint = Color.White, modifier = Modifier.size(56.dp))
                            Text("Sent", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                SosStatus.ERROR -> {
                    Box(
                        modifier = Modifier.size(140.dp).clip(CircleShape).background(Color(0xFF8E0000)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Filled.Close, contentDescription = "Error", tint = Color.White, modifier = Modifier.size(56.dp))
                            Text("Failed", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Coordinates display
        if (state.lat != null && state.lng != null) {
            Spacer(Modifier.height(16.dp))
            Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                Text(
                    "Location: ${"%.5f".format(state.lat)}, ${"%.5f".format(state.lng)}",
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                )
            }
        }

        Spacer(Modifier.height(32.dp))

        // Call buttons
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                onClick = {
                    if (callPermission.status.isGranted) {
                        context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:112")))
                    } else {
                        callPermission.launchPermissionRequest()
                    }
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AtlasRed),
            ) {
                Icon(Icons.Filled.Call, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Call 112")
            }
            Button(
                onClick = {
                    if (callPermission.status.isGranted) {
                        context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:108")))
                    } else {
                        callPermission.launchPermissionRequest()
                    }
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AtlasGreen),
            ) {
                Icon(Icons.Filled.LocalHospital, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Ambulance 108")
            }
        }

        // Reset button
        if (state.status == SosStatus.SENT || state.status == SosStatus.ERROR) {
            Spacer(Modifier.height(12.dp))
            OutlinedButton(
                onClick = viewModel::reset,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
            ) {
                Text(if (state.status == SosStatus.SENT) "Mark as Safe" else "Try Again")
            }
        }

        Spacer(Modifier.weight(1f))
        Text(
            "SOS alerts are monitored by Mission Atlas authorities 24/7",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
            textAlign = TextAlign.Center,
        )
    }
}
