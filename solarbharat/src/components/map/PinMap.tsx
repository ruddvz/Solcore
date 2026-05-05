'use client'

import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/** Leaflet default markers break under bundlers — use CDN assets once per session */
function fixLeafletIcons() {
  const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: string }
  delete proto._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap()
  const [lat, lon] = center
  useEffect(() => {
    map.setView([lat, lon], map.getZoom())
  }, [lat, lon, map])
  return null
}

function ClickHandler({
  onPosition,
}: {
  onPosition: (lat: number, lon: number) => void
}) {
  useMapEvents({
    click(e) {
      onPosition(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export type PinMapProps = {
  /** Initial map centre when district/state changes */
  center: [number, number]
  /** Active marker (usually pin or district centroid) */
  marker: [number, number]
  onMarkerChange: (lat: number, lon: number) => void
  /** Optional label for assistive context */
  ariaLabel?: string
}

export function PinMap({ center, marker, onMarkerChange, ariaLabel }: PinMapProps) {
  useEffect(() => {
    fixLeafletIcons()
  }, [])

  const key = `${center[0].toFixed(4)},${center[1].toFixed(4)}`

  return (
    <div
      className="overflow-hidden rounded-xl border border-white/15"
      style={{ height: 260 }}
      role="region"
      aria-label={ariaLabel}
    >
      <MapContainer
        key={key}
        center={center}
        zoom={10}
        scrollWheelZoom
        className="h-full w-full [&_.leaflet-control-attribution]:text-[10px]"
        style={{ background: '#0d1a2e' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        <ClickHandler onPosition={onMarkerChange} />
        <Marker
          position={marker}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const m = e.target.getLatLng()
              onMarkerChange(m.lat, m.lng)
            },
          }}
        />
      </MapContainer>
    </div>
  )
}
