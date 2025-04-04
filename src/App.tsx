import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [zoomLevel, setZoomLevel] = useState(3);

	const Map = () => {
		useEffect(() => {
			const map = L.map("map", { zoomControl: false }).setView(
				coordinates,
				zoomLevel
			);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "&copy; OpenStreetMap contributors",
			}).addTo(map);

			return () => {
				map.remove(); // Cleanup on unmount
			};
		}, []);

		return <div id="map"></div>;
	};

	return (
		<>
			<div className="header card">
				<div className="logo-container">
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img
							src={reactLogo}
							className="logo react"
							alt="React logo"
						/>
					</a>
				</div>
				<h1>PinPoint</h1>
        <div className="button-container">
          <button
            onClick={() => {
              setCoordinates([37.7749, -122.4194]);
            }}
          >
            Go Home
          </button>
        </div>
			</div>
			<Map></Map>
		</>
	);
}

export default App;
