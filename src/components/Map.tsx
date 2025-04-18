import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";

import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// getIconUrl is a private Leaflet method we intentionally override
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type MarkerData = {
  id: string;
  coords: [number, number];
  name: string;
};

type MapViewProps = {
  center: [number, number];
  zoom: number;
  markers: MarkerData[];
};

const MapView = ({ center, zoom, markers }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const map = L.map("map", { zoomControl: false }).setView(center, zoom);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  // Update map view on prop change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      L.marker(marker.coords).addTo(markerLayerRef.current!).bindPopup(marker.name);
    });
  }, [markers]);

  return <div id="map" />;
};

export default MapView;
