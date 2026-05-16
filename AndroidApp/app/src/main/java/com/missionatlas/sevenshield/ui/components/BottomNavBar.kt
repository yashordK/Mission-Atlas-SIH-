package com.missionatlas.sevenshield.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.missionatlas.sevenshield.ui.theme.AtlasRed

sealed class BottomNavItem(val route: String, val icon: ImageVector, val label: String) {
    object Home    : BottomNavItem("home",    Icons.Filled.Home,      "Home")
    object Map     : BottomNavItem("map",     Icons.Filled.LocationOn,"Map")
    object SOS     : BottomNavItem("sos",     Icons.Filled.Warning,   "SOS")
    object Profile : BottomNavItem("profile", Icons.Filled.Person,    "Profile")
    object Info    : BottomNavItem("info",    Icons.Filled.Info,      "Info")
}

@Composable
fun BottomNavBar(navController: NavController) {
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Map,
        BottomNavItem.SOS,
        BottomNavItem.Profile,
        BottomNavItem.Info,
    )
    val backStack = navController.currentBackStackEntryAsState()
    val currentRoute = backStack.value?.destination?.route

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = NavigationBarDefaults.Elevation,
    ) {
        items.forEach { item ->
            val selected = currentRoute == item.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(navController.graph.startDestinationId) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.label,
                        tint = when {
                            item is BottomNavItem.SOS -> AtlasRed
                            selected -> MaterialTheme.colorScheme.primary
                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                        },
                    )
                },
                label = {
                    Text(
                        text = item.label,
                        style = MaterialTheme.typography.labelSmall,
                        color = if (item is BottomNavItem.SOS) AtlasRed
                                else if (selected) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = if (item is BottomNavItem.SOS)
                        AtlasRed.copy(alpha = 0.15f)
                    else MaterialTheme.colorScheme.primaryContainer,
                ),
            )
        }
    }
}
