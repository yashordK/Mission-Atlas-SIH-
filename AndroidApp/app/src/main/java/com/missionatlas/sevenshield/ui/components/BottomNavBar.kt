package com.missionatlas.sevenshield.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Forum
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.missionatlas.sevenshield.ui.theme.*

sealed class BottomNavItem(val route: String, val icon: ImageVector, val label: String) {
    object Home    : BottomNavItem("home",    Icons.Filled.Home,      "Home")
    object Map     : BottomNavItem("map",     Icons.Filled.LocationOn,"Map")
    object SOS     : BottomNavItem("sos",     Icons.Filled.Warning,   "SOS")
    object Profile : BottomNavItem("profile", Icons.Filled.Person,    "Profile")
    object Chat    : BottomNavItem("info",    Icons.Filled.Forum,     "Chat")
}

@Composable
fun BottomNavBar(navController: NavController) {
    val backStack = navController.currentBackStackEntryAsState()
    val currentRoute = backStack.value?.destination?.route

    val leftItems  = listOf(BottomNavItem.Home, BottomNavItem.Map)
    val rightItems = listOf(BottomNavItem.Profile, BottomNavItem.Chat)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
            .background(
                Brush.verticalGradient(
                    listOf(Color.Transparent, Black900.copy(alpha = 0.95f))
                )
            )
            .background(Black900.copy(alpha = 0.92f)),
    ) {
        // Left + right tabs + SOS center
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceEvenly,
        ) {
            // Left tabs
            leftItems.forEach { item ->
                NavTabItem(
                    item = item,
                    selected = currentRoute == item.route,
                    onClick = { navigateTo(navController, item.route) },
                    modifier = Modifier.weight(1f),
                )
            }

            // Raised SOS button in center
            Box(
                modifier = Modifier
                    .weight(1f)
                    .wrapContentSize(Alignment.Center),
                contentAlignment = Alignment.Center,
            ) {
                SosNavButton(
                    selected = currentRoute == BottomNavItem.SOS.route,
                    onClick = { navigateTo(navController, BottomNavItem.SOS.route) },
                )
            }

            // Right tabs
            rightItems.forEach { item ->
                NavTabItem(
                    item = item,
                    selected = currentRoute == item.route,
                    onClick = { navigateTo(navController, item.route) },
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun NavTabItem(
    item: BottomNavItem,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val scale by animateFloatAsState(targetValue = if (selected) 1.05f else 1f, label = "tab_scale")
    Column(
        modifier = modifier
            .scale(scale)
            .clip(RoundedCornerShape(12.dp))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            )
            .padding(vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Icon(
            imageVector = item.icon,
            contentDescription = item.label,
            tint = if (selected) ElectricBlue else TextTertiary,
            modifier = Modifier.size(22.dp),
        )
        Spacer(Modifier.height(3.dp))
        Text(
            text = item.label,
            fontSize = 10.sp,
            color = if (selected) ElectricBlue else TextTertiary,
        )
    }
}

@Composable
private fun SosNavButton(selected: Boolean, onClick: () -> Unit) {
    val scale by animateFloatAsState(targetValue = if (selected) 0.92f else 1f, label = "sos_scale")
    Box(
        modifier = Modifier
            .offset(y = (-16).dp)
            .size(64.dp)
            .scale(scale),
        contentAlignment = Alignment.Center,
    ) {
        // Glow layer
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(CircleShape)
                .background(EmergencyRedGlow),
        )
        // Button
        Box(
            modifier = Modifier
                .size(58.dp)
                .shadow(8.dp, CircleShape)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(listOf(EmergencyRedBright, EmergencyRed))
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onClick,
                ),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Filled.Warning,
                contentDescription = "SOS",
                tint = Color.White,
                modifier = Modifier.size(28.dp),
            )
        }
    }
}

private fun navigateTo(navController: NavController, route: String) {
    navController.navigate(route) {
        popUpTo(navController.graph.startDestinationId) { saveState = true }
        launchSingleTop = true
        restoreState = true
    }
}
