package com.missionatlas.sevenshield.ui.theme

import androidx.compose.ui.graphics.Color

// Mission Atlas brand palette
val AtlasBlue       = Color(0xFF007AFF)
val AtlasBlueLight  = Color(0xFF5AC8FA)
val AtlasBlueDark   = Color(0xFF0051D6)

val AtlasGreen      = Color(0xFF34C759)
val AtlasGreenDark  = Color(0xFF248A3D)

val AtlasRed        = Color(0xFFFF3B30)
val AtlasRedDark    = Color(0xFFCC2200)
val AtlasOrange     = Color(0xFFFF9500)

val AtlasDarkBg     = Color(0xFF0D0D0D)
val AtlasDarkSurface = Color(0xFF1A1A2E)
val AtlasCardDark   = Color(0xFF16213E)

// Light scheme seeds
val LightPrimary    = AtlasBlue
val LightOnPrimary  = Color.White
val LightBackground = Color(0xFFF5F7FA)
val LightSurface    = Color.White
val LightOnSurface  = Color(0xFF1C1C1E)
val LightSecondary  = AtlasGreen
val LightError      = AtlasRed

// Dark scheme seeds
val DarkPrimary     = AtlasBlueLight
val DarkOnPrimary   = Color(0xFF001E3C)
val DarkBackground  = Color(0xFF0D0D0D)
val DarkSurface     = Color(0xFF1A1A2E)
val DarkOnSurface   = Color(0xFFE8EAED)
val DarkSecondary   = AtlasGreen
val DarkError       = AtlasRed

// State-specific gradient pairs [start, end]
val StateColors = mapOf(
    "Arunachal Pradesh" to Pair(Color(0xFF1A3A5C), Color(0xFF2D7DD2)),
    "Assam"             to Pair(Color(0xFF1A5C2A), Color(0xFF2DD27D)),
    "Manipur"           to Pair(Color(0xFF4A1A5C), Color(0xFF8A2BE2)),
    "Meghalaya"         to Pair(Color(0xFF1A2A3C), Color(0xFF4A7D8A)),
    "Mizoram"           to Pair(Color(0xFF5C2A1A), Color(0xFFD2552D)),
    "Nagaland"          to Pair(Color(0xFF1A3C1A), Color(0xFF2D8A4A)),
    "Tripura"           to Pair(Color(0xFF1A3C3C), Color(0xFF2D8A8A)),
)
