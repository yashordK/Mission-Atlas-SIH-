package com.missionatlas.sevenshield.ui.screens.map

import android.Manifest
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.missionatlas.sevenshield.data.model.Incident
import com.missionatlas.sevenshield.ui.theme.*
import org.osmdroid.tileprovider.tilesource.XYTileSource
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polygon

private val DARK_TILE_SOURCE = XYTileSource(
    "CartoDB.DarkMatter", 0, 19, 256, ".png",
    arrayOf(
        "https://a.basemaps.cartocdn.com/dark_all/",
        "https://b.basemaps.cartocdn.com/dark_all/",
        "https://c.basemaps.cartocdn.com/dark_all/",
    ),
    "© OpenStreetMap contributors © CARTO"
)

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MapScreen(viewModel: MapViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val locationPermission = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) viewModel.fetchLocation()
        else locationPermission.launchPermissionRequest()
    }

    Box(modifier = Modifier.fillMaxSize().background(Black900)) {
        OsmMapView(userLat = state.userLat, userLng = state.userLng, incidents = state.incidents)

        // Incident bottom sheet (always visible, 180dp)
        if (state.incidents.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(Black900.copy(alpha = 0.88f)),
            ) {
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp)) {
                    Text(
                        "${state.incidents.size} ACTIVE INCIDENTS",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextTertiary,
                        letterSpacing = 1.5.sp,
                    )
                    Spacer(Modifier.height(8.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(state.incidents) { incident ->
                            IncidentChip(incident)
                        }
                    }
                }
            }
        }

        // FABs
        Column(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 16.dp, bottom = if (state.incidents.isNotEmpty()) 136.dp else 24.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            FloatingActionButton(
                onClick = { viewModel.refresh() },
                modifier = Modifier.size(44.dp),
                shape = CircleShape,
                containerColor = SurfaceElevated,
            ) {
                Icon(Icons.Filled.Refresh, "Refresh", tint = TextSecondary)
            }
            FloatingActionButton(
                onClick = { viewModel.fetchLocation() },
                shape = CircleShape,
                containerColor = ElectricBlue,
            ) {
                Icon(Icons.Filled.MyLocation, "My Location", tint = TextPrimary)
            }
        }

        // Loading pill
        if (state.isLoadingLocation) {
            Surface(
                modifier = Modifier.align(Alignment.TopCenter).padding(top = 16.dp),
                shape = RoundedCornerShape(24.dp),
                color = SurfaceElevated,
            ) {
                Row(Modifier.padding(horizontal = 14.dp, vertical = 7.dp), verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(Modifier.size(14.dp), strokeWidth = 2.dp, color = ElectricBlue)
                    Spacer(Modifier.width(8.dp))
                    Text("Getting location…", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }
        }
    }
}

@Composable
private fun IncidentChip(incident: Incident) {
    val (dotColor, bgColor) = when (incident.severity) {
        "high"   -> Pair(EmergencyRed,   EmergencyRed.copy(alpha = 0.12f))
        "medium" -> Pair(WarningAmber,   WarningAmber.copy(alpha = 0.12f))
        else     -> Pair(ElectricBlue,   ElectricBlue.copy(alpha = 0.12f))
    }
    Surface(shape = RoundedCornerShape(20.dp), color = bgColor) {
        Row(Modifier.padding(horizontal = 10.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(7.dp).clip(CircleShape).background(dotColor))
            Spacer(Modifier.width(6.dp))
            Text(
                incident.title.take(22).let { if (incident.title.length > 22) "$it…" else it },
                style = MaterialTheme.typography.labelLarge,
                color = TextPrimary,
            )
        }
    }
}

@Composable
private fun OsmMapView(userLat: Double, userLng: Double, incidents: List<Incident>) {
    val lifecycleOwner = LocalLifecycleOwner.current
    val context = LocalContext.current

    val mapView = remember {
        MapView(context).apply {
            setTileSource(DARK_TILE_SOURCE)
            setMultiTouchControls(true)
            controller.setZoom(10.0)
            controller.setCenter(GeoPoint(userLat, userLng))
        }
    }

    LaunchedEffect(userLat, userLng) {
        mapView.controller.animateTo(GeoPoint(userLat, userLng))
        mapView.overlays.removeAll { it is Marker && (it as? Marker)?.id == "user" }
        mapView.overlays.add(Marker(mapView).apply {
            id = "user"
            position = GeoPoint(userLat, userLng)
            title = "You are here"
            setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        })
        mapView.invalidate()
    }

    LaunchedEffect(incidents) {
        mapView.overlays.removeAll { it is Polygon }
        incidents.forEach { incident ->
            val lat = incident.latitude ?: return@forEach
            val lng = incident.longitude ?: return@forEach
            val radius = when (incident.severity) { "high" -> 2000.0; "medium" -> 1500.0; else -> 1000.0 }
            val argb = when (incident.severity) {
                "high"   -> android.graphics.Color.argb(70, 220, 38, 38)   // EmergencyRed
                "medium" -> android.graphics.Color.argb(70, 217, 119, 6)   // WarningAmber
                else     -> android.graphics.Color.argb(70, 37, 99, 235)   // ElectricBlue
            }
            mapView.overlays.add(Polygon(mapView).apply {
                points = Polygon.pointsAsCircle(GeoPoint(lat, lng), radius)
                fillColor = argb
                strokeColor = android.graphics.Color.TRANSPARENT
                title = incident.title
            })
        }
        mapView.invalidate()
    }

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> mapView.onResume()
                Lifecycle.Event.ON_PAUSE  -> mapView.onPause()
                else -> Unit
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
            mapView.onDetach()
        }
    }

    AndroidView(factory = { mapView }, modifier = Modifier.fillMaxSize())
}
