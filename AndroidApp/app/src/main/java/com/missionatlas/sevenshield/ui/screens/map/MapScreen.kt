package com.missionatlas.sevenshield.ui.screens.map

import android.Manifest
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import com.missionatlas.sevenshield.data.model.Incident
import com.missionatlas.sevenshield.ui.theme.AtlasBlue
import com.missionatlas.sevenshield.ui.theme.AtlasGreen
import com.missionatlas.sevenshield.ui.theme.AtlasOrange
import com.missionatlas.sevenshield.ui.theme.AtlasRed
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polygon

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MapScreen(viewModel: MapViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val locationPermission = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)

    LaunchedEffect(locationPermission.status.isGranted) {
        if (locationPermission.status.isGranted) {
            viewModel.fetchLocation()
        } else {
            locationPermission.launchPermissionRequest()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        OsmMapView(
            userLat = state.userLat,
            userLng = state.userLng,
            incidents = state.incidents,
        )

        // FAB cluster
        Column(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            FloatingActionButton(
                onClick = { viewModel.refresh() },
                modifier = Modifier.size(48.dp),
                shape = CircleShape,
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Icon(Icons.Filled.Refresh, contentDescription = "Refresh", tint = MaterialTheme.colorScheme.primary)
            }
            FloatingActionButton(
                onClick = { viewModel.fetchLocation() },
                shape = CircleShape,
                containerColor = MaterialTheme.colorScheme.primary,
            ) {
                Icon(Icons.Filled.MyLocation, contentDescription = "My Location", tint = MaterialTheme.colorScheme.onPrimary)
            }
        }

        // Loading overlay
        if (state.isLoadingLocation) {
            Card(
                modifier = Modifier.align(Alignment.TopCenter).padding(top = 16.dp),
                shape = RoundedCornerShape(24.dp),
            ) {
                Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                    Spacer(Modifier.width(8.dp))
                    Text("Getting location…", style = MaterialTheme.typography.bodySmall)
                }
            }
        }

        // Incident count chip
        if (state.incidents.isNotEmpty()) {
            Card(
                modifier = Modifier.align(Alignment.TopStart).padding(16.dp),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
            ) {
                Text(
                    "${state.incidents.size} active incidents",
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                )
            }
        }
    }
}

@Composable
private fun OsmMapView(userLat: Double, userLng: Double, incidents: List<Incident>) {
    val lifecycleOwner = LocalLifecycleOwner.current
    val context = LocalContext.current

    val mapView = remember {
        MapView(context).apply {
            setTileSource(TileSourceFactory.MAPNIK)
            setMultiTouchControls(true)
            controller.setZoom(10.0)
            controller.setCenter(GeoPoint(userLat, userLng))
        }
    }

    // Update map center when location changes
    LaunchedEffect(userLat, userLng) {
        mapView.controller.animateTo(GeoPoint(userLat, userLng))

        // User location marker
        mapView.overlays.removeAll { it is Marker && (it as? Marker)?.id == "user" }
        val userMarker = Marker(mapView).apply {
            id = "user"
            position = GeoPoint(userLat, userLng)
            title = "You are here"
            setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        }
        mapView.overlays.add(userMarker)
        mapView.invalidate()
    }

    // Draw incident overlays
    LaunchedEffect(incidents) {
        mapView.overlays.removeAll { it is Polygon }
        incidents.forEach { incident ->
            val lat = incident.latitude ?: return@forEach
            val lng = incident.longitude ?: return@forEach
            val radius = when (incident.severity) { "high" -> 2000.0; "medium" -> 1500.0; else -> 1000.0 }
            val color = when (incident.severity) {
                "high"   -> android.graphics.Color.argb(60, 255, 59, 48)
                "medium" -> android.graphics.Color.argb(60, 255, 149, 0)
                else     -> android.graphics.Color.argb(60, 52, 199, 89)
            }
            val circle = Polygon(mapView).apply {
                points = Polygon.pointsAsCircle(GeoPoint(lat, lng), radius)
                fillColor = color
                strokeColor = android.graphics.Color.TRANSPARENT
                title = incident.title
            }
            mapView.overlays.add(circle)
        }
        mapView.invalidate()
    }

    // Lifecycle management
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
