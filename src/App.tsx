import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [zoomLevel, setZoomLevel] = useState(10);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [showMarkers, setShowMarkers] = useState<boolean>(false);

	const mapRef = useRef<L.Map | null>(null);
	const markerLayerRef = useRef<L.LayerGroup | null>(null);

	// Initialize map
	useEffect(() => {
		const map = L.map("map", { zoomControl: false }).setView(coordinates, zoomLevel);
		mapRef.current = map;

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
			map
		);

		markerLayerRef.current = L.layerGroup().addTo(map);

		getMarkers();

		return () => {
			map.remove();
			mapRef.current = null;
		};
	}, []);

	// Sync view with state
	useEffect(() => {
		if (mapRef.current) {
			mapRef.current.setView(coordinates, zoomLevel);
		}
	}, [coordinates, zoomLevel]);

	// Render markers when state changes
	useEffect(() => {
		if (!mapRef.current || !markerLayerRef.current) return;

		markerLayerRef.current.clearLayers();

		markers.forEach((marker) => {
			L.marker(marker.coords)
				.addTo(markerLayerRef.current!)
				.bindPopup(marker.name);
		});
	}, [markers]);

	const getMarkers = () => {
		const activeMarkers: MarkerData[] = [
			{
				id: 0,
				coords: [37.7749, -122.4194],
				name: "Home",
			},
			{
				id: 1,
				coords: [37.9101, -122.0652],
				name: "Walnut Creek",
			},
			{
				id: 2,
				coords: [37.3387, -121.8853],
				name: "San Jose",
			},
			{
				id: 3,
				coords: [37.8044, -122.2712],
				name: "Oakland",
			},
		];

		setMarkers(activeMarkers);
	};

	const handleMarkerClick = () => {
    setShowMarkers(!showMarkers)
  };

	const Markers = () => {
		if (showMarkers) {
			return <div className="markers card"></div>;
		}
	};

	return (
		<>
			<div className="header card">
				<div className="logo-container">
					<a href="https://vite.dev" target="_blank" rel="noreferrer">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a
						href="https://react.dev"
						target="_blank"
						rel="noreferrer"
					>
						<img
							src={reactLogo}
							className="logo react"
							alt="React logo"
						/>
					</a>
				</div>
				<h1>PinPoint</h1>
				<div className="button-container">
					<button onClick={handleMarkerClick}>Markers</button>
					<button
						onClick={() => {
							setCoordinates([37.7749, -122.4194]);
							setZoomLevel(10);
						}}
					>
						Go Home
					</button>
				</div>
			</div>
			<Markers></Markers>
			<div id="map" style={{ height: "500px", width: "100%" }}></div>
		</>
	);
}

export default App;
