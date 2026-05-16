package com.missionatlas.sevenshield.ui.screens.home

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import com.missionatlas.sevenshield.ui.theme.*

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
            .background(Black900),
        contentPadding = PaddingValues(bottom = 16.dp),
        verticalArrangement = Arrangement.spacedBy(0.dp),
    ) {
        // ── Hero card ──────────────────────────────────────────────────────────
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp)),
            ) {
                // Gradient bg
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(ElectricBlueDim, Black700, Black900),
                                start = Offset(0f, 0f),
                                end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY),
                            )
                        )
                )
                // Grid overlay
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val spacing = 28.dp.toPx()
                    val lineColor = Color.White.copy(alpha = 0.05f)
                    var x = 0f
                    while (x < size.width) {
                        drawLine(lineColor, Offset(x, 0f), Offset(x, size.height), 1f)
                        x += spacing
                    }
                    var y = 0f
                    while (y < size.height) {
                        drawLine(lineColor, Offset(0f, y), Offset(size.width, y), 1f)
                        y += spacing
                    }
                }
                // Text
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(20.dp),
                ) {
                    Text(
                        "Where do you want to go?",
                        style = MaterialTheme.typography.displayLarge,
                        color = TextPrimary,
                    )
                    Text(
                        "Northeast India",
                        style = MaterialTheme.typography.bodyLarge,
                        color = TextSecondary,
                    )
                }
            }
        }

        // ── Emergency chips ────────────────────────────────────────────────────
        item {
            Row(
                modifier = Modifier
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                EmergencyChip(
                    label = "Police 100",
                    color = ElectricBlue,
                    icon = { Icon(Icons.Filled.Shield, null, modifier = Modifier.size(14.dp), tint = ElectricBlue) },
                    onClick = { context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:100"))) },
                )
                EmergencyChip(
                    label = "Ambulance 108",
                    color = SafeGreen,
                    icon = { Icon(Icons.Filled.LocalHospital, null, modifier = Modifier.size(14.dp), tint = SafeGreen) },
                    onClick = { context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:108"))) },
                )
                EmergencyChip(
                    label = "Emergency 112",
                    color = EmergencyRed,
                    icon = { Icon(Icons.Filled.Call, null, modifier = Modifier.size(14.dp), tint = EmergencyRed) },
                    onClick = { context.startActivity(Intent(Intent.ACTION_CALL, Uri.parse("tel:112"))) },
                )
            }
        }

        // ── Section header ─────────────────────────────────────────────────────
        item {
            Text(
                "DESTINATIONS",
                style = MaterialTheme.typography.bodySmall,
                color = TextTertiary,
                fontWeight = FontWeight.Medium,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
            )
        }

        // ── State cards ────────────────────────────────────────────────────────
        items(NE_STATES) { stateName ->
            DarkStateCard(
                stateName = stateName,
                onClick = { viewModel.openModal(stateName) },
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
            )
        }

        item { Spacer(Modifier.height(16.dp)) }
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
private fun DarkStateCard(stateName: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val colors = StateColors[stateName] ?: Pair(ElectricBlueDim, ElectricBlue)
    val interactionSource = remember { MutableInteractionSource() }
    val pressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(if (pressed) 0.97f else 1f, label = "card_scale")

    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(100.dp)
            .graphicsLayer { scaleX = scale; scaleY = scale }
            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
            .clickable(interactionSource = interactionSource, indication = null, onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = SurfaceElevated),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(0.dp),
    ) {
        Row(modifier = Modifier.fillMaxSize()) {
            // Left gradient panel (image placeholder)
            Box(
                modifier = Modifier
                    .width(80.dp)
                    .fillMaxHeight()
                    .background(
                        Brush.linearGradient(listOf(colors.first, colors.second)),
                        shape = RoundedCornerShape(topStart = 16.dp, bottomStart = 16.dp),
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    stateName.take(2).uppercase(),
                    color = Color.White.copy(alpha = 0.9f),
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp,
                )
            }
            // Name
            Text(
                stateName,
                style = MaterialTheme.typography.titleLarge,
                color = TextPrimary,
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp)
                    .align(Alignment.CenterVertically),
            )
            // Chevron
            Icon(
                Icons.Filled.ChevronRight,
                contentDescription = null,
                tint = TextTertiary,
                modifier = Modifier
                    .size(20.dp)
                    .align(Alignment.CenterVertically)
                    .padding(end = 16.dp),
            )
        }
    }
}

@Composable
private fun EmergencyChip(
    label: String,
    color: Color,
    icon: @Composable () -> Unit,
    onClick: () -> Unit,
) {
    Surface(
        onClick = onClick,
        color = color.copy(alpha = 0.12f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.border(1.dp, color.copy(alpha = 0.25f), RoundedCornerShape(12.dp)),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            icon()
            Text(label, style = MaterialTheme.typography.labelLarge, color = color)
        }
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
    Dialog(onDismissRequest = onDismiss, properties = DialogProperties(usePlatformDefaultWidth = false)) {
        Surface(
            modifier = Modifier.fillMaxWidth(0.95f).fillMaxHeight(0.9f),
            shape = RoundedCornerShape(20.dp),
            color = SurfaceElevated,
            tonalElevation = 0.dp,
        ) {
            Column(modifier = Modifier.fillMaxSize().padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Filled.Close, null, tint = TextPrimary)
                    }
                    Text(stateName, style = MaterialTheme.typography.titleLarge, color = TextPrimary, modifier = Modifier.weight(1f))
                }
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    repeat(3) { i ->
                        Box(
                            modifier = Modifier.weight(1f).height(4.dp).clip(RoundedCornerShape(2.dp))
                                .background(if (i < step) ElectricBlue else SurfaceBorder)
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))

                if (error != null) {
                    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF7F1D1D)), modifier = Modifier.fillMaxWidth()) {
                        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text(error, style = MaterialTheme.typography.bodySmall, color = Color(0xFFFCA5A5), modifier = Modifier.weight(1f))
                            IconButton(onClick = onClearError, modifier = Modifier.size(24.dp)) {
                                Icon(Icons.Filled.Close, null, modifier = Modifier.size(16.dp), tint = Color(0xFFFCA5A5))
                            }
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                }

                when (step) {
                    1 -> {
                        Text("Select Places to Visit", style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Spacer(Modifier.height(8.dp))
                        androidx.compose.foundation.lazy.LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(places) { place ->
                                val selected = selectedPlaces.contains(place)
                                Row(
                                    modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp))
                                        .background(if (selected) ElectricBlue.copy(0.2f) else SurfaceDark)
                                        .border(1.dp, if (selected) ElectricBlue.copy(0.4f) else SurfaceBorder, RoundedCornerShape(10.dp))
                                        .clickable { onTogglePlace(place) }.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    Checkbox(checked = selected, onCheckedChange = { onTogglePlace(place) },
                                        colors = CheckboxDefaults.colors(checkedColor = ElectricBlue, uncheckedColor = TextTertiary))
                                    Spacer(Modifier.width(8.dp))
                                    Text(place, style = MaterialTheme.typography.bodyMedium, color = if (selected) TextPrimary else TextSecondary)
                                }
                            }
                        }
                        Spacer(Modifier.height(12.dp))
                        Button(onClick = onNext, enabled = selectedPlaces.isNotEmpty(), modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp), colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)) {
                            Text("Next (${selectedPlaces.size} selected)")
                        }
                    }
                    2 -> {
                        Text("Enter Trip Dates", style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Spacer(Modifier.height(12.dp))
                        OutlinedTextField(
                            value = tripDates, onValueChange = onDatesChange,
                            label = { Text("Trip dates", color = TextSecondary) },
                            placeholder = { Text("e.g. 2025-09-20, 2025-09-21", color = TextTertiary) },
                            modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = ElectricBlue, unfocusedBorderColor = SurfaceBorder,
                                focusedTextColor = TextPrimary, unfocusedTextColor = TextPrimary,
                                cursorColor = ElectricBlue,
                            ),
                        )
                        Spacer(Modifier.weight(1f))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(onClick = onPrev, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp),
                                colors = OutlinedButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)) {
                                Text("Back")
                            }
                            Button(onClick = onGenerate, enabled = !isLoading && tripDates.isNotBlank(),
                                modifier = Modifier.weight(2f), shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)) {
                                if (isLoading) CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp, color = Color.White)
                                else Text("Generate Itinerary")
                            }
                        }
                    }
                    3 -> {
                        Text("Your AI Itinerary", style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Spacer(Modifier.height(8.dp))
                        if (isLoading) {
                            Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    CircularProgressIndicator(color = ElectricBlue)
                                    Spacer(Modifier.height(12.dp))
                                    Text("Generating with LLaMA…", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                }
                            }
                        } else {
                            androidx.compose.foundation.lazy.LazyColumn(modifier = Modifier.weight(1f)) {
                                item { Text(itinerary, style = MaterialTheme.typography.bodyMedium, color = TextPrimary, lineHeight = 22.sp) }
                            }
                        }
                        Spacer(Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedButton(onClick = onPrev, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp),
                                colors = OutlinedButtonDefaults.outlinedButtonColors(contentColor = TextPrimary)) {
                                Text("Regenerate")
                            }
                            Button(onClick = onDismiss, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)) {
                                Text("Done")
                            }
                        }
                    }
                }
            }
        }
    }
}
