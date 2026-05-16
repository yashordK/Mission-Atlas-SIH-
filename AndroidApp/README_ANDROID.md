# Mission Atlas — Android App

> Kotlin + Jetpack Compose native Android app for the SevenShield tourist safety platform.
> Connects to the same Supabase backend as the Expo mobile app.

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| UI | Jetpack Compose + Material3 |
| DI | Hilt (Dagger) |
| Navigation | Navigation Compose |
| Database | Supabase Kotlin SDK 2.1.4 |
| Network | Ktor Android client |
| Maps | OSMDroid 6.1.18 |
| Location | FusedLocationProviderClient |
| AI | Groq API (LLaMA 3 8B) |
| Images | Coil |
| State | StateFlow + collectAsState |

---

## Project Structure

```text
AndroidApp/
├── app/src/main/
│   ├── java/com/missionatlas/sevenshield/
│   │   ├── MissionAtlasApp.kt          # @HiltAndroidApp + OSMDroid config
│   │   ├── MainActivity.kt             # Edge-to-edge entry point
│   │   ├── di/
│   │   │   └── AppModule.kt            # Hilt: Supabase, Ktor, Groq, Repositories
│   │   ├── data/
│   │   │   ├── model/                  # Tourist, Incident, SosAlert, GroqModels
│   │   │   └── repository/
│   │   │       ├── SupabaseRepository.kt
│   │   │       └── GroqRepository.kt
│   │   └── ui/
│   │       ├── theme/                  # Color, Type, Theme (Material3 light+dark)
│   │       ├── navigation/NavGraph.kt  # Scaffold + NavHost + BottomNavBar
│   │       ├── components/BottomNavBar.kt
│   │       └── screens/
│   │           ├── home/               # NE India destinations + AI itinerary modal
│   │           ├── map/                # OSMDroid map + incident overlays
│   │           ├── sos/                # Hold-to-activate SOS + GPS + Supabase insert
│   │           ├── profile/            # Tourist profile + Blockchain ID
│   │           └── info/               # FAQ + SevenShield feature overview
│   ├── res/
│   │   ├── values/strings.xml
│   │   ├── values/themes.xml
│   │   └── xml/network_security_config.xml
│   └── AndroidManifest.xml
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── local.properties          ← NEVER COMMIT — contains API keys
└── README_ANDROID.md
```

---

## Prerequisites

- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK API 34 (compileSdk) with API 26 minimum (minSdk)
- Gradle 8.4 (auto-downloaded by wrapper)

---

## Setup

### Step 1 — Clone & open

```bash
# From the repo root:
cd AndroidApp
```

Open the `AndroidApp/` folder in Android Studio (**File → Open** → select `AndroidApp/`).

Android Studio will:
1. Detect Gradle and download it automatically
2. Sync the project and download all dependencies
3. Prompt you to add the Android SDK path to `local.properties`

### Step 2 — Verify local.properties

The `AndroidApp/local.properties` file should already contain:

```properties
sdk.dir=/path/to/your/Android/sdk    ← Android Studio adds this automatically
SUPABASE_URL=https://jxymgtxlrwknwufkdmqv.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
GROQ_API_KEY=gsk_...
```

If the API keys are missing, copy them from `app/.env`:
- `SUPABASE_URL` ← `EXPO_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` ← `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY` ← `EXPO_PUBLIC_GROQ_API_KEY`

### Step 3 — Run

- Connect an Android device (API 26+) or start an AVD
- Press ▶ Run in Android Studio, or:

```bash
./gradlew installDebug
```

---

## Features

### Home Screen
- 7 NE India state cards with gradient colors
- Tap any state → 3-step itinerary modal
  - Step 1: Select landmarks (15 per state)
  - Step 2: Enter trip dates
  - Step 3: AI-generated day-by-day itinerary via Groq LLaMA 3
- Emergency services quick-call buttons (112, 108)

### Map Screen
- OSMDroid OpenStreetMap centered on user location
- Colored circle overlays for incidents pulled from Supabase:
  - 🔴 Red = high severity (2 km radius)
  - 🟠 Orange = medium (1.5 km radius)
  - 🟢 Green = low (1 km radius)
- FAB to recenter on user location
- Auto-refresh every 60 seconds

### SOS Screen
- Full-screen emergency button — hold 3 seconds to activate
- Canvas-drawn circular progress arc during hold
- On activation:
  1. Vibration pattern (400ms on/off)
  2. GPS capture via FusedLocationProvider (high accuracy)
  3. Insert into `sos_alerts` Supabase table (triggers realtime to dashboard)
  4. Show confirmation with coordinates
- Direct call buttons: 112 (emergency) and 108 (ambulance)
- "Mark as Safe" / "Try Again" reset button
- Handles location permission inline

### Profile Screen
- Tourist digital identity card
- Personal info, emergency contact, medical info sections
- Blockchain Digital ID status (Polygon Amoy testnet)
- Light + dark theme

### Info Screen
- SevenShield feature overview (6 shields)
- Expandable FAQ accordion (8 items)
- Team Mission Atlas details

---

## Permissions

| Permission | Used For |
| ---------- | -------- |
| `INTERNET` | Supabase, Groq API, OSMDroid tiles |
| `ACCESS_FINE_LOCATION` | SOS GPS, Map centering |
| `ACCESS_COARSE_LOCATION` | Fallback location |
| `CALL_PHONE` | 112 / 108 direct call |
| `VIBRATE` | SOS haptic feedback |
| `ACCESS_NETWORK_STATE` | Network availability check |

---

## Build Variants

| Variant | Config |
| ------- | ------ |
| `debug` | BuildConfig with keys from local.properties |
| `release` | Same keys, minification disabled (enable for production) |

---

## Supabase Tables Used

| Table | Operations |
| ----- | ---------- |
| `tourists` | SELECT (read tourist list for map) |
| `incidents` | SELECT (active incidents for map overlays) |
| `sos_alerts` | INSERT (from SOS screen) |
| `geofences` | SELECT (zone data) |

The app uses the **anon** Supabase key. RLS policies allow:
- Anonymous INSERT on `sos_alerts`
- Authenticated SELECT on `tourists`, `incidents`, `geofences`

---

## Troubleshooting

**"Missing BuildConfig fields"** → Check that `local.properties` has all 3 keys.

**"Gradle sync failed"** → Ensure you have JDK 17 set in Android Studio preferences (File → Project Structure → SDK Location → JDK).

**Map tiles not loading** → Check internet connection. OSMDroid tiles require network access on first load.

**SOS insert fails** → Verify the Supabase anon key in `local.properties` matches `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `app/.env`.
