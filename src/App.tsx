import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

const MarkerCard = ({
	markers,
	onPanToMarker,
}: {
	markers: MarkerData[];
	onPanToMarker: (coords: [number, number]) => void;
}) => (
	<div className="markers card">
			<div className="marker header-marker">
				<div className="name">Name</div>
				<div className="coords">Coordinates</div>
				<div className="actions">Actions</div>
			</div>
		{markers.map((marker) => (
			<div className="marker" data-markerid={marker.id} key={marker.id}>
				<div className="name">{marker.name}</div>
				<div className="coords">{marker.coords.join(", ")}</div>
				<div className="actions">
					<button onClick={() => onPanToMarker(marker.coords)}>Go To</button>
				</div>
			</div>
		))}
	</div>
);

type HeaderCardProps = {
	onMarkerClick: () => void;
};


const HeaderCard = ({ onMarkerClick }: HeaderCardProps) => (
	<div className="header card">
		<h1>PinPoint</h1>
		<button onClick={onMarkerClick}>Markers</button>
	</div>
);

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [zoomLevel, setZoomLevel] = useState(8);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [showMarkers, setShowMarkers] = useState<boolean>(false);

	const mapOptions: L.MapOptions = { zoomControl: false };

	const mapRef = useRef<L.Map | null>(null);
	const markerLayerRef = useRef<L.LayerGroup | null>(null);

	// Initialize map
	useEffect(() => {
		const map = L.map("map", mapOptions).setView(coordinates, zoomLevel);
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
				name: "San Francisco",
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
		setShowMarkers(!showMarkers);
	};

	const handlePanToMarker = (coords: [number, number]) => {
		setCoordinates(coords);
		setZoomLevel(12); // zoom in when panning
		setShowMarkers(false); // close markers meny after clicking
	};

	return (
		<>
			<HeaderCard onMarkerClick={handleMarkerClick} />
			{showMarkers && <MarkerCard markers={markers} onPanToMarker={handlePanToMarker} />}
			<div id="map" style={{ height: "500px", width: "100%" }}></div>
		</>
	);
}

export default App;
