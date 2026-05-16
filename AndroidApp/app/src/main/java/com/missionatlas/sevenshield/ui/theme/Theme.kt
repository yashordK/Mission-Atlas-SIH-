package com.missionatlas.sevenshield.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary           = ElectricBlue,
    onPrimary         = Color.White,
    primaryContainer  = Color(0xFF1E3A8A),
    onPrimaryContainer = Color(0xFFBFDBFE),
    secondary         = SafeGreen,
    onSecondary       = Color.White,
    background        = Black900,
    onBackground      = TextPrimary,
    surface           = SurfaceDark,
    onSurface         = TextPrimary,
    surfaceVariant    = SurfaceElevated,
    onSurfaceVariant  = TextSecondary,
    outline           = SurfaceBorder,
    error             = EmergencyRed,
    onError           = Color.White,
    errorContainer    = Color(0xFF7F1D1D),
    onErrorContainer  = Color(0xFFFCA5A5),
)

private val LightColorScheme = lightColorScheme(
    primary           = ElectricBlue,
    onPrimary         = Color.White,
    primaryContainer  = Color(0xFFDBEAFE),
    onPrimaryContainer = Color(0xFF1E3A8A),
    secondary         = SafeGreen,
    onSecondary       = Color.White,
    background        = LightBackground,
    onBackground      = LightTextPrimary,
    surface           = LightSurface,
    onSurface         = LightTextPrimary,
    surfaceVariant    = Color(0xFFF1F5F9),
    onSurfaceVariant  = LightTextSecondary,
    outline           = LightBorder,
    error             = EmergencyRed,
    onError           = Color.White,
)

private val AppShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small      = RoundedCornerShape(12.dp),
    medium     = RoundedCornerShape(16.dp),
    large      = RoundedCornerShape(20.dp),
    extraLarge = RoundedCornerShape(24.dp),
)

@Composable
fun MissionAtlasTheme(
    darkTheme: Boolean = true,
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
        typography  = MissionAtlasTypography,
        shapes      = AppShapes,
        content     = content,
    )
}
