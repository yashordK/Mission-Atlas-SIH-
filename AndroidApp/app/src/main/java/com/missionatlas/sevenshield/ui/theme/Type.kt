package com.missionatlas.sevenshield.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.Font
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.unit.sp
import com.missionatlas.sevenshield.R

val provider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage   = "com.google.android.gms",
    certificates      = R.array.com_google_android_gms_fonts_certs,
)

val DmSans = GoogleFont("DM Sans")

val DmSansFontFamily = FontFamily(
    Font(googleFont = DmSans, fontProvider = provider, weight = FontWeight.Normal),
    Font(googleFont = DmSans, fontProvider = provider, weight = FontWeight.Medium),
    Font(googleFont = DmSans, fontProvider = provider, weight = FontWeight.SemiBold),
    Font(googleFont = DmSans, fontProvider = provider, weight = FontWeight.Bold),
    Font(googleFont = DmSans, fontProvider = provider, weight = FontWeight.Black),
)

val MissionAtlasTypography = Typography(
    displayLarge  = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Black,    fontSize = 32.sp, letterSpacing = (-0.5).sp),
    headlineLarge = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Bold,     fontSize = 24.sp),
    headlineMedium= TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 20.sp),
    titleLarge    = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 18.sp),
    titleMedium   = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Medium,   fontSize = 16.sp),
    bodyLarge     = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Normal,   fontSize = 15.sp, lineHeight = 22.sp),
    bodyMedium    = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Normal,   fontSize = 14.sp, lineHeight = 20.sp),
    labelLarge    = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Medium,   fontSize = 13.sp),
    bodySmall     = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Normal,   fontSize = 11.sp, lineHeight = 16.sp),
    labelSmall    = TextStyle(fontFamily = DmSansFontFamily, fontWeight = FontWeight.Medium,   fontSize = 11.sp, letterSpacing = 0.5.sp),
)
