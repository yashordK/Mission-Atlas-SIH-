package com.missionatlas.sevenshield.ui.screens.sos

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.missionatlas.sevenshield.ui.theme.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private const val HOLD_MS = 3000L

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun SosScreen(viewModel: SosViewModel = hiltViewModel()) {
    val state         by viewModel.uiState.collectAsState()
    val context       = LocalContext.current
    val scope         = rememberCoroutineScope()
    val locPerm       = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)
    val callPerm      = rememberPermissionState(Manifest.permission.CALL_PHONE)

    var holdProgress  by remember { mutableFloatStateOf(0f) }
    var holdJob       by remember { mutableStateOf<Job?>(null) }

    // Background colour shifts while holding
    val bgColor by animateColorAsState(
        targetValue = when (state.status) {
            SosStatus.IDLE    -> Black900
            SosStatus.SENDING -> Color(0xFF1A0000)
            SosStatus.SENT    -> EmergencyRed.copy(alpha = 0.12f)
            SosStatus.ERROR   -> Black900
        },
        animationSpec = tween(600),
        label = "bg",
    )

    // 3 staggered pulsing rings
    val inf = rememberInfiniteTransition(label = "sos_rings")
    val r1s by inf.animateFloat(1f, 2.2f, infiniteRepeatable(tween(1800, easing = LinearEasing), RepeatMode.Restart), label = "r1s")
    val r2s by inf.animateFloat(1f, 2.2f, infiniteRepeatable(tween(1800, 600, LinearEasing), RepeatMode.Restart), label = "r2s")
    val r3s by inf.animateFloat(1f, 2.2f, infiniteRepeatable(tween(1800, 1200, LinearEasing), RepeatMode.Restart), label = "r3s")
    val r1a by inf.animateFloat(0.5f, 0f, infiniteRepeatable(tween(1800, easing = LinearEasing), RepeatMode.Restart), label = "r1a")
    val r2a by inf.animateFloat(0.5f, 0f, infiniteRepeatable(tween(1800, 600, LinearEasing), RepeatMode.Restart), label = "r2a")
    val r3a by inf.animateFloat(0.5f, 0f, infiniteRepeatable(tween(1800, 1200, LinearEasing), RepeatMode.Restart), label = "r3a")

    val progressAnim by animateFloatAsState(
        targetValue    = holdProgress,
        animationSpec  = tween(if (holdProgress > 0f) HOLD_MS.toInt() else 200),
        label          = "progress",
    )
    val btnScale by animateFloatAsState(
        targetValue    = if (holdProgress > 0f) 1.08f else 1f,
        label          = "btn_scale",
    )

    MissionAtlasTheme(darkTheme = true) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(bgColor)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(40.dp))

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Filled.Warning, null, tint = EmergencyRed, modifier = Modifier.size(28.dp))
                Text("Emergency SOS", style = MaterialTheme.typography.headlineLarge, color = TextPrimary, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(12.dp))

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
                    SosStatus.SENT  -> SafeGreen
                    SosStatus.ERROR -> EmergencyRedBright
                    else            -> TextSecondary
                },
                modifier = Modifier.padding(horizontal = 16.dp),
            )

            Spacer(Modifier.height(10.dp))

            // "Monitored zone" chip
            Surface(
                shape = RoundedCornerShape(24.dp),
                color = ElectricBlue.copy(alpha = 0.12f),
            ) {
                Row(Modifier.padding(horizontal = 14.dp, vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(7.dp).clip(CircleShape).background(SafeGreen))
                    Spacer(Modifier.width(7.dp))
                    Text("You are in a monitored zone", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }

            Spacer(Modifier.height(44.dp))

            // ── Button area ──────────────────────────────────────────────────
            Box(Modifier.size(200.dp), contentAlignment = Alignment.Center) {

                // Pulsing rings (only when IDLE)
                if (state.status == SosStatus.IDLE || state.status == SosStatus.SENDING) {
                    Canvas(Modifier.size(200.dp)) {
                        val cx = size.width / 2; val cy = size.height / 2
                        val base = size.minDimension / 2 * 0.5f
                        drawCircle(EmergencyRed.copy(alpha = r1a), base * r1s, Offset(cx, cy))
                        drawCircle(EmergencyRed.copy(alpha = r2a), base * r2s, Offset(cx, cy))
                        drawCircle(EmergencyRed.copy(alpha = r3a), base * r3s, Offset(cx, cy))
                    }
                }

                // Progress arc track + fill
                if (state.status == SosStatus.IDLE) {
                    Canvas(Modifier.size(176.dp)) {
                        val sw = 6.dp.toPx()
                        val inset = sw / 2
                        val arcRect = Size(size.width - sw, size.height - sw)
                        drawArc(EmergencyRed.copy(alpha = 0.2f), -90f, 360f, false,
                            topLeft = Offset(inset, inset), size = arcRect, style = Stroke(sw, cap = StrokeCap.Round))
                        if (progressAnim > 0f)
                            drawArc(EmergencyRed, -90f, 360f * progressAnim, false,
                                topLeft = Offset(inset, inset), size = arcRect, style = Stroke(sw, cap = StrokeCap.Round))
                    }
                }

                when (state.status) {
                    SosStatus.IDLE -> {
                        Box(
                            modifier = Modifier
                                .size(140.dp)
                                .scale(btnScale)
                                .clip(CircleShape)
                                .background(EmergencyRed)
                                .pointerInput(Unit) {
                                    detectTapGestures(onPress = {
                                        if (!locPerm.status.isGranted) locPerm.launchPermissionRequest()
                                        holdProgress = 1f
                                        holdJob = scope.launch {
                                            delay(HOLD_MS)
                                            viewModel.activateSOS()
                                            holdProgress = 0f
                                        }
                                        tryAwaitRelease()
                                        holdJob?.cancel()
                                        holdProgress = 0f
                                    })
                                },
                            contentAlignment = Alignment.Center,
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Filled.Warning, "SOS", tint = Color.White, modifier = Modifier.size(48.dp))
                                Text("SOS", color = Color.White, fontWeight = FontWeight.Black, fontSize = 20.sp)
                                if (holdProgress > 0f)
                                    Text("HOLD…", color = Color.White.copy(0.75f), fontSize = 11.sp)
                            }
                        }
                    }
                    SosStatus.SENDING -> {
                        Box(Modifier.size(140.dp).clip(CircleShape).background(WarningAmber), Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(40.dp), strokeWidth = 3.dp)
                                Spacer(Modifier.height(8.dp))
                                Text("Sending", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    SosStatus.SENT -> {
                        Box(Modifier.size(140.dp).clip(CircleShape).background(SafeGreen), Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Filled.CheckCircle, null, tint = Color.White, modifier = Modifier.size(56.dp))
                                Text("Sent", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    SosStatus.ERROR -> {
                        Box(Modifier.size(140.dp).clip(CircleShape).background(Color(0xFF7F1D1D)), Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Filled.Close, null, tint = Color.White, modifier = Modifier.size(56.dp))
                                Text("Failed", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
            // ── End button area ──────────────────────────────────────────────

            if (state.lat != null && state.lng != null) {
                Spacer(Modifier.height(16.dp))
                Surface(shape = RoundedCornerShape(10.dp), color = SurfaceElevated) {
                    Text(
                        "📍 ${"%.5f".format(state.lat)}, ${"%.5f".format(state.lng)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                    )
                }
            }

            Spacer(Modifier.height(28.dp))

            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(
                    onClick = {
                        if (callPerm.status.isGranted) context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:112")))
                        else callPerm.launchPermissionRequest()
                    },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium,
                    colors = ButtonDefaults.buttonColors(containerColor = EmergencyRed),
                ) {
                    Icon(Icons.Filled.Call, null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(5.dp))
                    Text("Call 112", fontWeight = FontWeight.SemiBold)
                }
                Button(
                    onClick = {
                        if (callPerm.status.isGranted) context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:108")))
                        else callPerm.launchPermissionRequest()
                    },
                    modifier = Modifier.weight(1f),
                    shape = MaterialTheme.shapes.medium,
                    colors = ButtonDefaults.buttonColors(containerColor = SafeGreen),
                ) {
                    Icon(Icons.Filled.LocalHospital, null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(5.dp))
                    Text("Ambulance 108", fontWeight = FontWeight.SemiBold)
                }
            }

            if (state.status == SosStatus.SENT || state.status == SosStatus.ERROR) {
                Spacer(Modifier.height(10.dp))
                OutlinedButton(
                    onClick = viewModel::reset,
                    modifier = Modifier.fillMaxWidth(),
                    shape = MaterialTheme.shapes.medium,
                    colors = OutlinedButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                ) {
                    Text(if (state.status == SosStatus.SENT) "Mark as Safe" else "Try Again")
                }
            }

            Spacer(Modifier.weight(1f))
            Text(
                "Monitored 24/7 by Mission Atlas",
                style = MaterialTheme.typography.bodySmall,
                color = TextTertiary,
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(4.dp))
        }
    }
}
