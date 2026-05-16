package com.missionatlas.sevenshield.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.missionatlas.sevenshield.ui.theme.AtlasBlue
import com.missionatlas.sevenshield.ui.theme.AtlasRed

@Composable
fun ProfileScreen(viewModel: ProfileViewModel = hiltViewModel()) {
    val profile by viewModel.profile.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Avatar + name header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                elevation = CardDefaults.cardElevation(4.dp),
            ) {
                Column(
                    modifier = Modifier
                        .background(Brush.verticalGradient(listOf(AtlasBlue.copy(alpha = 0.08f), Color.Transparent)))
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Box(
                        modifier = Modifier
                            .size(88.dp)
                            .clip(CircleShape)
                            .background(Brush.radialGradient(listOf(AtlasBlue, Color(0xFF0051D6)))),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Filled.Person, contentDescription = null, tint = Color.White, modifier = Modifier.size(48.dp))
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(
                        profile.name.ifBlank { "Tourist" },
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                    )
                    if (profile.email.isNotBlank()) {
                        Text(profile.email, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    if (profile.phone.isNotBlank()) {
                        Text(profile.phone, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Spacer(Modifier.height(8.dp))
                    // Digital ID chip
                    SuggestionChip(
                        onClick = {},
                        label = { Text(if (profile.blockchainId != null) "ID: ${profile.blockchainId!!.take(12)}…" else "Blockchain ID: Not registered") },
                        icon = { Icon(Icons.Filled.Link, contentDescription = null, modifier = Modifier.size(16.dp)) },
                    )
                }
            }
        }

        // Personal info
        item {
            ProfileSection(title = "Personal Information", icon = Icons.Filled.Person) {
                ProfileRow("Nationality", profile.nationality.ifBlank { "Not set" })
                ProfileRow("Blood Group", profile.bloodGroup.ifBlank { "Not set" })
            }
        }

        // Emergency contact
        item {
            ProfileSection(title = "Emergency Contact", icon = Icons.Filled.Warning) {
                ProfileRow("Name", profile.emergencyContactName.ifBlank { "Not set" })
                ProfileRow("Phone", profile.emergencyContactPhone.ifBlank { "Not set" })
            }
        }

        // Blockchain ID
        item {
            ProfileSection(title = "Blockchain Digital ID", icon = Icons.Filled.Security) {
                ProfileRow("Network", "Polygon Amoy Testnet")
                ProfileRow("Chain ID", "80002")
                ProfileRow("Status", if (profile.walletAddress != null) "Registered" else "Not connected")
                if (profile.walletAddress != null) {
                    ProfileRow("Wallet", "${profile.walletAddress!!.take(10)}…")
                }
            }
        }

        // Security
        item {
            ProfileSection(title = "Security", icon = Icons.Filled.Lock) {
                ProfileRow("Two-Factor Auth", "Disabled")
                ProfileRow("Account", "Guest")
            }
        }

        // Logout
        item {
            Button(
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AtlasRed),
            ) {
                Icon(Icons.Filled.ExitToApp, contentDescription = null)
                Spacer(Modifier.width(8.dp))
                Text("Sign Out")
            }
        }

        item { Spacer(Modifier.height(8.dp)) }
    }
}

@Composable
private fun ProfileSection(
    title: String,
    icon: ImageVector,
    content: @Composable ColumnScope.() -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(2.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
            }
            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
            content()
        }
    }
}

@Composable
private fun ProfileRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
    }
}
