package com.missionatlas.sevenshield.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.missionatlas.sevenshield.ui.components.BottomNavBar
import com.missionatlas.sevenshield.ui.components.BottomNavItem
import com.missionatlas.sevenshield.ui.screens.home.HomeScreen
import com.missionatlas.sevenshield.ui.screens.info.InfoScreen
import com.missionatlas.sevenshield.ui.screens.map.MapScreen
import com.missionatlas.sevenshield.ui.screens.profile.ProfileScreen
import com.missionatlas.sevenshield.ui.screens.sos.SosScreen

@Composable
fun NavGraph() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = { BottomNavBar(navController) },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavItem.Home.route,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable(BottomNavItem.Home.route)    { HomeScreen() }
            composable(BottomNavItem.Map.route)     { MapScreen() }
            composable(BottomNavItem.SOS.route)     { SosScreen() }
            composable(BottomNavItem.Profile.route) { ProfileScreen() }
            composable(BottomNavItem.Info.route)    { InfoScreen() }
        }
    }
}
