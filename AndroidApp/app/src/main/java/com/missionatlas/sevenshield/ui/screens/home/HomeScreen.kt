package com.missionatlas.sevenshield.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import com.missionatlas.sevenshield.ui.theme.AtlasBlue
import com.missionatlas.sevenshield.ui.theme.AtlasGreen
import com.missionatlas.sevenshield.ui.theme.AtlasRed
import com.missionatlas.sevenshield.ui.theme.StateColors
import android.content.Intent
import android.net.Uri
import androidx.compose.ui.platform.LocalContext

private val NE_STATES = listOf(
    "Arunachal Pradesh", "Assam", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Tripura",
)

private val FAMOUS_PLACES = mapOf(
    "Arunachal Pradesh" to listOf("Tawang Monastery","Ziro Valley","Sela Pass","Bomdila","Namdapha National Park","Dirang","Gorichen Peak","Itanagar","Pasighat","Pakhui Wildlife Sanctuary","Mechuka Valley","Jiro Lake","Parshuram Kund","Bum La Pass","Talley Valley Wildlife Sanctuary"),
    "Assam"             to listOf("Kaziranga National Park","Kamakhya Temple","Majuli Island","Manas National Park","Sivasagar","Haflong","Dibrugarh","Umananda Island","Pobitora Wildlife Sanctuary","Tezpur","Dipor Bil","Jorhat","Barak Valley","Chandubi Lake","Assam State Zoo"),
    "Manipur"           to listOf("Loktak Lake","Imphal War Cemetery","Kangla Fort","Keibul Lamjao National Park","Shirui Hills","INA Memorial","Tharon Cave","Sangai Festival","Sendra Island","Manipur State Museum","Leimaram Waterfall","Khonghampat Orchidarium","Andro Village","Bishnupur","Red Hill Lokpaching"),
    "Meghalaya"         to listOf("Shillong Peak","Mawlynnong Village","Nohkalikai Falls","Cherrapunji","Umiam Lake","Dawki River","Elephant Falls","Laitlum Canyons","Mawsmai Cave","Living Root Bridges","Balpakram National Park","Siju Cave","Ward's Lake","Don Bosco Museum","Jaintia Hills"),
    "Mizoram"           to listOf("Phawngpui Blue Mountain","Reiek Tlang","Vantawng Falls","Aizawl","Tam Dil Lake","Hmuifang","Murlen National Park","Lunglei","Palak Lake","Saiha","Dampa Tiger Reserve","Serchhip","Rih Dil","Champhai","Thenzawl"),
    "Nagaland"          to listOf("Dzukou Valley","Kohima War Cemetery","Khonoma Village","Hornbill Festival","Shilloi Lake","Mokokchung","Tuophema Village","Japfu Peak","Dimapur","Triple Falls","Longwa Village","Mount Tiyi","Nagaland State Museum","Pfutsero","Meluri"),
    "Tripura"           to listOf("Ujjayanta Palace","Neermahal","Tripura Sundari Temple","Jampui Hills","Sepahijala Wildlife Sanctuary","Unakoti","Dumboor Lake","Bhuvaneswari Temple","Kamalasagar Lake","Heritage Park","Chabimura","Melaghar","Boxanagar","Pilak","Rudrasagar Lake"),
)

@Composable
fun HomeScreen(viewModel: HomeViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(4.dp),
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Brush.radialGradient(listOf(AtlasBlue, Color(0xFF00325A)))),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("MA", color = Color.White, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text("Mission Atlas", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("SevenShield NE India", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }

        // Welcome banner
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Brush.horizontalGradient(listOf(Color(0xFF1A3A5C), AtlasBlue))),
                contentAlignment = Alignment.BottomStart,
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Welcome Back!", style = MaterialTheme.typography.headlineMedium, color = Color.White, fontWeight = FontWeight.Bold)
                    Text("Explore Northeast India safely", style = MaterialTheme.typography.bodyMedium, color = Color.White.copy(alpha = 0.8f))
                }
            }
        }

        // Destinations heading
        item {
            Text("Where do you want to go?", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
        }

        // State cards
        items(NE_STATES) { stateName ->
            StateCard(
                stateName = stateName,
                onClick = { viewModel.openModal(stateName) },
            )
        }

        // Emergency services
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(2.dp),
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Emergency Services", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(12.dp))
                    EmergencyServiceRow(
                        label = "Emergency: 112",
                        color = AtlasRed,
                        onClick = { context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:112"))) },
                    )
                    Spacer(Modifier.height(8.dp))
                    EmergencyServiceRow(
                        label = "Ambulance: 108",
                        color = AtlasGreen,
                        onClick = { context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:108"))) },
                    )
                }
            }
        }

        item { Spacer(Modifier.height(8.dp)) }
    }

    // Itinerary Modal
    if (state.showModal) {
        ItineraryModal(
            stateName = state.selectedState ?: "",
            places = FAMOUS_PLACES[state.selectedState] ?: emptyList(),
            selectedPlaces = state.selectedPlaces,
            tripDates = state.tripDates,
            step = state.modalStep,
            itinerary = state.itinerary,
            isLoading = state.isLoading,
            error = state.error,
            onTogglePlace = viewModel::togglePlace,
            onDatesChange = viewModel::setTripDates,
            onNext = viewModel::nextStep,
            onPrev = viewModel::prevStep,
            onGenerate = viewModel::generateItinerary,
            onDismiss = viewModel::dismissModal,
            onClearError = viewModel::clearError,
        )
    }
}

@Composable
private fun StateCard(stateName: String, onClick: () -> Unit) {
    val colors = StateColors[stateName] ?: Pair(Color(0xFF1A3A5C), Color(0xFF2D7DD2))
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(14.dp),
        elevation = CardDefaults.cardElevation(2.dp),
    ) {
        Row(
            modifier = Modifier
                .background(Brush.horizontalGradient(listOf(colors.first.copy(alpha = 0.08f), colors.second.copy(alpha = 0.08f))))
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(52.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Brush.radialGradient(listOf(colors.first, colors.second))),
                contentAlignment = Alignment.Center,
            ) {
                Text(stateName.take(2).uppercase(), color = Color.White, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Text(stateName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text("Tap to plan itinerary", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(Icons.Filled.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun EmergencyServiceRow(label: String, color: Color, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(color.copy(alpha = 0.1f))
            .clickable(onClick = onClick)
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(Icons.Filled.Phone, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(10.dp))
        Text(label, style = MaterialTheme.typography.bodyMedium, color = color, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun ItineraryModal(
    stateName: String,
    places: List<String>,
    selectedPlaces: List<String>,
    tripDates: String,
    step: Int,
    itinerary: String,
    isLoading: Boolean,
    error: String?,
    onTogglePlace: (String) -> Unit,
    onDatesChange: (String) -> Unit,
    onNext: () -> Unit,
    onPrev: () -> Unit,
    onGenerate: () -> Unit,
    onDismiss: () -> Unit,
    onClearError: () -> Unit,
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false),
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 8.dp,
        ) {
            Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
                // Header row
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Filled.Close, contentDescription = "Close")
                    }
                    Text(stateName, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                }
                Spacer(Modifier.height(8.dp))

                // Step indicator
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    repeat(3) { i ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(5.dp)
                                .clip(RoundedCornerShape(3.dp))
                                .background(if (i < step) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))

                // Error snackbar
                if (error != null) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(error, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onErrorContainer, modifier = Modifier.weight(1f))
                            IconButton(onClick = onClearError, modifier = Modifier.size(24.dp)) {
                                Icon(Icons.Filled.Close, contentDescription = "Dismiss", modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                }

                // Step 1: Select places
                if (step == 1) {
                    Text("Select Places to Visit", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(places) { place ->
                            val selected = selectedPlaces.contains(place)
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (selected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant)
                                    .clickable { onTogglePlace(place) }
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Checkbox(checked = selected, onCheckedChange = { onTogglePlace(place) })
                                Spacer(Modifier.width(8.dp))
                                Text(place, style = MaterialTheme.typography.bodyMedium)
                            }
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = onNext,
                        enabled = selectedPlaces.isNotEmpty(),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                    ) {
                        Text("Next (${selectedPlaces.size} selected)")
                    }
                }

                // Step 2: Enter dates
                if (step == 2) {
                    Text("Enter Trip Dates", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = tripDates,
                        onValueChange = onDatesChange,
                        label = { Text("Trip dates") },
                        placeholder = { Text("e.g. 2025-09-20, 2025-09-21") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = false,
                        minLines = 2,
                    )
                    Text(
                        "Enter comma-separated dates",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.weight(1f))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = onPrev, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp)) {
                            Text("Back")
                        }
                        Button(
                            onClick = onGenerate,
                            enabled = !isLoading && tripDates.isNotBlank(),
                            modifier = Modifier.weight(2f),
                            shape = RoundedCornerShape(12.dp),
                        ) {
                            if (isLoading) CircularProgressIndicator(modifier = Modifier.size(20.dp), strokeWidth = 2.dp, color = MaterialTheme.colorScheme.onPrimary)
                            else Text("Generate Itinerary")
                        }
                    }
                }

                // Step 3: Show itinerary
                if (step == 3) {
                    Text("Your AI Itinerary", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    if (isLoading) {
                        Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                CircularProgressIndicator()
                                Spacer(Modifier.height(12.dp))
                                Text("Generating with LLaMA…", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    } else {
                        LazyColumn(modifier = Modifier.weight(1f)) {
                            item {
                                Text(itinerary, style = MaterialTheme.typography.bodyMedium, lineHeight = MaterialTheme.typography.bodyMedium.lineHeight)
                            }
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = onPrev, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp)) {
                            Text("Regenerate")
                        }
                        Button(onClick = onDismiss, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp)) {
                            Text("Done")
                        }
                    }
                }
            }
        }
    }
}
