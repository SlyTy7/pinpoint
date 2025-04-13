import { useEffect, useState } from "react";
import Map from "./components/Map";
import MarkerCard from "./components/MarkerCard";
import HeaderCard from "./components/HeaderCard";
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
				{ id: 0, coords: [37.7749, -122.4194], name: "San Francisco" },
				{ id: 1, coords: [37.9101, -122.0652], name: "Walnut Creek" },
				{ id: 2, coords: [37.3387, -121.8853], name: "San Jose" },
				{ id: 3, coords: [37.8044, -122.2712], name: "Oakland" },
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
			name: cityName,
		};

		setTimeout(() => {
			setMarkers((prev) => [...prev, newMarker]);
			setLoading(false);
		}, 2000);
	};

	return (
		<>
			<HeaderCard onMarkerClick={() => setShowMarkers(!showMarkers)} />
			{showMarkers && (
				<MarkerCard
					loading={loading}
					markers={markers}
					userLocation={userLocation}
					onPanToMarker={handlePanToMarker}
					createNewMarker={createNewMarker}
				/>
			)}
			<Map center={coordinates} zoom={zoomLevel} markers={markers} />
		</>
	);
}

export default App;
