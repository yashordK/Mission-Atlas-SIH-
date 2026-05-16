# Mission Atlas — SevenShield Project Status

> **Audit Date:** 2026-05-16
> **Team:** Mission Atlas | **Team ID:** 79460
> **Hackathon:** Smart India Hackathon 2025 | **Problem:** SIH25002 (README also cites SIH25137)
> **Theme:** Travel & Tourism — Northeast India Safety

---

## 1. Project Overview

Mission Atlas / SevenShield is a multi-platform tourist safety system targeting all 7 Northeast India states. The system provides tourists with AI-generated itineraries, a real-time safety heatmap, hold-to-activate SOS with GPS coordinates pushed to Supabase, a blockchain-backed digital identity on Polygon Amoy testnet (Chain ID 80002, contract `0x33985e0e572b06fd2f8324e853b29ba5e90a86d1`), and static geo-fence data for 14 NE India zones seeded in the database.

The project is structured as a monorepo with four active platforms: an Expo/React Native tourist mobile app (`app/`), a Kotlin + Jetpack Compose native Android app (`AndroidApp/`), a Vite + React + TypeScript admin web dashboard (`dashboard/`), and a Node.js + Express backend (`server/`). All four platforms share a common Supabase PostgreSQL backend (tables: `profiles`, `tourists`, `incidents`, `sos_alerts`, `geofences`). The dashboard consumes Supabase directly with realtime subscriptions. The Android app uses the official Kotlin Supabase client (`io.github.jan-tennert.supabase` BOM 2.1.4). The mobile Expo app uses `@supabase/supabase-js` 2.105.4.

The server (`server/`) acts as a backend-for-frontend proxy, primarily to avoid exposing GROQ API keys on the mobile client. It hosts three routes: `POST /api/itinerary` (GROQ LLaMA-3 itinerary generation), `POST /api/sos` (SOS insert with service-role key bypassing RLS), and `GET /api/safety-score` (computed safety score from active incidents and SOS alerts). The Expo app attempts the server first and falls back to calling GROQ directly using `EXPO_PUBLIC_GROQ_API_KEY`. Both the Expo and Android apps are functionally independent of the server for SOS and Supabase operations.

---

## 2. Tech Stack: Planned vs Actual

| Layer | Planned (README/SIH PDF) | Installed / Found | Status |
|-------|--------------------------|-------------------|--------|
| Mobile frontend | Expo + React Native | expo 54.0.7, react-native 0.81.4, expo-router 6.0.4 | Installed |
| Mobile maps | Offline Maps | react-native-maps 1.20.1 installed; WebView + Leaflet heatmap used in map.tsx | Partial — no offline tile caching |
| Mobile AI | AI Itinerary (LLaMA) | groq-sdk via server; direct fetch fallback in index.tsx | Working (requires network) |
| Mobile auth | Supabase Auth | @supabase/supabase-js 2.105.4 — client exists in app/lib/supabase.ts | Client created, no login UI |
| Mobile SOS | Panic Button + GPS | expo-location, expo-haptics, supabase insert in sos.tsx | Complete |
| Mobile blockchain | Polygon Amoy Digital ID | shared/blockchainConfig.js exists, CONTRACT_ABI defined | Config only — no ethers.js, no on-chain calls |
| Android frontend | Kotlin + Jetpack Compose | compileSdk 34, Compose BOM 2024.02.00, material3 | Installed |
| Android maps | OSMDroid | osmdroid-android 6.1.18 | Installed, integrated in MapScreen.kt |
| Android AI | LLaMA via Groq | GroqRepository.kt with Ktor HTTP client | Implemented |
| Android auth | Supabase Auth | supabase-kt auth-kt module installed in AppModule.kt | Module installed, no login UI |
| Android SOS | SOS with GPS | SosViewModel.kt with FusedLocationProvider + SupabaseRepository | Complete |
| Android blockchain | Polygon Digital ID | ProfileViewModel.kt shows blockchainId / walletAddress fields | Data model only — no on-chain calls |
| Web dashboard | Vite + React + TS | vite 5.4.8, react 18.3.1, typescript 5.6.3 | Installed |
| Web maps | Leaflet | leaflet 1.9.4, react-leaflet 4.2.1 | Installed, integrated in LiveMap.tsx |
| Web auth | Supabase Auth | @supabase/supabase-js 2.57.4 | Client created, no admin login |
| Web realtime | Supabase Realtime | postgres_changes on tourists, incidents, sos_alerts in App.tsx | Implemented |
| Backend | Node.js + Express | express 4.22.2, cors, dotenv | Implemented |
| Backend AI | GROQ SDK | groq-sdk 0.9.1 | Implemented in routes/itinerary.js |
| Backend DB | Supabase (service key) | @supabase/supabase-js 2.105.4 — service key for SOS + safety routes | Implemented |
| Blockchain | Polygon Amoy | shared/blockchainConfig.js — ABI + contract address | Config only — no Web3/ethers.js library installed anywhere |
| Database | Supabase PostgreSQL | 2 migrations applied: initial schema + anon SOS policy | Applied |
| Styling — web | Tailwind CSS v3 | tailwindcss 3.4.17 | Installed (config deleted from root) |
| Styling — mobile | React Native StyleSheet | Used in all screens | Complete |
| Styling — Android | Material3 | MissionAtlasTheme with LightColorScheme / DarkColorScheme | Complete |
| Geo-fencing | Real-time alerts | 14 geofence polygons seeded in DB | DB only — no runtime monitoring |
| Offline Maps | Download + cache | expo-location exists; no offline tile download implemented | Missing |
| Swadeshi Booking | Local hotel booking | Not present in any platform | Missing |
| AI Chatbot | Info screen chatbot | info.tsx has static FAQ; no chatbot UI | Missing |
| Escalating Alerts | Progressive alert system | Not implemented in any platform | Missing |
| Python AI/ML | Python services | README mentions Python; no Python code found | Not started |

---

## 3. Theme & Design System

### Web Dashboard
- Background: `bg-gray-50` (App.tsx line 218), TopBar: `bg-white shadow-md` (TopBar.tsx line 10)
- Error banner: `bg-red-100 border-red-300 text-red-800` (App.tsx line 223)
- SafetyScore card: `bg-green-50 border-l-4 border-green-500` (SafetyScore.tsx line 10)
- PanicButton: `bg-red-600 w-16 h-16 rounded-full fixed bottom-6 right-6` (PanicButton.tsx line 11)
- Sidebar: `bg-white shadow-lg` fixed left, width `w-96` (App.tsx lines 230-231)
- Notification severity gradients in Sidebar.tsx lines 46-53: high=`bg-gradient-to-r from-red-600 to-red-400 text-white`, medium=`from-yellow-400 to-yellow-200`, low=`from-blue-500 to-blue-300 text-white`
- **`dashboard/tailwind.config.js` is deleted** (shown in git status as `D tailwind.config.js`). Tailwind runs on default config only — no content scanning.
- `LanguageSelector.tsx` supports 9 languages but is NOT rendered in TopBar.tsx or App.tsx — it is unused in the live UI.
- Translations only cover 7 keys: hello, user, safetyScore, panicButton, addIncident, notifications, fullscreen.
- `NotificationPanel.tsx` is a stub with hardcoded strings and is NOT imported in App.tsx.

### Mobile App (Expo)
- Home screen background: `backgroundColor: '#dae0e0'` (index.tsx line 334)
- Header card: `backgroundColor: '#fff'`, `borderRadius: 12`, `elevation: 3`
- Location banner: height 150, LinearGradient `rgba(0,0,0,0)` to `rgba(0,0,0,0.7)` (index.tsx lines 339-340)
- State selection active: `backgroundColor: '#007bff'` (index.tsx line 361)
- SOS screen background: `backgroundColor: '#0d0d0d'`; SOS button: `backgroundColor: '#FF3B30'`; sent: `#34C759`; error: `#8e0000` (sos.tsx lines 205-217)
- Tab bar: `backgroundColor: '#121212'`; height: 90 (Android) / 70 (iOS); SOS tab button: `backgroundColor: '#FF3B30'` 70x70 (FooterTabs.tsx lines 79-104)
- Profile: `backgroundColor: '#f8f8f8'`; cards: `backgroundColor: '#fff'`
- Info footer card: `backgroundColor: '#007AFF'`
- Map: WebView with Leaflet heatmap gradient `0.2: "green"`, `0.5: "yellow"`, `0.8: "orange"`, `1.0: "red"` (map.tsx lines 144-151)

### Android App
Brand palette in `AndroidApp/app/src/main/java/com/missionatlas/sevenshield/ui/theme/Color.kt`:
- `AtlasBlue = Color(0xFF007AFF)`
- `AtlasBlueLight = Color(0xFF5AC8FA)`
- `AtlasBlueDark = Color(0xFF0051D6)`
- `AtlasGreen = Color(0xFF34C759)`
- `AtlasRed = Color(0xFFFF3B30)`
- `AtlasOrange = Color(0xFFFF9500)`
- `AtlasDarkBg = Color(0xFF0D0D0D)`
- `AtlasDarkSurface = Color(0xFF1A1A2E)`
- Light: `LightBackground = Color(0xFFF5F7FA)`, `LightPrimary = AtlasBlue`
- Dark: `DarkBackground = Color(0xFF0D0D0D)`, `DarkPrimary = AtlasBlueLight`
- Light `primaryContainer = Color(0xFFD6EAFF)`, dark `primaryContainer = Color(0xFF00325A)` (Theme.kt lines 17, 30)
- `StateColors` map: e.g. Arunachal `Pair(Color(0xFF1A3A5C), Color(0xFF2D7DD2))`, Assam `Pair(Color(0xFF1A5C2A), Color(0xFF2DD27D))`
- Material3 full dark/light theme switching via `isSystemInDarkTheme()`, status bar color synced (Theme.kt lines 48-51)

---

## 4. Current File Structure

```
tourist-safety-app/
├── .gitignore
├── README.md
├── PROJECT_STATUS.md
├── shared/
│   └── blockchainConfig.js              # Polygon Amoy ABI + contract address
├── supabase/
│   └── migrations/
│       ├── 20260516000000_initial_schema.sql
│       └── 20260516000001_anon_sos_policy.sql
├── app/                                 # Expo React Native (tourist mobile)
│   ├── app.json
│   ├── package.json
│   ├── app/
│   │   ├── _layout.tsx                  # Root layout, renders FooterTabs
│   │   ├── index.tsx                    # Home: NE states, AI itinerary modal
│   │   ├── map.tsx                      # WebView Leaflet heatmap (random data)
│   │   ├── sos.tsx                      # Hold-to-activate SOS + Supabase insert
│   │   ├── profile.tsx                  # Hardcoded static profile data
│   │   └── info.tsx                     # Static FAQ/tips screen
│   ├── components/
│   │   └── FooterTabs.tsx               # Bottom tab navigator (5 tabs)
│   ├── lib/
│   │   └── supabase.ts                  # Supabase client (env vars)
│   └── assets/images/
│       ├── icon.jpg
│       ├── locationBg.png
│       ├── Arunachal_pradesh.jpg
│       ├── assam.jpg
│       ├── manipur.png
│       ├── meghalaya.png
│       ├── mizoram.png
│       ├── Nagaland.png
│       └── Tripura.jpg
├── dashboard/                           # Vite React TS admin web dashboard
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                      # Core: Supabase realtime, state management
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── components/
│       │   ├── TopBar.tsx
│       │   ├── Sidebar.tsx              # Notifications list + Add Incident form
│       │   ├── LiveMap.tsx              # React-Leaflet tourist/incident markers
│       │   ├── IncidentForm.tsx         # Duplicate form — NOT imported anywhere
│       │   ├── NotificationPanel.tsx    # Stub with hardcoded strings — NOT imported
│       │   ├── PanicButton.tsx          # Fixed bottom-right PANIC button
│       │   ├── SafetyScore.tsx          # Score banner
│       │   ├── LanguageProvider.tsx
│       │   └── LanguageSelector.tsx     # Built but NOT rendered anywhere
│       ├── hooks/
│       │   └── useLanguage.ts
│       ├── lib/
│       │   └── supabase.ts              # Typed Supabase client
│       ├── types/
│       │   ├── index.ts                 # Tourist, Incident, Notification, Language
│       │   └── database.ts              # DB type map (5 tables)
│       └── data/
│           └── translations.ts          # 7 keys, 9 languages
├── server/                              # Node.js Express backend
│   ├── package.json
│   ├── index.js                         # Express app, 3 route mounts + /health
│   └── routes/
│       ├── itinerary.js                 # POST /api/itinerary — GROQ LLaMA-3
│       ├── sos.js                       # POST /api/sos; PATCH /:id/respond
│       └── safety.js                    # GET /api/safety-score
└── AndroidApp/                          # Kotlin Jetpack Compose Android app
    ├── README_ANDROID.md
    └── app/
        ├── build.gradle.kts
        ├── proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml
            └── java/com/missionatlas/sevenshield/
                ├── MainActivity.kt
                ├── MissionAtlasApp.kt           # @HiltAndroidApp, OSMDroid init
                ├── di/
                │   └── AppModule.kt             # Hilt: Supabase, Ktor, Groq
                ├── data/
                │   ├── model/
                │   │   ├── Tourist.kt
                │   │   ├── Incident.kt
                │   │   ├── SosAlert.kt
                │   │   └── GroqModels.kt
                │   └── repository/
                │       ├── SupabaseRepository.kt
                │       └── GroqRepository.kt
                └── ui/
                    ├── navigation/
                    │   └── NavGraph.kt
                    ├── components/
                    │   └── BottomNavBar.kt
                    ├── theme/
                    │   ├── Color.kt
                    │   ├── Theme.kt
                    │   └── Type.kt
                    └── screens/
                        ├── home/
                        │   ├── HomeScreen.kt    # NE states + itinerary modal
                        │   └── HomeViewModel.kt
                        ├── map/
                        │   ├── MapScreen.kt     # OSMDroid + incident overlays
                        │   └── MapViewModel.kt
                        ├── sos/
                        │   ├── SosScreen.kt
                        │   └── SosViewModel.kt
                        ├── profile/
                        │   ├── ProfileScreen.kt # Static defaults + blockchain chip
                        │   └── ProfileViewModel.kt
                        └── info/
                            └── InfoScreen.kt    # Features + expandable FAQs
```

---

## 5. Feature Status

| Feature | Platform | Status | What Exists | What's Missing |
|---------|----------|--------|-------------|----------------|
| Home Screen / NE India Destinations | Mobile (Expo) | Complete | 7 state cards with images (index.tsx lines 62-70), `famousPlaces` map with 15 places/state, itinerary modal | — |
| Home Screen / NE India Destinations | Android | Complete | 7 state cards with `StateColors` gradients (HomeScreen.kt lines 41-48), opens `ItineraryModal` | — |
| AI Itinerary Planner | Mobile (Expo) | Complete | 3-step modal: select places → dates → LLaMA result; server-first + direct Groq fallback (index.tsx lines 99-156) | Dates are free-text only (no date picker) |
| AI Itinerary Planner | Android | Complete | `HomeViewModel.generateItinerary()` → `GroqRepository.kt` Ktor call; 3-step modal in HomeScreen.kt | Dates are free-text only |
| AI Itinerary Planner | Server | Complete | `POST /api/itinerary` uses `groq.chat.completions.create`, model llama3-8b-8192, max_tokens 2000 | — |
| SOS / Panic Button | Mobile (Expo) | Complete | Hold 3s → `expo-location` GPS → `supabase.from('sos_alerts').insert()` (sos.tsx lines 47-81); animated ring, haptics, vibration | Anonymous insert — no user association |
| SOS / Panic Button | Android | Complete | `SosViewModel.activateSOS()` → FusedLocationProvider → `SupabaseRepository.insertSosAlert()` (SosViewModel.kt lines 47-85); vibration both API versions | Anonymous insert |
| SOS / Panic Button | Web Dashboard | Complete | `PanicButton.tsx` → `handlePanic()` in App.tsx inserts to `sos_alerts` (App.tsx lines 200-209) | Hardcoded lat/lng `26.1445, 91.7362` — no actual browser geolocation |
| Map View / Safety Heatmap | Mobile (Expo) | Partial | WebView with Leaflet + `leaflet.heat` plugin; 3-zone gradient; `Relocate` button (map.tsx) | Heatmap uses `generateZones()` random data — not from DB incidents |
| Map View / Safety Heatmap | Android | Partial | OSMDroid with `Polygon` severity circles from `supabase.getActiveIncidents()`; 60s auto-refresh (MapViewModel.kt line 49) | No heatmap layer; incident circle radius hardcoded (high=2000m); no offline tiles |
| Profile / Digital ID | Mobile (Expo) | Broken | profile.tsx renders hardcoded static object (line 7-56: `name: 'Suyash Vasal Jain'`, `aadhar: 'xxxx-xxxx-xxxx'`) | No `supabase.from()` call; logout button has no `onPress`; no auth |
| Profile / Digital ID | Android | Partial | `ProfileScreen.kt` renders `ProfileData` with blockchain chip showing `blockchainId`; Polygon Amoy chain info shown | `ProfileViewModel` returns only default `ProfileData()` with no Supabase fetch; no auth |
| Info Screen / FAQ | Mobile (Expo) | Complete | 5 feature cards + 3 static FAQs (info.tsx); quick actions section commented out (lines 70-87) | No chatbot |
| Info Screen / FAQ | Android | Complete | 6 feature cards, 8 expandable FAQ accordion items, team info card (InfoScreen.kt) | No chatbot |
| Live Map | Web Dashboard | Complete | `LiveMap.tsx` OpenStreetMap tiles centered on Guwahati `[26.1445, 91.7362]`; tourist + incident markers with popups | No heatmap; no geofence overlay; all markers use same default Leaflet icon |
| Incident Management | Web Dashboard | Complete | `Sidebar.tsx` add-incident form → `handleAddIncident()` inserts to `incidents`; realtime subscription active (App.tsx lines 119-147) | `IncidentForm.tsx` is a duplicate component not used (wrong default coords: New York) |
| Notifications Panel | Web Dashboard | Partial | `Sidebar.tsx` shows live notification list from state; mark-read and dismiss work (App.tsx lines 66-77) | `NotificationPanel.tsx` stub not imported; `LanguageSelector.tsx` not rendered |
| Safety Score Widget | Web Dashboard | Complete | `SafetyScore.tsx` displays average of all tourist `safety_score` values; live-updates on realtime (App.tsx lines 212-214) | Not using server's score formula from `safety.js` |
| AI Alerts | All | Missing | Not implemented | — |
| Blockchain Digital ID | All | Config only | `shared/blockchainConfig.js`: full ABI + `CONTRACT_ADDRESS = '0x33985e0e572b06fd2f8324e853b29ba5e90a86d1'` | No ethers.js/Web3.js installed; no `registerTourist()` calls; `blockchain_id` columns always null |
| Geo-fencing | All | DB only | 14 polygons seeded in `geofences` table (migration 20260516000000); `risk_level`, `state`, `coordinates` populated | Table never queried in any app; no entry/exit detection; no overlay on any map |
| AI Chatbot | Mobile (Expo) | Missing | info.tsx has static FAQ content | — |
| AI Chatbot | Android | Missing | InfoScreen.kt has expandable FAQ accordion | — |
| Escalating Safety Alerts | All | Missing | Not implemented | — |
| Supabase Auth | All | Missing | Client configured on all platforms; `profiles` table + RLS policies in place; anon SOS policy added | No login/signup UI on any platform |
| Supabase Realtime DB | Web Dashboard | Complete | App.tsx subscribes `tourists-realtime`, `incidents-realtime`, `sos-realtime` channels | — |
| Supabase Realtime DB | Mobile + Android | Missing | Neither platform subscribes to any realtime channel | — |
| Backend API | Server | Complete | 3 routes functional; `/health` endpoint | Only runs on localhost:3001; no auth middleware; no rate limiting; no deployment |
| Offline Maps | Mobile | Missing | expo-location installed; info.tsx step 4 mentions offline | No tile download or caching |
| Offline Maps | Android | Missing | OSMDroid supports offline natively | No offline tile management UI or download flow |
| Swadeshi Booking | All | Missing | README lists as Shield 4 | No implementation on any platform |

---

## 6. What's Working Right Now

1. **Web Dashboard** — fully runnable with `npm run dev` in `dashboard/`; loads live Supabase data; realtime on all 3 tables; add-incident form writes to DB; panic button inserts SOS; safety score widget live-updates.
2. **Expo Mobile SOS** — `sos.tsx` fully functional: 3-second hold + animated ring + haptics + vibration; GPS via `expo-location`; `supabase.from('sos_alerts').insert()` with coordinates displayed after send; call 112/108 buttons.
3. **Android SOS** — `SosViewModel.kt` + `SosScreen.kt` fully functional: Compose hold animation, FusedLocationProvider, `SupabaseRepository.insertSosAlert()`, vibration for API 26+/31+; error + sent states handled.
4. **Expo AI Itinerary** — 3-step modal in `index.tsx`: tries `${SERVER_URL}/api/itinerary` first, falls back to direct Groq fetch with `EXPO_PUBLIC_GROQ_API_KEY`; renders formatted itinerary text.
5. **Android AI Itinerary** — `HomeViewModel.generateItinerary()` → `GroqRepository.kt` Ktor POST to Groq; full 3-step modal UI with loading indicator showing "Generating with LLaMA…".
6. **Server itinerary route** — `POST /api/itinerary` uses `groq-sdk` with `llama3-8b-8192`, max_tokens 2000; returns `{ itinerary: string }`.
7. **Server SOS route** — `POST /api/sos` with service-role key inserts bypassing RLS; `PATCH /api/sos/:id/respond` marks `responded_at`.
8. **Server safety-score route** — `GET /api/safety-score` computes score (high=-15, medium=-8, low=-3, SOS=-20), returns per-NE-state breakdown.
9. **Android Map** — `MapScreen.kt` OSMDroid loads, fetches active incidents from Supabase, draws severity-colored circle polygons (red/orange/green), auto-refreshes 60s.
10. **Expo Home Screen** — 7 NE India state cards with actual photos; 15 famous places per state; multi-step itinerary modal with step indicator.
11. **Database schema** — 5 tables with RLS; 14 NE India geofence polygons seeded; anon SOS+incident insert policy applied; `updated_at` triggers on `profiles` and `incidents`.
12. **Blockchain config** — Full ABI (4 functions, 4 events) for `registerTourist`, `addEvidence`, `assignGuide`, `getEvidence` in `shared/blockchainConfig.js`; contract deployed on Polygon Amoy.
13. **Multi-language infrastructure** — `useLanguage` hook, `LanguageProvider`, `LanguageSelector` component for 9 NE India languages built; translations.ts has 7 keys.

---

## 7. What's Broken / Incomplete

1. **`app/app/profile.tsx` — fully hardcoded** — The `user` object (lines 7-56) has static data including `name: 'Suyash Vasal Jain'`, `aadhar: 'xxxx-xxxx-xxxx'`, `passport: 'X1234567'`. There is no `supabase.from()` call. The `Logout` `TouchableOpacity` on line 128 has no `onPress` handler — tapping it does nothing.

2. **Android `ProfileViewModel.kt` — no Supabase fetch** — Constructor is `@Inject constructor()` with no dependencies; `_profile` always emits default `ProfileData()` (line 23-25). `blockchainId` and `walletAddress` are always `null`.

3. **Expo map heatmap is random data** — `generateZones()` in `map.tsx` (line 55) creates 30 random `[lat, lng, intensity]` tuples. Not connected to `incidents` or `geofences` tables.

4. **`tailwind.config.js` deleted** — Git status shows `D tailwind.config.js`. The dashboard's Tailwind runs without a content configuration, meaning all classes are included (no purging) and classes not in the default set won't be recognized. A `dashboard/tailwind.config.js` is needed.

5. **`LanguageSelector.tsx` is never rendered** — Fully built component at `dashboard/src/components/LanguageSelector.tsx` supports 9 languages but is not imported by `TopBar.tsx` or `App.tsx`.

6. **`NotificationPanel.tsx` is a dead stub** — Contains hardcoded text `"New tourist alert near Central Park"`. Not imported by any component. Should be deleted or replaced.

7. **`IncidentForm.tsx` is a duplicate** — Standalone form component at `dashboard/src/components/IncidentForm.tsx` is not used (App.tsx delegates to `Sidebar.tsx`'s embedded form). Default location is New York (`lat: 40.7128, lng: -74.0060`) — wrong context for NE India.

8. **No authentication UI on any platform** — `profiles` table, RLS policies, and Supabase Auth modules are all in place, but there is no login/signup screen. Dashboard passes `userName="Admin"` as a hardcoded string (App.tsx line 219). Because `tourists_select_all` policy requires `authenticated`, the dashboard may receive empty tourist data with just the anon key.

9. **Blockchain integration is config-only** — No platform has ethers.js or web3.js. `registerTourist()`, `addEvidence()` are never called. `blockchain_id` in `profiles`, `tourists`, `incidents.blockchain_hash`, and `sos_alerts.blockchain_hash` are always null.

10. **Geo-fencing is DB-only** — `geofences` table has 14 polygons but is never queried by any app code. No entry/exit detection, no alert, no map overlay.

11. **Server not deployed** — Runs only on `localhost:3001`. The Expo app's `EXPO_PUBLIC_SERVER_URL` defaults to `http://localhost:3001` which fails on physical devices. Android does not use the server at all.

12. **`EXPO_PUBLIC_GROQ_API_KEY` exposed client-side** — `index.tsx` line 14 reads this env var which Expo bundles into the JS bundle. Any user can extract it from the APK.

13. **`app/app/_layout.tsx` navigation mismatch** — The file imports `FooterTabs` which uses `createBottomTabNavigator` from `@react-navigation/bottom-tabs` inside an expo-router `_layout.tsx`. Expo Router expects its own `<Tabs>` component. This architectural mismatch may produce navigation conflicts in expo-router 6.

14. **`uuid` installed but unused** — `uuid` 13.0.0 in dashboard `dependencies` is not imported in any source file.

15. **`react-native-maps` installed but unused** — Expo app installs `react-native-maps` 1.20.1 + types, but `map.tsx` uses WebView + Leaflet HTML instead.

16. **Duplicate problem statement IDs** — `README.md` line 4 references `SIH25137`; `AndroidApp/InfoScreen.kt` line 72 references `SIH25002`. Needs clarification.

---

## 8. Dependencies Status

### Web Dashboard (dashboard/package.json)
| Package | Required | Installed | Status |
|---------|----------|-----------|--------|
| react | ^18.3.1 | 18.3.1 | OK |
| react-dom | ^18.3.1 | 18.3.1 | OK |
| @supabase/supabase-js | ^2.57.4 | 2.57.4 | OK |
| leaflet | ^1.9.4 | 1.9.4 | OK |
| react-leaflet | ^4.2.1 | 4.2.1 | OK |
| @types/leaflet | ^1.9.20 | 1.9.20 | OK |
| @heroicons/react | ^2.2.0 | 2.2.0 | OK |
| lucide-react | ^0.344.0 | 0.344.0 | Installed (excluded from Vite optimize); not used in any component |
| tailwindcss | ^3.4.17 | 3.4.17 | OK (no tailwind.config.js) |
| uuid | ^13.0.0 | 13.0.0 | Installed but not imported anywhere |
| vite | ^5.4.2 | 5.4.8 | OK |
| typescript | ^5.5.3 | 5.6.3 | OK |
| ethers.js / web3.js | Needed for blockchain | NOT installed | Missing |

### Mobile App (app/package.json)
| Package | Required | Installed | Status |
|---------|----------|-----------|--------|
| expo | ~54.0.7 | 54.0.7 | OK |
| expo-router | ~6.0.4 | 6.0.4 | OK |
| @supabase/supabase-js | ^2.105.4 | 2.105.4 | OK |
| expo-location | ~19.0.7 | 19.0.7 | OK |
| expo-haptics | ~15.0.7 | 15.0.7 | OK |
| react-native-maps | 1.20.1 | 1.20.1 | Installed; NOT used (map.tsx uses WebView) |
| react-native-webview | 13.15.0 | 13.15.0 | OK — used in map.tsx |
| @react-navigation/bottom-tabs | ^7.4.7 | 7.4.7 | OK — used in FooterTabs.tsx |
| expo-linear-gradient | ~15.0.7 | 15.0.7 | OK |
| expo-dev-client | ~6.0.21 | 6.0.21 | OK |
| ethers.js | Needed for blockchain | NOT installed | Missing |

### Android App (AndroidApp/app/build.gradle.kts)
| Dependency | Version | Notes |
|------------|---------|-------|
| Compose BOM | 2024.02.00 | OK |
| material3 | via BOM | OK |
| navigation-compose | 2.7.7 | OK |
| hilt-android | 2.50 | OK |
| hilt-navigation-compose | 1.1.0 | OK |
| supabase BOM | 2.1.4 | OK |
| postgrest-kt | via BOM | OK — used in SupabaseRepository |
| realtime-kt | via BOM | Installed in AppModule; no channel subscriptions in code |
| auth-kt | via BOM | Installed in AppModule; no login flow implemented |
| ktor-client-android | 2.3.7 | OK — used in GroqRepository |
| osmdroid-android | 6.1.18 | OK — used in MapScreen |
| play-services-location | 21.1.0 | OK — used in SosViewModel + MapViewModel |
| accompanist-permissions | 0.34.0 | OK — used in SosScreen + MapScreen |
| coil-compose | 2.5.0 | Installed; profile image area uses Icon placeholder instead |
| datastore-preferences | 1.0.0 | Installed; not used in any source file |
| ui-text-google-fonts | 1.6.1 | Installed; no custom font applied in Type.kt |
| minSdk | 26 | Android 8.0+ only |
| compileSdk / targetSdk | 34 | OK |
| kotlinCompilerExtensionVersion | 1.5.10 | OK for Compose BOM 2024.02 |

### Server (server/package.json)
| Package | Version | Status |
|---------|---------|--------|
| express | 4.22.2 | OK |
| cors | 2.8.6 | OK |
| dotenv | 16.6.1 | OK |
| @supabase/supabase-js | 2.105.4 | OK |
| groq-sdk | 0.9.1 | OK |
| type="module" | ESM | Requires Node ≥14; all routes use `import`/`export` |

---

## 9. Remaining Work (Priority Order)

1. **[M] Implement Supabase Auth on all platforms** — Login/signup screens needed on Expo (new `app/app/login.tsx`), Android (new `LoginScreen.kt`), and dashboard (admin login form). Without auth, `profiles` RLS blocks reads/writes and `tourists_select_all` blocks dashboard queries for the anon role.

2. **[M] Wire profile.tsx to Supabase** — Replace hardcoded `user` object in `app/app/profile.tsx` with `supabase.from('profiles').select()`. Add `onPress={() => supabase.auth.signOut()}` to the Logout button. Map `profiles` columns to displayed fields.

3. **[M] Wire Android ProfileViewModel to Supabase** — Inject `SupabaseRepository` into `ProfileViewModel.kt`. Add a `getProfile(userId)` method in `SupabaseRepository.kt` fetching from `profiles`. Expose result as `StateFlow<ProfileData>`.

4. **[M] Fix Expo map heatmap with real data** — In `map.tsx`, add `useEffect` to call `supabase.from('incidents').select('latitude,longitude,severity').eq('status','active')`. Convert to `[lat, lng, intensity]` tuples (high=1.0, medium=0.6, low=0.2) and replace `generateZones()`.

5. **[S] Recreate `dashboard/tailwind.config.js`** — Quick fix: create `dashboard/tailwind.config.js` with `content: ['./index.html', './src/**/*.{ts,tsx}']`. Unblocks production `npm run build` with proper purging.

6. **[S] Add `LanguageSelector` to TopBar** — Add `import LanguageSelector from './LanguageSelector'` and render it in `dashboard/src/components/TopBar.tsx`. One-line change; component is fully built.

7. **[L] Implement geo-fence monitoring** — Query `geofences` table on all platforms. Use a point-in-polygon algorithm on GPS coordinates. Trigger local notification on zone entry/exit. Display polygons on LiveMap.tsx (react-leaflet `Polygon`), map.tsx WebView, and Android MapScreen.kt (OSMDroid `Polygon`).

8. **[L] Blockchain integration** — Install ethers.js in `app/` and `dashboard/`. Use `shared/blockchainConfig.js` contract address + ABI. Call `registerTourist(idHash, expiry, guideIdHash)` during profile creation. Store returned `blockchain_id` in Supabase `profiles.blockchain_id`. Wire Android `ProfileScreen`'s blockchain chip to real value.

9. **[M] Deploy server** — Deploy `server/` to Railway/Render/Fly.io. Set `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`. Update `EXPO_PUBLIC_SERVER_URL` in Expo `.env`. Remove `EXPO_PUBLIC_GROQ_API_KEY` from Expo client once server is reliable.

10. **[S] Remove dead code** — Delete `NotificationPanel.tsx` (stub, not imported). Delete `IncidentForm.tsx` (duplicate, wrong coordinates). Remove `uuid` from `dashboard/package.json` dependencies.

11. **[L] Offline map tile caching** — Expo: implement tile prefetch using `expo-file-system` or switch from WebView to `react-native-maps` with MapLibre offline. Android: implement OSMDroid offline tile download and cache management UI.

12. **[L] Swadeshi Booking** — No implementation exists anywhere. Requires local business database schema, booking flow, payment integration, and UI on all platforms.

13. **[S] Fix Expo navigation architecture** — Refactor `_layout.tsx` to use `expo-router`'s `<Tabs>` with individual screen files, or validate the current `@react-navigation/bottom-tabs` approach works correctly under expo-router 6.

14. **[S] Add Supabase Realtime to mobile apps** — Add `supabase.channel('sos-realtime')` subscriptions in Expo `sos.tsx` and Android `SosViewModel.kt` to reflect live incident updates without manual refresh.

---

## 10. Next Steps (Immediate Actions)

1. **Create `dashboard/tailwind.config.js`** with content scanning enabled — prevents build issues and enables production purging. Run `npm run build` in `dashboard/` to verify.

2. **Add `LanguageSelector` to `dashboard/src/components/TopBar.tsx`** — import and render it next to the `Hello, {userName}` div. One-line change.

3. **Create `app/app/login.tsx`** — Email/password form calling `supabase.auth.signInWithPassword()`. Add a session check in `_layout.tsx` to redirect unauthenticated users to login.

4. **Replace hardcoded data in `app/app/profile.tsx`** — After auth: `const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()`. Map fields. Add `onPress={() => supabase.auth.signOut()}` to the Logout button.

5. **Fix Expo map heatmap** — In `app/app/map.tsx`, add:
   ```js
   const { data } = await supabase.from('incidents').select('latitude,longitude,severity').eq('status','active');
   const points = data.map(i => [i.latitude, i.longitude, i.severity === 'high' ? 1.0 : i.severity === 'medium' ? 0.6 : 0.2]);
   ```
   Replace the `generateZones()` call with `JSON.stringify(points)` in the HTML template.

6. **Create `dashboard/tailwind.config.js`** — Remove `uuid` from `dashboard/package.json` and `lucide-react` from `vite.config.ts` excludeOptimizeDeps if unused.

7. **Inject `SupabaseRepository` in Android `ProfileViewModel.kt`** — Add constructor parameter, call `supabaseRepository.getTourists()` pattern, create `getProfile()` in `SupabaseRepository.kt`.

8. **Deploy `server/` to Railway** — `railway init` in `server/`, set env vars, push. Update `EXPO_PUBLIC_SERVER_URL` in `app/.env`.

9. **End-to-end SOS test** — Start server + Expo + dashboard simultaneously. Trigger SOS on mobile and verify dashboard shows the alert in realtime in the Notifications sidebar and as a red incident marker on LiveMap.

10. **Seed test data into Supabase `tourists` table** — Insert a test tourist row with `latitude`, `longitude`, `safety_score`, `status='safe'` to verify dashboard LiveMap shows a tourist marker.

---

## 11. Architecture Notes

**Data flow:** All four platforms write to the same Supabase project. The web dashboard reads from `tourists` and `incidents` with Supabase JS realtime subscriptions. The Expo and Android apps write to `sos_alerts` (SOS) and indirectly through the server to `incidents`. The server provides a GROQ proxy and computed safety score — it is NOT required for SOS or map features.

**Two parallel mobile platforms:** The Expo app (`app/`) and Android native app (`AndroidApp/`) implement identical feature sets. Both have the same 5 screens, same 7 NE states, same itinerary flow, same Supabase tables. They share zero code. The Android app has a more robust architecture (Hilt DI, ViewModel + Repository pattern, typed Supabase models with `@Serializable`). The Expo app has actual state images and a more polished home screen visually. For the SIH demo, decide which is the primary demo target.

**Blockchain gap:** The smart contract is deployed on Polygon Amoy testnet (`0x33985e0e572b06fd2f8324e853b29ba5e90a86d1`). The ABI includes `registerTourist`, `addEvidence`, `assignGuide`, and `getEvidence`. No platform installs ethers.js. No on-chain transaction is ever made. `blockchain_id` fields in DB are always null. This is the largest gap between stated SIH goals and current code.

**RLS policy issue:** The `tourists_select_all` policy (migration 20260516000000, line 103) grants SELECT only to `authenticated` role. The dashboard's Supabase client uses the anon key with no session. This means `supabase.from('tourists').select()` in `App.tsx` will return an empty array unless a user is authenticated. Add either an anon SELECT policy on `tourists` or configure the dashboard to use the service role key (not recommended for client-side).

**`realtime-kt` installed but unused in Android:** The Android `AppModule.kt` installs `Realtime` in the Supabase client, but no screen subscribes to any channel. If realtime support is added, it's already configured in the DI.

**`datastore-preferences` installed but unused in Android:** Added as a dependency in `build.gradle.kts` line 113 but never imported. Likely intended for storing user preferences or cached profile data offline.

**Server ESM format:** `server/package.json` has `"type": "module"`. All route files use `import`/`export`. The dev script is `node --watch index.js` (Node.js built-in file watcher, no nodemon needed). No TypeScript in the server.

**Problem statement ID discrepancy:** `README.md` line 4 cites `SIH25137`; `AndroidApp/InfoScreen.kt` line 72 and the task brief cite `SIH25002`. Clarify and make consistent across all documentation before the hackathon demo.
