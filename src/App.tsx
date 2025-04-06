import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [coordinates, setCoordinates] = useState<[number, number]>([
    37.7749, -122.4194,
  ]); // Initial coordinates (San Francisco)
  const [zoomLevel, setZoomLevel] = useState(10); // Set initial zoom level

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: false }).setView(
        coordinates,
        zoomLevel
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );
    }

    // Cleanup the map when the component unmounts
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(coordinates, zoomLevel);
    }
  }, [coordinates, zoomLevel]);

  return (
    <>
      <div className="header card">
        <div className="logo-container">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>PinPoint</h1>
        <div className="button-container">
          <button
            onClick={() => {
              setCoordinates([37.7749, -122.4194]); // Set to San Francisco
              setZoomLevel(10); // Adjust zoom as needed
            }}
          >
            Go Home
          </button>
        </div>
      </div>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </>
  );
}

export default App;
