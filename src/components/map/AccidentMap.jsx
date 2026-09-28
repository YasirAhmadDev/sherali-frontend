import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

import { ACCIDENT_TYPES, DEFAULT_MAP_ZOOM, KABUL_CENTER } from "@/utils/constants";
import { formatDateTime, labelFor } from "@/utils/formatters";

export const SEVERITY_COLORS = { low: "#22c55e", medium: "#eab308", high: "#ef4444" };
const RADIUS = { low: 6, medium: 8, high: 10 };

// Zooms the map so every point is visible
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(
      points.map((p) => [p.coordinates.lat, p.coordinates.lng]),
      { padding: [30, 30], maxZoom: 15 }
    );
  }, [points, map]);

  return null;
}

// points = [{ _id, date, district, roadName, coordinates: { lat, lng }, type, injured, deaths, severity }]
export default function AccidentMap({ points = [], className = "h-[65vh] min-h-80" }) {
  return (
    <MapContainer center={KABUL_CENTER} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom className={`w-full ${className}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds points={points} />

      {points.map((p) => (
        <CircleMarker
          key={p._id}
          center={[p.coordinates.lat, p.coordinates.lng]}
          radius={RADIUS[p.severity] ?? 6}
          pathOptions={{
            color: SEVERITY_COLORS[p.severity] ?? "#22c55e",
            fillColor: SEVERITY_COLORS[p.severity] ?? "#22c55e",
            fillOpacity: 0.6,
            weight: 2,
          }}
        >
          <Popup>
            <div className="space-y-1 text-sm text-slate-800">
              <p className="font-semibold">{p.roadName || p.district}</p>
              <p className="text-xs text-slate-500">{formatDateTime(p.date)}</p>
              <p>
                {labelFor(ACCIDENT_TYPES, p.type)} · {p.district}
              </p>
              <p>
                Injured <b>{p.injured}</b> · Deaths <b>{p.deaths}</b>
              </p>
              <Link to={`/accidents/${p._id}`} className="font-medium text-green-700 underline">
                View details
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}