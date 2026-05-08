# Implementation prompt: hero search + OpenStreetMap-style map with pin

Use this document as the **full specification** for another coding agent. Goal: reproduce the same **geography + Leaflet map + draggable/clickable pin** behaviour from this project, applied to a **hero section search**: when the user searches for a place (treat as city or locality name), resolve it to coordinates, show the result in a **search UI area**, and render the same **OpenStreetMap raster tiles + marker** pattern.

---

## 1. What you are cloning (behaviour)

- **Hierarchy in data**: India is modeled as **states → districts** (762 districts). There is **no separate “cities” table** in the shipped JSON; district names often correspond to urban centres. If the product copy says “city”, implement search against **district names** (and optionally state), or add a **runtime geocoder** for arbitrary strings (see §6).

- **Map**: **Leaflet** + **react-leaflet**, **OpenStreetMap** standard raster tiles (`tile.openstreetmap.org`), default marker with **CDN icon URLs** (bundlers break Leaflet’s default marker assets).

- **Pin logic** (match existing calculator pattern):
  - **Default marker**: district centroid `lat` / `lon` from the dataset when a district is selected.
  - **User override**: map click or marker drag updates `lat` / `lon` (optional for hero flow if you only need “search → pin”).
  - **Map centre**: recentre when the resolved location changes (district change or new search result).

- **Next.js** (if used): load the map component with **`next/dynamic(..., { ssr: false })`** so Leaflet never runs on the server.

---

## 2. Canonical data file (give this to the other project)

**Path in this repo:** `src/data/india-geography.json`

**Top-level shape:**

```json
{
  "meta": { "generatedAt": "...", "districtList": {...}, "coordinates": {...}, "stats": {...} },
  "states": [
    {
      "id": "gujarat",
      "name": "Gujarat",
      "districts": [
        { "id": "ahmedabad", "name": "Ahmedabad", "lat": 22.745539, "lon": 72.297491 }
      ]
    }
  ]
}
```

- **`states[].id` / `districts[].id`**: URL-safe slugs (lowercase, hyphens).
- **`lat` / `lon`**: WGS84, used as **map centre and default pin** for that district.

**How this file was produced (for regeneration, not required at runtime):**  
`scripts/build-geography.mjs` — merges district list from **iaseth/data-for-india** with coordinates from **Photon (Komoot)** OSM search, fallback centroids from **geohacker/india** GeoJSON. Command: `npm run generate:data`.

**Copy strategy for the target app:** Copy `india-geography.json` as-is, or import a trimmed subset. Keep the same JSON shape if you want to reuse the helper logic below unchanged.

---

## 3. TypeScript types and in-memory index (optional but recommended)

Reference: `src/types/index.ts`

- Import JSON and cast: `GeographyFile` with `states: GeographyState[]`, each `GeographyState` has `districts: GeographyDistrict[]` where each district has `id`, `name`, `lat`, `lon`.
- Export `INDIA_GEOGRAPHY` (or equivalent) for lookups.

---

## 4. Helper functions to port

Reference: `src/lib/region.ts`

Port at minimum:

| Function | Purpose |
|----------|---------|
| `listGeographyStates()` | All states for dropdowns / search scope. |
| `getGeographyState(stateId)` | State row or undefined. |
| `getGeographyDistrict(stateId, districtId)` | District row with coordinates. |
| `coordsForLocation(stateId, districtId \| null)` | District centroid if `districtId` resolves; else **mean centroid** of all districts in that state. |

For **hero search**, you will usually call `getGeographyDistrict` after resolving the user query to `(stateId, districtId)`, then use `district.lat` / `district.lon` for `[markerLat, markerLon]` and map `center`.

---

## 5. Map component contract (port or reimplement)

Reference files:

- `src/components/map/PinMap.tsx` — Leaflet `MapContainer`, `TileLayer` (OSM URL + attribution), `Marker` (draggable optional), `useMapEvents` for click-to-move pin, `useMap` + `useEffect` to **recenter** when `center` changes, `fixLeafletIcons()` for CDN marker images.
- `src/components/map/PinMapPanel.tsx` — `dynamic(() => import(...PinMap), { ssr: false })` + loading placeholder.

**Props to mirror:**

- `center: [number, number]` — map view centre when location changes.
- `marker: [number, number]` — marker position (can equal `center` until user drags).
- `onMarkerChange?: (lat: number, lon: number) => void` — optional; omit if hero is search-only.

**Tile layer (required):**

- URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Attribution: link to OpenStreetMap copyright page (see `PinMap.tsx`).

**Dependencies:** `leaflet`, `react-leaflet`; dev `@types/leaflet`. Import `leaflet/dist/leaflet.css` in the map module.

---

## 6. Hero “city” search → pin (implementation choices)

The dataset keys on **district names**, not OSM “city” nodes. Pick one or combine:

**A. Dataset-only search (no external API)**  
- Build a flat list: `{ stateId, stateName, districtId, districtName, lat, lon }[]` from `INDIA_GEOGRAPHY`.  
- On submit / debounced input: **fuzzy match** `districtName` (and optionally `stateName`) against the query string.  
- Best match → set `stateId`, `districtId`, `center` = `marker` = `[lat, lon]`.  
- Show resolved label in the “search section” (e.g. “Ahmedabad, Gujarat”).

**B. Geocoder + optional snap-to-district**  
- Call **Photon** (`https://photon.komoot.io/api/?q=...`) or **Nominatim** (respect usage policy) with the user query + “India” bias.  
- Use returned `lat`/`lon` for the pin; optionally find nearest district centroid from the JSON for policy/UI consistency.

**C. Hybrid**  
- Try exact / fuzzy match on local JSON first; if no confident match, fall back to geocoder.

**UX details to match “the same thing we do”:**

- After resolution, **fly or set view** to the coordinates (zoom ~10 for district scale, adjust for metro vs rural).  
- If using draggable marker, changing district from search should **reset** marker to the new centroid unless you intentionally keep user offset.

---

## 7. State management sketch (hero + map)

Minimal state:

- `query: string` — raw search input.  
- `resolved: null | { label: string; stateId: string; districtId: string; lat: number; lon: number }` — drives map + “search section” display.  
- `error: string | null` — no match / geocoder failure.

On successful resolution: update `resolved`, set map `center` and `marker` to `[lat, lon]`.

---

## 8. SolarBharat-specific pieces (ignore unless you need them)

- `src/app/api/solar/route.ts` and `src/lib/clientSolar.ts` resolve **pin lat/lon** vs **district centroid** for irradiance APIs — not required for a pure “hero search + map pin” feature.  
- `src/store/calculatorStore.ts` shows **Zustand** patterns for `stateId`, `districtId`, `pinLat`/`pinLon`, cache keys — useful as reference for pin override + refetch logic.

---

## 9. Acceptance checklist for the implementing agent

- [ ] `india-geography.json` (or equivalent) is present and typed.  
- [ ] Hero (or header) search resolves a string to **coordinates** (via JSON match and/or geocoder).  
- [ ] A **search result section** shows human-readable place name (state + district at minimum).  
- [ ] **Leaflet** map uses **OSM** tiles and correct **attribution**.  
- [ ] **Marker** appears at resolved coordinates; map **centres** on that location when the result changes.  
- [ ] **Default marker images** work under Vite/Next/webpack (CDN icon fix or equivalent).  
- [ ] **No SSR** of Leaflet in Next.js (`dynamic` + `ssr: false`).  
- [ ] Empty / ambiguous query shows clear empty state or error, no crash.

---

## 10. File index (this repository)

| Concern | File |
|---------|------|
| District/state JSON | `src/data/india-geography.json` |
| Types + `INDIA_GEOGRAPHY` | `src/types/index.ts` |
| Lookups + centroids | `src/lib/region.ts` |
| Map + OSM tiles + pin | `src/components/map/PinMap.tsx` |
| Next dynamic wrapper | `src/components/map/PinMapPanel.tsx` |
| Full calculator UI wiring | `src/sections/CalculatorPage.tsx` |
| Store + pin + solar cache | `src/store/calculatorStore.ts` |
| Regenerate geography | `scripts/build-geography.mjs` |

---

## 11. One-line prompt you can paste into the other agent

> Implement a hero-section location search that resolves the user’s query to coordinates (fuzzy-match against a bundled `india-geography.json` of Indian states and districts with `lat`/`lon` centroids, optionally fallback to Photon/Nominatim), display the resolved place name in a results area, and render a Leaflet map with OpenStreetMap raster tiles and a marker at those coordinates, matching the patterns in `PinMap.tsx` / `PinMapPanel.tsx` (dynamic import `ssr: false`, CDN Leaflet default icons, recenter on result change). Data shape: `{ states: [{ id, name, districts: [{ id, name, lat, lon }] }] }`.

End of prompt.
