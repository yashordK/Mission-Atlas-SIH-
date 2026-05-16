# Mission Atlas — SevenShield Project Status

> **Audit Date:** 2026-05-16  
> **Team:** Mission Atlas | **Team ID:** 79460  
> **Hackathon:** Smart India Hackathon 2025  
> **Problem Statement:** SIH25137 (README) / SIH25002 (brief) — Smart Tourist Safety Monitoring & Incident Response  
> **Theme:** Travel & Tourism | NE India focus  
> **Node.js version:** v22.21.1

---

## 1. Project Overview

Mission Atlas / SevenShield is a dual-platform tourist safety system for Northeast India. It consists of:

- **Web Dashboard** (`/src`): A Vite + React + TypeScript admin/authority dashboard titled "Tourist Safety Dashboard". It renders a live OpenStreetMap map (react-leaflet), a notification/incident sidebar, a safety score widget, and a panic button. All data is currently static mock data — no Supabase connection is active.
- **Mobile App** (`/MobileApp`): An Expo (React Native) app with five tabs — Home, Map, SOS, Profile, Info. The Home screen displays all 7 NE India states with destination cards, live GPS location, and a 3-step AI itinerary planner powered by Gemini API. The Map tab renders a Leaflet heatmap inside a WebView. The SOS screen is a placeholder. Profile is static hardcoded data. Info is a static help page.
- **Blockchain Config** (`/bloackchainConfig.js` and `/MobileApp/bloackchainConfig.js`): A deployed Solidity smart contract ABI and address on what appears to be a testnet. The contract supports `registerTourist`, `assignGuide`, `addEvidence`, and read functions. No frontend integration to this contract exists yet.
- **No backend** (Node.js/Express or Python) exists anywhere in the repository.
- **No Supabase** client calls exist anywhere in source code — the SDK is installed in the web package but never imported or used.

---

## 2. Tech Stack: Planned vs Actual

| Layer | Planned (README/Brief) | Installed / Found | Status |
|-------|------------------------|-------------------|--------|
| Frontend Web | Vite + React + TypeScript + Tailwind | Vite 5.4.8, React 18.3.1, TypeScript 5.6.3, Tailwind 3.4.17 | Installed and running |
| Frontend App | Expo + React Native | Expo 54.0.7, React Native 0.81.4, expo-router 6.0.4 | Installed and running |
| Backend | Node.js + Express + Python (AI/ML) | **None** — no server/ or backend/ folder exists | Not started |
| Database | Supabase (PostgreSQL + Auth + Realtime) | `@supabase/supabase-js` 2.57.4 installed (web only) — never imported in any source file | SDK installed, zero integration |
| Blockchain | Ethereum/Polygon + Solidity + MetaMask + ethers.js | Contract ABI + address in `bloackchainConfig.js` (both root and MobileApp). `ethers` not installed anywhere | Contract defined, no frontend integration |
| Maps (Web) | Leaflet / react-leaflet | leaflet 1.9.4, react-leaflet 4.2.1 installed and used in `LiveMap.tsx` | Working (OpenStreetMap tiles) |
| Maps (Mobile) | react-native-maps / MapView | `react-native-maps` 1.20.1 installed but **not used** — map uses Leaflet inside WebView via `react-native-webview` | react-native-maps unused; WebView map works |
| AI | Python APIs / Gemini Chatbot | Gemini API key hardcoded in `MobileApp/app/index.tsx` line 13 — endpoint URL is **incorrect** (`https://api.gemini.ai/v1/completions` is not a valid Gemini endpoint; correct is `https://generativelanguage.googleapis.com/v1beta/models/...`) | Partially wired, broken endpoint |
| i18n / Multi-language | NE India languages | `i18next` + `react-i18next` installed as extraneous in MobileApp (not in package.json). Web has custom `translations.ts` with 9 languages — but `LanguageProvider` at `src/components/LanguageProvider.tsx` is a stub that **hardcodes `'en'`** and does not use the `useLanguageProvider` hook | Translations exist, context broken |

---

## 3. Theme & Design System

### Web Dashboard

- **Background:** `bg-gray-50` (Tailwind — #f9fafb)
- **Sidebar/TopBar background:** `bg-white` with `shadow-lg` / `shadow-md`
- **TopBar height:** `h-16`, fixed position, `z-20`
- **Sidebar width:** `w-96` (384px), fixed left, starts below TopBar
- **Primary action color:** `bg-blue-600` / `hover:bg-blue-700` (#2563eb)
- **Panic button:** `bg-red-600`, `w-16 h-16`, `rounded-full`, `fixed bottom-6 right-6` — **currently commented out** in `App.tsx` line 79
- **Safety Score widget:** `bg-green-50`, `border-l-4 border-green-500`, text `text-green-700`
- **Severity colors in Sidebar:** High = `bg-gradient-to-r from-red-600 to-red-400 text-white`, Medium = `from-yellow-400 to-yellow-200`, Low = `from-blue-500 to-blue-300`
- **Font:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...`) — no custom font loaded
- **No CSS custom properties / CSS variables** — purely Tailwind utility classes
- **Tailwind config:** No theme extensions — bare default configuration at `tailwind.config.js`
- **Title in browser tab:** "React Website with Live Map" (generic placeholder in `index.html`)

### Mobile App

- **Background:** `#dae0e0ff` (Home screen container)
- **Tab bar background:** `#121212` (near-black dark theme), height 70px iOS / 90px Android
- **SOS button:** `#FF3B30` (iOS red), 70x70 circle, floating center above tab bar
- **Active tab tint:** `#fff`, inactive: `#ccc`
- **Cards:** `#fff` with `borderRadius: 12`, `elevation: 3-4` (Material shadow)
- **Primary blue:** `#007AFF` (iOS blue) — used for links, buttons, service icons
- **Logout button:** `#FF3B30`
- **Profile image border:** `#007AFF`, 2px width
- **Info footer card:** `#007AFF` background
- **Header title font:** `fontSize: 20, fontWeight: 'bold'`
- **Welcome text:** `fontSize: 30, fontWeight: 'bold', color: '#fff'` (over gradient)
- **No shared design token file** — colors are hardcoded per-file inline StyleSheet

---

## 4. Current File Structure

```
tourist-safety-app/                         (root — Web Dashboard)
├── bloackchainConfig.js                    TYPO: should be blockchainConfig.js
├── index.html                              Title says "React Website with Live Map"
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── README.md
├── PROJECT_STATUS.md                       (this file)
├── src/
│   ├── main.tsx                            Entry point — renders <App />
│   ├── index.tsx                           Duplicate entry point (also renders <App />)
│   ├── App.tsx                             Main layout — mock data, LiveMap, SafetyScore, Sidebar
│   ├── Dashboard.tsx                       Alternate layout (stub handlers throw Error)
│   ├── index.css                           Tailwind directives + leaflet override
│   ├── vite-env.d.ts
│   ├── types.ts                            Tourist, Incident, Notification interfaces
│   ├── types/
│   │   └── index.ts                        Duplicate types + Language + LanguageStrings
│   ├── components/
│   │   ├── LiveMap.tsx                     react-leaflet MapContainer, NE India center
│   │   ├── Sidebar.tsx                     Notifications list + Add Incident form
│   │   ├── TopBar.tsx                      Fixed header "Tourist Safety Dashboard"
│   │   ├── SafetyScore.tsx                 Static score display widget
│   │   ├── PanicButton.tsx                 Red PANIC button (commented out in App.tsx)
│   │   ├── NotificationPanel.tsx           Stub with 3 hardcoded string items
│   │   ├── IncidentForm.tsx                Standalone form (not used in App.tsx)
│   │   ├── LanguageProvider.tsx            Stub — hardcodes language='en', no setLanguage
│   │   └── LanguageSelector.tsx            Dropdown for 9 languages (wired to broken context)
│   ├── data/
│   │   └── translations.ts                 9 languages: en, hi, as, bn, mni, lus, kha, nag, brx
│   └── hooks/
│       └── useLanguage.ts                  LanguageContext + useLanguage + useLanguageProvider
│
├── node_modules/                           (excluded)
│
└── MobileApp/                              (Expo React Native app)
    ├── app.json                            Expo config, owner: king_09, EAS projectId set
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── eslint.config.js
    ├── expo-env.d.ts
    ├── declarations.d.ts                   declare module *.png/.jpg/.svg
    ├── bloackchainConfig.js                SAME TYPO — copy of root blockchain config
    ├── app/
    │   ├── _layout.tsx                     GestureHandlerRootView + <FooterTabs />
    │   ├── index.tsx                       Home screen — NE destinations, GPS, AI itinerary modal
    │   ├── map.tsx                         Heatmap via WebView + Leaflet.heat
    │   ├── sos.tsx                         PLACEHOLDER — only renders "SOS Screen" text
    │   ├── profile.tsx                     Static hardcoded user data (Suyash Vasal Jain)
    │   └── info.tsx                        Static how-to-use + FAQ screen
    ├── components/
    │   └── FooterTabs.tsx                  5-tab navigator: Home/Map/SOS/Profile/Info
    ├── assets/
    │   └── images/
    │       ├── icon.jpg
    │       ├── locationBg.png
    │       ├── Arunachal_pradesh.jpg
    │       ├── assam.jpg
    │       ├── manipur.png
    │       ├── meghalaya.png
    │       ├── mizoram.png
    │       ├── Nagaland.png
    │       └── Tripura.jpg
    ├── images/                             Duplicate/extra images folder
    │   ├── icon.jpg
    │   ├── loc1.png
    │   ├── loc2.png
    │   ├── loc3.png
    │   └── locationBg.png
    └── node_modules/                       (excluded)
```

---

## 5. Feature Status

| Feature | Platform | Status | What Exists | What's Missing |
|---------|----------|--------|-------------|----------------|
| Home Screen / NE India Destinations | Mobile | Partial | All 7 states listed with images and 15 landmarks each; GPS location fetch; image cards with tap-to-open modal | Real images for all states present; `splash-icon.png` referenced in app.json but missing from assets |
| AI Itinerary Planner (3-step modal) | Mobile | Broken | 3-step modal: select places, enter dates (TextInput), show result; Gemini API call wired | API endpoint is wrong (`https://api.gemini.ai/v1/completions` does not exist — should be `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`); API key hardcoded in source (security issue); response parsing uses OpenAI schema (`data.choices[0].text`) not Gemini schema |
| SOS / Panic Button | Mobile | Placeholder | Tab exists, custom red floating button in footer | `sos.tsx` contains only `<Text>SOS Screen</Text>` — no actual SOS logic, no emergency contact call, no alert dispatch |
| SOS / Panic Button | Web | Broken | `PanicButton.tsx` component exists, hardwired to Guwahati coords | Commented out at `App.tsx` line 79; does not actually call any emergency API |
| Map View (heatmap) | Mobile | Partial | Leaflet heatmap rendered via WebView with 3 random zone clusters; user location shown; relocate button | Heatmap data is randomly generated — not real incident/safety data; no Supabase or API feed; react-native-maps installed but unused |
| Profile / Digital ID | Mobile | Partial | UI renders personal info, emergency contact, medical info, preferences, security section | All data is hardcoded (`Suyash Vasal Jain`, placeholder passport `X1234567`); no Supabase auth; no blockchain Digital ID shown; no editable fields; logout button has no handler |
| Info Screen | Mobile | Complete (static) | How-to-use steps, FAQ section, footer text | Quick Actions section commented out; content is generic placeholder |
| Live Map | Web Dashboard | Partial | react-leaflet MapContainer centered on Guwahati (26.1445, 91.7362), tourist + incident markers with Popups, ResizeMap helper | OpenStreetMap tiles load correctly; markers use default Leaflet icons (fixed with CDN URLs); no real-time data feed; no geo-fence overlays; no heatmap |
| Incident Management | Web Dashboard | Partial | `Sidebar.tsx` has a working Add Incident form (Title, Description, Severity, Type, Lat/Lng, ReportedBy, Status); `IncidentForm.tsx` also exists as a separate component | `onAddIncident` in `App.tsx` is `() => {}` (no-op); `Dashboard.tsx` stub throws `Error("Function not implemented.")`; `IncidentForm.tsx` is never mounted anywhere; no Supabase write |
| Notifications Panel | Web Dashboard | Broken | `NotificationPanel.tsx` renders 3 hardcoded strings; `Sidebar.tsx` renders a proper notification list with mark-read/dismiss | `NotificationPanel.tsx` is a stub not connected to real data; `Dashboard.tsx` uses `NotificationPanel` (stub) while `App.tsx` uses `Sidebar` (actual) — two divergent implementations |
| Safety Score | Web Dashboard | Partial | `SafetyScore.tsx` displays a score; `App.tsx` calculates average from 3 mock tourists | Score is computed from mock data only — no real algorithm, no AI, no Supabase feed |
| AI Alerts | Web Dashboard | Not started | Not implemented | No AI alert logic anywhere in codebase |
| Blockchain Digital ID | Both | Config only | `bloackchainConfig.js` (both root and MobileApp) contains deployed contract ABI and address `0x33985e0e572b06fd2f8324e853b29ba5e90a86d1` with `registerTourist`, `assignGuide`, `addEvidence` functions | `ethers` or `web3.js` not installed; no UI to connect wallet; no call to contract from any screen; file has a typo in filename (`bloackchain` not `blockchain`) |
| Geo-fencing | Both | Not started | Not implemented | No geo-fence zones defined, no entry/exit detection logic |
| AI Chatbot | Mobile | Not started | Not implemented | No chat UI or LLM integration |
| Escalating Safety Alerts | Both | Not started | Not implemented | No alert severity escalation logic |
| Supabase Auth | Both | Not started | SDK installed (web) | No `createClient()` call anywhere; no auth flow |
| Supabase Realtime DB | Both | Not started | SDK installed (web) | No database queries or subscriptions |
| Backend API | Server | Not started | No server directory | No Express/Node.js server, no Python AI service, no API routes |
| Multi-language (Web) | Web | Broken | `translations.ts` has 9 languages; `LanguageSelector.tsx` renders dropdown; `useLanguage.ts` has working hook logic | `LanguageProvider.tsx` is a stub that hardcodes `language: 'en'` and exports a different `LanguageContext` than the one in `useLanguage.ts` — two conflicting contexts; `LanguageSelector` crashes when used because `setLanguage` does not exist on the stub context |
| Offline Maps | Mobile | Not started | `info.tsx` mentions "Download maps for offline use" as a tip | No offline map library (e.g., `expo-file-system` + tile caching) integrated |
| Swadeshi Booking | Both | Not started | Mentioned in README | No booking UI, no hotel database, no payment integration |

---

## 6. What's Working Right Now

1. **Web Dashboard renders** — `npm run dev` in root launches the Vite dev server. The App layout (TopBar + Sidebar + LiveMap + SafetyScore) displays correctly with mock data.
2. **Live Map (web)** — react-leaflet renders an OpenStreetMap centered on Guwahati with 3 tourist markers and 2 incident markers. Leaflet icon fix is correctly applied. Map tiles load from CDN.
3. **Add Incident form (Sidebar)** — The form in `Sidebar.tsx` is visually complete with all fields (Title, Description, Severity, Type, Lat/Lng, ReportedBy, Status) and renders without errors. Submission is silently swallowed (`onAddIncident` is `() => {}`).
4. **Mobile app launches** — `expo start` in MobileApp works. The 5-tab navigation renders with the custom dark tab bar and floating red SOS button.
5. **Home screen — NE India destinations** — All 7 states (Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura) display with images. Each card opens a 3-step modal.
6. **GPS location fetch (mobile)** — `expo-location` correctly requests foreground permission and reverse-geocodes the user's city on Home screen load. Also used in Map tab.
7. **Heatmap map (mobile)** — `map.tsx` renders Leaflet.heat inside a WebView with 3 random safety zones and a relocate button. Visually functional with generated (fake) data.
8. **Profile screen (mobile)** — Renders a complete-looking profile with personal, emergency contact, medical, preferences, and security sections.
9. **Info screen (mobile)** — Static how-to-use guide and FAQ renders fully.
10. **Blockchain contract ABI** — A real Solidity contract ABI is defined with `registerTourist`, `assignGuide`, `addEvidence` functions and corresponding events. The contract address is present (testnet).
11. **Translations data** — `translations.ts` defines 9 Northeast Indian languages for 7 UI keys. Structure is correct and extensible.

---

## 7. What's Broken / Incomplete

1. **`bloackchainConfig.js` filename typo** — File at root and at `MobileApp/bloackchainConfig.js` is named with a typo (`bloackchain`). The README documents it as `blockchainConfig.js`. Any import using the correct spelling will fail.

2. **Gemini API endpoint is wrong** (`MobileApp/app/index.tsx`, line 196) — `https://api.gemini.ai/v1/completions` is not a real endpoint. The correct Google Generative AI endpoint is `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`. The response is also parsed using OpenAI schema (`data.choices[0].text`) — Gemini returns `data.candidates[0].content.parts[0].text`.

3. **API key hardcoded in source** (`MobileApp/app/index.tsx`, line 13) — `const GEMINI_API_KEY = 'AIzaSyBAJbubgfm6dHQgYMRxSAMl9JfiFXrL9oY'` is committed to source. This key will be scraped and abused. Must be moved to an environment variable or a backend proxy.

4. **`LanguageProvider.tsx` is a broken stub** (`src/components/LanguageProvider.tsx`) — It creates its own `LanguageContext` with only `{ language: 'en' }` and no `setLanguage` or `t` function. `useLanguage.ts` exports a completely different `LanguageContext`. Components like `IncidentForm.tsx` and `LanguageSelector.tsx` that call `useLanguage()` will throw `"useLanguage must be used within a LanguageProvider"` at runtime because they get the wrong context.

5. **Duplicate entry points** (`src/main.tsx` and `src/index.tsx`) — Both files render `<App />` to `#root`. Only `main.tsx` is referenced by `index.html`. `src/index.tsx` is dead code.

6. **Duplicate type definitions** (`src/types.ts` and `src/types/index.ts`) — `Tourist`, `Incident`, `Notification` are defined twice. `types/index.ts` adds an `'info'` variant to `Incident.type` and `Notification.type` that `types.ts` lacks. `Dashboard.tsx` imports from `./types` which resolves to `types.ts`, creating potential type mismatches.

7. **`Dashboard.tsx` is non-functional** — All three handler props throw `new Error("Function not implemented.")`. This file is imported nowhere in `main.tsx` or `App.tsx`. It exists as dead code.

8. **`PanicButton` commented out** (`src/App.tsx` line 79) — The component import exists and the `handlePanic` logic is correct, but the rendered `<PanicButton />` tag is commented out.

9. **`NotificationPanel.tsx` is a stub** — Renders three hardcoded strings with no props. It is used in `Dashboard.tsx` (dead code) but not in the active `App.tsx` flow.

10. **`IncidentForm.tsx` is unused** — A fully built incident form component exists in `src/components/IncidentForm.tsx` but is mounted nowhere. `Sidebar.tsx` has its own inline incident form instead.

11. **No Supabase integration** — `@supabase/supabase-js` is in `package.json` but `createClient` is never called. No `.env` file for `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` exists.

12. **No backend exists** — No `server/`, `backend/`, or `api/` directory. The system depends entirely on Supabase as a backend but that is also not integrated.

13. **`ethers` not installed** — The blockchain config defines a deployed contract but `ethers` (or `web3.js`) is not in any `package.json`. No wallet connection UI exists anywhere.

14. **SOS screen is a placeholder** (`MobileApp/app/sos.tsx`) — Contains only `<Text>SOS Screen</Text>`. No actual SOS logic.

15. **Profile data is hardcoded** (`MobileApp/app/profile.tsx`) — Name, Aadhar, passport, emergency contact are developer's personal placeholder data. There is no edit capability and no authentication.

16. **`splash-icon.png` missing** — `app.json` references `./assets/images/splash-icon.png` in the expo-splash-screen plugin config but this file does not exist in `MobileApp/assets/images/`. Build will fail or show a broken splash.

17. **`react-native-maps` installed but unused** — `MobileApp/package.json` includes `react-native-maps@1.20.1` and `@types/react-native-maps` but the map screen uses WebView + Leaflet instead. This is dead weight and requires extra native build config.

18. **Extraneous packages in MobileApp** — `npm list` shows `html-parse-stringify`, `i18next`, `react-i18next`, and `void-elements` as extraneous (installed but not in `package.json`). Run `npm prune` to clean.

19. **`index.html` title is generic** — The browser tab reads "React Website with Live Map" instead of anything related to Mission Atlas or SevenShield.

20. **Duplicate `bloackchainConfig.js`** — The same blockchain config file exists at both root (`/bloackchainConfig.js`) and `/MobileApp/bloackchainConfig.js`. There should be one canonical source.

---

## 8. Dependencies Status

### Web Dashboard (root `package.json`)

| Package | Version | Notes |
|---------|---------|-------|
| react | 18.3.1 | OK |
| react-dom | 18.3.1 | OK |
| vite | 5.4.8 | OK |
| typescript | 5.6.3 | OK |
| tailwindcss | 3.4.17 | OK |
| leaflet | 1.9.4 | OK — used |
| react-leaflet | 4.2.1 | OK — used |
| @types/leaflet | 1.9.20 | OK |
| @supabase/supabase-js | 2.57.4 | Installed, never imported |
| @heroicons/react | 2.2.0 | Used in `IncidentForm.tsx` only |
| lucide-react | 0.344.0 | Installed, not used in any source file |
| uuid | 13.0.0 | Used in `App.tsx` for incident IDs |
| ethers / web3 | **NOT INSTALLED** | Required for blockchain integration |

### Mobile App (`MobileApp/package.json`)

| Package | Version | Notes |
|---------|---------|-------|
| expo | 54.0.7 | OK |
| react | 19.1.0 | OK (note: React 19 — newer than web's React 18) |
| react-native | 0.81.4 | OK |
| expo-router | 6.0.4 | OK — used for navigation |
| expo-location | 19.0.7 | OK — used in Home + Map |
| expo-linear-gradient | 15.0.7 | OK — used in Home header |
| @expo/vector-icons | 15.0.2 | OK — Ionicons, MaterialIcons, FontAwesome5 used |
| @react-navigation/bottom-tabs | 7.4.7 | OK — used in FooterTabs |
| react-native-webview | 13.15.0 | OK — used in Map screen |
| react-native-gesture-handler | 2.28.0 | OK — used in _layout |
| react-native-maps | 1.20.1 | Installed, **not used** |
| expo-haptics | 15.0.7 | Installed, not used |
| expo-symbols | 1.0.7 | Installed, not used |
| i18next | 25.5.2 | Extraneous (not in package.json) |
| react-i18next | 15.7.3 | Extraneous (not in package.json) |
| html-parse-stringify | 3.0.1 | Extraneous |
| void-elements | 3.1.0 | Extraneous |
| ethers / web3 | **NOT INSTALLED** | Required for blockchain integration |
| @supabase/supabase-js | **NOT INSTALLED** | Required for auth + database on mobile |

---

## 9. Remaining Work (Priority Order)

1. **[M] Fix Gemini API integration** — Correct the endpoint URL in `MobileApp/app/index.tsx` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` and update the request/response schema. Move the API key to an environment variable or backend proxy. The itinerary planner is a core demo feature.

2. **[S] Fix `LanguageProvider.tsx`** — Replace the stub in `src/components/LanguageProvider.tsx` with a real provider that uses `useLanguageProvider()` from `src/hooks/useLanguage.ts` and supplies the correct context (`language`, `setLanguage`, `t`). This unblocks all multilingual features.

3. **[M] Implement SOS screen** (`MobileApp/app/sos.tsx`) — Build the actual SOS/panic UI: emergency contact call via `Linking.openURL('tel:...')`, GPS capture, optional Supabase incident write, SMS/notification trigger. This is a core SIH demo feature.

4. **[S] Fix the PanicButton on web** — Uncomment the `<PanicButton />` in `src/App.tsx` line 79 and wire `handlePanic` to actually write an incident to state (the logic is already correct).

5. **[M] Connect Supabase (web dashboard)** — Create `src/lib/supabase.ts` with `createClient()`, add a `.env` file for `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, and replace mock data in `App.tsx` with real `supabase.from('tourists').select()` and `supabase.from('incidents').select()` calls. Add realtime subscription for live updates.

6. **[M] Connect Supabase (mobile)** — Install `@supabase/supabase-js` in MobileApp, add auth flow (login/register screen), and replace hardcoded profile data with real user data from Supabase.

7. **[M] Implement blockchain Digital ID UI** — Install `ethers` in both packages, rename `bloackchainConfig.js` to `blockchainConfig.js` everywhere, build a wallet-connect screen (MetaMask via WalletConnect or Expo Web3 modal), and add `registerTourist()` call on signup. Show the Digital ID on the Profile screen.

8. **[L] Build backend/server** — Create `server/` directory with Node.js + Express. Minimum routes: `POST /api/sos` (creates Supabase incident + notifies contacts), `GET /api/safety-score` (calculates score from incident data). Add Python AI service for alert classification.

9. **[M] Implement geo-fencing** — Define geo-fence polygons for sensitive NE India tourist zones. On mobile, use `expo-location`'s `watchPositionAsync` + turf.js or manual distance check. Trigger blockchain ID verification on zone entry.

10. **[M] Fix Profile screen** — Replace hardcoded data with Supabase auth user. Add edit functionality. Show blockchain Digital ID (contract address + expiry from `registerTourist`).

11. **[S] Fix `splash-icon.png` missing** — Add `MobileApp/assets/images/splash-icon.png` or update `app.json` to point to an existing image to prevent build failure.

12. **[S] Clean up dead code** — Delete `src/Dashboard.tsx` (or wire it up), remove `src/index.tsx` duplicate entry, consolidate `src/types.ts` and `src/types/index.ts` into one file, run `npm prune` in MobileApp.

13. **[S] Rename typo file** — Rename `bloackchainConfig.js` to `blockchainConfig.js` at both root and `MobileApp/`. Update any imports.

14. **[M] Implement offline maps** — Integrate `expo-file-system` + a tile caching strategy (e.g., `expo-sqlite` for tile index) so NE India map tiles work without network.

15. **[L] AI Chatbot** — Build an in-app chat UI (new tab or modal) backed by Gemini API (via backend proxy) for tourist safety Q&A.

16. **[S] Fix `index.html` title** — Change `<title>React Website with Live Map</title>` to `Mission Atlas — SevenShield` or similar.

---

## 10. Next Steps (Immediate Actions)

The following can be done right now without any new accounts or infrastructure:

1. **Fix Gemini itinerary** — In `MobileApp/app/index.tsx` lines 196-210: change the URL to `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, change the body to `{ contents: [{ parts: [{ text: prompt }] }] }`, change the response parse to `data.candidates[0].content.parts[0].text`. This makes the AI itinerary actually work for the demo.

2. **Uncomment PanicButton on web** — Remove the comment markers around `{/* <PanicButton onPanic={handlePanic} /> */}` at `src/App.tsx` line 79. The handler and component are already correct.

3. **Fix LanguageProvider** — Replace the body of `src/components/LanguageProvider.tsx` to use `useLanguageProvider()` and provide `LanguageContext` from `src/hooks/useLanguage.ts`.

4. **Create `.env` file at root** — Add `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=` placeholders (fill from Supabase project settings). Create `src/lib/supabase.ts` with `createClient`. At minimum, write mock tourists/incidents to Supabase so the dashboard reads live data.

5. **Fix splash icon** — Create or copy an existing image to `MobileApp/assets/images/splash-icon.png`.

6. **Rename blockchain config** — `git mv bloackchainConfig.js blockchainConfig.js` at root; same in MobileApp. Update the README accordingly.

7. **Wire SOS screen** — Replace `MobileApp/app/sos.tsx` with a screen that shows a large SOS button, captures GPS via `expo-location`, and calls `Linking.openURL('tel:112')` for emergency services. Even a hardcoded call is better than a blank placeholder for the demo.

---

## 11. Architecture Notes

### Two Divergent Implementations in Web

`App.tsx` and `Dashboard.tsx` represent two separate attempts at the same dashboard layout. `App.tsx` is the active entry point (mounted by `main.tsx`). `Dashboard.tsx` uses `NotificationPanel` (stub), `SafetyScore(score=0)`, and `LiveMap(tourists=[], incidents=[])` with unimplemented handlers. These should be reconciled into one file.

### Type System Inconsistency

`src/types.ts` (used by `App.tsx`) and `src/types/index.ts` (used by `Dashboard.tsx`, `IncidentForm.tsx`, `useLanguage.ts`) differ: `types/index.ts` adds `'info'` to the union types and adds `Language` + `LanguageStrings`. TypeScript will not catch cross-import issues because both files define the same interface names. All types should be consolidated into `src/types/index.ts` and `src/types.ts` deleted.

### Mobile Navigation Architecture

The mobile app uses expo-router v6 (file-based routing) but bypasses it — `_layout.tsx` directly renders `<FooterTabs />` which is a `@react-navigation/bottom-tabs` navigator that manually imports each screen. This is redundant: expo-router's tab layout could replace `FooterTabs.tsx` entirely, or the app could drop expo-router and use pure React Navigation. Currently both are installed and potentially conflicting.

### Blockchain Config Duplication

The identical `bloackchainConfig.js` file exists at both the web root and inside `MobileApp/`. There should be one source of truth (e.g., a shared `packages/` monorepo structure, or the web root version imported relatively). The contract address `0x33985e0e572b06fd2f8324e853b29ba5e90a86d1` appears to be deployed on a testnet (likely Polygon Mumbai or Sepolia based on the project description) — the network is not documented in the config.

### No Environment Variable Management

There are no `.env` files anywhere. The Gemini API key is hardcoded in source code. Supabase credentials have not been added. Before any real deployment or even a demo with live features, a `.env` + `.env.example` setup is needed for both the web root and `MobileApp/`.

### Heatmap Uses Fake Data

`MobileApp/app/map.tsx` generates random safety zones using `Math.random()` centered on the user's GPS coordinates. This gives a visually impressive heatmap but communicates false safety information. For the SIH demo, these zones should either come from Supabase incident data or at minimum use predetermined fixed coordinates around known NE India areas.
