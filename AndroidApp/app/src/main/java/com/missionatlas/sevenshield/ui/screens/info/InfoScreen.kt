package com.missionatlas.sevenshield.ui.screens.info

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.missionatlas.sevenshield.ui.theme.AtlasBlue
import com.missionatlas.sevenshield.ui.theme.AtlasGreen
import com.missionatlas.sevenshield.ui.theme.AtlasRed

private data class FaqItem(val question: String, val answer: String)

private val FAQ_ITEMS = listOf(
    FaqItem("What is Mission Atlas?", "Mission Atlas (SevenShield) is a comprehensive tourist safety system for Northeast India. It combines AI itinerary planning, geo-fencing, blockchain identity, real-time incident monitoring, and emergency SOS in one platform."),
    FaqItem("How does the SOS button work?", "Hold the red SOS button for 3 seconds to activate an emergency alert. Your GPS coordinates are sent to Mission Atlas authorities in real-time via Supabase. You can also directly call 112 (emergency) or 108 (ambulance)."),
    FaqItem("What is the Blockchain Digital ID?", "Your tourist identity is registered on the Polygon Amoy blockchain, providing tamper-proof verification. Authorities can verify your identity instantly without a central database, protecting your privacy."),
    FaqItem("What are geo-fences?", "Geo-fences are virtual boundaries around sensitive or dangerous areas in NE India. When you enter or exit a fenced zone, you receive automatic safety alerts. This helps prevent tourists from unknowingly entering restricted areas."),
    FaqItem("How does the AI itinerary work?", "Select places to visit in a NE India state, enter your travel dates, and our LLaMA AI generates a day-by-day itinerary with timings, local food recommendations, transportation tips, and safety advice."),
    FaqItem("Does the app work offline?", "Basic navigation and your saved itinerary work offline. Safety alerts and live incident data require an internet connection. We recommend downloading key areas before traveling to remote zones."),
    FaqItem("How is my data protected?", "All personal data is encrypted via Supabase (PostgreSQL with Row Level Security). Your identity on the blockchain is stored only as a cryptographic hash — no personal data is written on-chain."),
    FaqItem("Which states are covered?", "All 7 Northeast India states: Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, and Tripura. 14+ geo-fence zones are pre-configured for popular tourist destinations."),
)

private data class FeatureItem(val icon: ImageVector, val title: String, val description: String, val color: Color)

@Composable
fun InfoScreen() {
    val features = listOf(
        FeatureItem(Icons.Filled.Warning,   "Emergency SOS",        "Hold-to-activate with GPS tracking and instant authority notification",  AtlasRed),
        FeatureItem(Icons.Filled.Map,       "Live Safety Map",      "OSMDroid-powered map with real-time incident overlays and geo-fences",   AtlasBlue),
        FeatureItem(Icons.Filled.SmartToy,  "AI Itinerary",         "LLaMA-powered day-by-day travel plans with safety advice",             Color(0xFF9C27B0)),
        FeatureItem(Icons.Filled.Security,  "Blockchain ID",        "Tamper-proof digital identity on Polygon Amoy testnet",                  Color(0xFFFF8C00)),
        FeatureItem(Icons.Filled.LocationOn,"Geo-fencing",          "14+ NE India zones with automatic entry/exit alerts",                   AtlasGreen),
        FeatureItem(Icons.Filled.Dashboard, "Authority Dashboard",  "Real-time web dashboard for tourism authorities and emergency services", AtlasBlue),
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Hero banner
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(
                        Brush.horizontalGradient(listOf(Color(0xFF1A3A5C), AtlasBlue)),
                        shape = RoundedCornerShape(20.dp),
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Mission Atlas", style = MaterialTheme.typography.headlineMedium, color = Color.White, fontWeight = FontWeight.Bold)
                    Text("SevenShield — NE India Tourist Safety", style = MaterialTheme.typography.bodyMedium, color = Color.White.copy(alpha = 0.85f))
                    Spacer(Modifier.height(4.dp))
                    Text("Smart India Hackathon 2025 · SIH25002", style = MaterialTheme.typography.bodySmall, color = Color.White.copy(alpha = 0.6f))
                }
            }
        }

        // Seven Shields features
        item {
            Text("Seven Shields", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }

        items(features.size) { i ->
            val feature = features[i]
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                elevation = CardDefaults.cardElevation(2.dp),
            ) {
                Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(feature.color.copy(alpha = 0.12f), shape = RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(feature.icon, contentDescription = null, tint = feature.color, modifier = Modifier.size(24.dp))
                    }
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text(feature.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        Text(feature.description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }

        // FAQ heading
        item {
            Spacer(Modifier.height(4.dp))
            Text("Frequently Asked Questions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }

        // FAQ accordion items
        itemsIndexed(FAQ_ITEMS) { _, faq ->
            FaqCard(faq)
        }

        // Team info
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Team Mission Atlas", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    Spacer(Modifier.height(8.dp))
                    Text("Team ID: 79460", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f))
                    Text("Smart India Hackathon 2025", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f))
                    Text("Problem: SIH25002 — Travel & Tourism", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f))
                }
            }
        }

        item { Spacer(Modifier.height(8.dp)) }
    }
}

@Composable
private fun FaqCard(faq: FaqItem) {
    var expanded by remember { mutableStateOf(false) }
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(1.dp),
        onClick = { expanded = !expanded },
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    faq.question,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.weight(1f),
                )
                Icon(
                    imageVector = if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (expanded) {
                Spacer(Modifier.height(8.dp))
                Text(
                    faq.answer,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    lineHeight = MaterialTheme.typography.bodySmall.lineHeight,
                )
            }
        }
    }
}
