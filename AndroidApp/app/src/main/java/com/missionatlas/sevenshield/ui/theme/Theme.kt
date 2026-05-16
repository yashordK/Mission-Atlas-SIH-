package com.missionatlas.sevenshield.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary          = LightPrimary,
    onPrimary        = LightOnPrimary,
    primaryContainer = Color(0xFFD6EAFF),
    secondary        = LightSecondary,
    onSecondary      = LightOnPrimary,
    background       = LightBackground,
    surface          = LightSurface,
    onSurface        = LightOnSurface,
    error            = LightError,
    onError          = LightOnPrimary,
)

private val DarkColorScheme = darkColorScheme(
    primary          = DarkPrimary,
    onPrimary        = DarkOnPrimary,
    primaryContainer = Color(0xFF00325A),
    secondary        = DarkSecondary,
    onSecondary      = Color.Black,
    background       = DarkBackground,
    surface          = DarkSurface,
    onSurface        = DarkOnSurface,
    error            = DarkError,
    onError          = Color.White,
)

@Composable
fun MissionAtlasTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content,
    )
}
