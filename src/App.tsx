import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css"

import HeaderCard from "./components/HeaderCard";
import MarkerCard from "./components/MarkerCard";
import { getCityFromCoords } from "./utils/geo";

type MarkerData = {
  id: number;
  coords: [number, number];
  name: string;
};

function App() {
  const [coordinates, setCoordinates] = useState<[number, number]>([37.7749, -122.4194]);
  const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(7);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [showMarkers, setShowMarkers] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const map = L.map("map", { zoomControl: false }).setView(coordinates, zoomLevel);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    getMarkers();

    navigator.geolocation.getCurrentPosition((position) => {
      const roundedLat = parseFloat(position.coords.latitude.toFixed(4));
      const roundedLng = parseFloat(position.coords.longitude.toFixed(4));
      setUserLocation([roundedLat, roundedLng]);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(coordinates, zoomLevel);
    }
  }, [coordinates, zoomLevel]);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      L.marker(marker.coords).addTo(markerLayerRef.current!).bindPopup(marker.name);
    });
  }, [markers]);

  const getMarkers = () => {
    const staticMarkers: MarkerData[] = [
      { id: 0, coords: [37.7749, -122.4194], name: "San Francisco" },
      { id: 1, coords: [37.9101, -122.0652], name: "Walnut Creek" },
      { id: 2, coords: [37.3387, -121.8853], name: "San Jose" },
      { id: 3, coords: [37.8044, -122.2712], name: "Oakland" },
    ];
    setMarkers(staticMarkers);
  };

  const handleMarkerClick = () => {
    setShowMarkers((prev) => !prev);
  };

  const handlePanToMarker = (coords: [number, number]) => {
    setCoordinates(coords);
    setZoomLevel(10);
    setShowMarkers(false);
  };

  const createNewMarker = async (coords: [number, number]) => {
    setLoading(true);
    const cityName = await getCityFromCoords(coords[0], coords[1]);
    const newMarker: MarkerData = {
      id: markers.length,
      coords,
      name: cityName ?? "Unknown",
    };

    setTimeout(() => {
      setMarkers((prev) => [...prev, newMarker]);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <HeaderCard onMarkerClick={handleMarkerClick} />
      {showMarkers && (
        <MarkerCard
          loading={loading}
          markers={markers}
          userLocation={userLocation}
          onPanToMarker={handlePanToMarker}
          createNewMarker={createNewMarker}
        />
      )}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </>
  );
}

export default App;
