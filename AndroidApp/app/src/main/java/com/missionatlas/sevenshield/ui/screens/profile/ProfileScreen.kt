package com.missionatlas.sevenshield.ui.screens.profile

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.missionatlas.sevenshield.ui.theme.*

@Composable
fun ProfileScreen(viewModel: ProfileViewModel = hiltViewModel()) {
    val profile by viewModel.profile.collectAsState()

    // Shimmer animation for Digital ID card
    val shimmer = rememberInfiniteTransition(label = "shimmer")
    val shimmerX by shimmer.animateFloat(
        initialValue = -1f, targetValue = 2f,
        animationSpec = infiniteRepeatable(tween(2000, easing = LinearEasing), RepeatMode.Restart),
        label = "shimmerX",
    )
    val borderAlpha by shimmer.animateFloat(
        0.4f, 1f, infiniteRepeatable(tween(1500), RepeatMode.Reverse), "borderAlpha"
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize().background(Black900),
        contentPadding = PaddingValues(bottom = 24.dp),
    ) {
        // ── Header ─────────────────────────────────────────────────────────────
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(
                        Brush.linearGradient(
                            listOf(ElectricBlueDim, Black700, Black900),
                            start = Offset(0f, 0f),
                            end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY),
                        )
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(top = 20.dp)) {
                    // Avatar
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(SurfaceElevated)
                            .border(2.dp, ElectricBlue, CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Filled.Person, null, tint = ElectricBlue, modifier = Modifier.size(40.dp))
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(
                        profile.name.ifBlank { "Tourist" },
                        style = MaterialTheme.typography.titleLarge,
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold,
                    )
                    if (profile.email.isNotBlank()) {
                        Text(profile.email, style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
                    }
                    Spacer(Modifier.height(12.dp))
                    // Stats row
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(Black900.copy(alpha = 0.5f))
                            .padding(horizontal = 8.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(0.dp),
                    ) {
                        ProfileStat("Nationality", profile.nationality.ifBlank { "—" })
                        Box(Modifier.width(1.dp).height(32.dp).background(SurfaceBorder))
                        ProfileStat("Status", if (profile.walletAddress != null) "Verified" else "Guest")
                        Box(Modifier.width(1.dp).height(32.dp).background(SurfaceBorder))
                        ProfileStat("Chain", "Amoy")
                    }
                }
            }
        }

        // ── Digital ID card (shimmer border) ───────────────────────────────────
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp)
                    .border(
                        width = 1.dp,
                        brush = Brush.linearGradient(
                            listOf(
                                ElectricBlue.copy(alpha = borderAlpha),
                                ElectricBlueDim.copy(alpha = 0.2f),
                                ElectricBlue.copy(alpha = borderAlpha),
                            ),
                            start = Offset(shimmerX * 500f, 0f),
                            end = Offset(shimmerX * 500f + 400f, 200f),
                        ),
                        shape = RoundedCornerShape(16.dp),
                    )
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceElevated)
                    .padding(16.dp),
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Security, null, tint = ElectricBlue, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Blockchain Digital ID", style = MaterialTheme.typography.titleMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(Modifier.height(12.dp))
                    DarkProfileRow("Network", "Polygon Amoy Testnet")
                    DarkProfileRow("Chain ID", "80002")
                    DarkProfileRow(
                        "Status",
                        if (profile.walletAddress != null) "✓ Registered" else "Not connected",
                        valueColor = if (profile.walletAddress != null) SafeGreen else TextTertiary,
                    )
                    if (profile.blockchainId != null) {
                        DarkProfileRow("ID", "${profile.blockchainId!!.take(14)}…")
                    }
                    if (profile.walletAddress != null) {
                        DarkProfileRow("Wallet", "${profile.walletAddress!!.take(12)}…")
                    }
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Verified on Polygon Amoy",
                        style = MaterialTheme.typography.bodySmall,
                        color = SafeGreen,
                        fontSize = 11.sp,
                    )
                }
            }
        }

        // ── Sections ───────────────────────────────────────────────────────────
        item {
            DarkProfileSection("Personal Information", Icons.Filled.Person) {
                DarkProfileRow("Nationality", profile.nationality.ifBlank { "—" })
                DarkProfileRow("Blood Group", profile.bloodGroup.ifBlank { "—" })
            }
        }

        item {
            DarkProfileSection("Emergency Contact", Icons.Filled.Warning) {
                DarkProfileRow("Name",  profile.emergencyContactName.ifBlank { "—" })
                DarkProfileRow("Phone", profile.emergencyContactPhone.ifBlank { "—" })
            }
        }

        item {
            DarkProfileSection("Security", Icons.Filled.Lock) {
                DarkProfileRow("Two-Factor Auth", "Disabled")
                DarkProfileRow("Account", if (profile.walletAddress != null) "Authenticated" else "Guest")
            }
        }

        item {
            Spacer(Modifier.height(8.dp))
            Button(
                onClick = {},
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = EmergencyRed),
            ) {
                Icon(Icons.Filled.ExitToApp, null)
                Spacer(Modifier.width(8.dp))
                Text("Sign Out")
            }
        }
    }
}

@Composable
private fun ProfileStat(label: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(horizontal = 16.dp),
    ) {
        Text(value, style = MaterialTheme.typography.bodyMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
        Text(label, style = MaterialTheme.typography.bodySmall, color = TextTertiary, fontSize = 10.sp)
    }
}

@Composable
private fun DarkProfileSection(title: String, icon: ImageVector, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceElevated)
            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = ElectricBlue, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
        }
        Spacer(Modifier.height(4.dp))
        Box(Modifier.fillMaxWidth().height(1.dp).background(SurfaceBorder))
        Spacer(Modifier.height(8.dp))
        content()
    }
}

@Composable
private fun DarkProfileRow(label: String, value: String, valueColor: Color = TextPrimary) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = TextTertiary)
        Text(value, style = MaterialTheme.typography.bodyMedium, color = valueColor, fontWeight = FontWeight.Medium)
    }
}
