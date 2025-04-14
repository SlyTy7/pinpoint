import { useEffect, useState } from "react";
import Map from "./components/Map";
import MarkerCard from "./components/MarkerCard";
import Header from "./components/Header";
import { getCityFromCoords } from "./utils/geo";
import "./styles/App.css";

export type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
	const [loading, setLoading] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(7);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [showMarkers, setShowMarkers] = useState(false);

	useEffect(() => {
		const getMarkers = () => {
			const activeMarkers: MarkerData[] = [
				{ id: 1, coords: [37.9101, -122.0652], name: "Walnut Creek" },
				{ id: 2, coords: [37.3387, -121.8853], name: "San Jose" },
				{ id: 3, coords: [37.8044, -122.2712], name: "Oakland" },
				{ id: 4, coords: [34.0522, -118.2437], name: "Los Angeles" },
				{ id: 5, coords: [40.7128, -74.006], name: "New York City" },
				{ id: 6, coords: [41.8781, -87.6298], name: "Chicago" },
				{ id: 7, coords: [29.7604, -95.3698], name: "Houston" },
				{ id: 8, coords: [39.7392, -104.9903], name: "Denver" },
				{ id: 9, coords: [25.7617, -80.1918], name: "Miami" },
				{ id: 10, coords: [47.6062, -122.3321], name: "Seattle" },
			];
			setMarkers(activeMarkers);
		};

		getMarkers();

		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude } = position.coords;
			setUserLocation([
				parseFloat(latitude.toFixed(4)),
				parseFloat(longitude.toFixed(4)),
			]);
		});
	}, []);

	const handleDeleteMarkers = (ids: number[]) => {
		setMarkers((prev) => prev.filter((marker) => !ids.includes(marker.id)));
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
			id: markers.length + 1,
			coords,
			name: cityName,
		};

		setTimeout(() => {
			setMarkers((prev) => [...prev, newMarker]);
			setLoading(false);
		}, 2000);
	};

	return (
		<>
			<Header onMarkerClick={() => setShowMarkers(!showMarkers)} />
			{showMarkers && (
				<MarkerCard
					loading={loading}
					markers={markers}
					userLocation={userLocation}
					onPanToMarker={handlePanToMarker}
					createNewMarker={createNewMarker}
					onDeleteMarkers={handleDeleteMarkers}
				/>
			)}
			<Map center={coordinates} zoom={zoomLevel} markers={markers} />
		</>
	);
}

export default App;
