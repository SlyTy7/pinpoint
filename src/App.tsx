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
				{ id: 11, coords: [38.9072, -77.0369], name: "Washington D.C." },
				{ id: 12, coords: [32.7767, -96.797], name: "Dallas" },
				{ id: 13, coords: [33.4484, -112.074], name: "Phoenix" },
				{ id: 14, coords: [39.9526, -75.1652], name: "Philadelphia" },
				{ id: 15, coords: [42.3601, -71.0589], name: "Boston" },
				{ id: 16, coords: [45.5051, -122.675], name: "Portland" },
				{ id: 17, coords: [36.1699, -115.1398], name: "Las Vegas" },
				{ id: 18, coords: [35.2271, -80.8431], name: "Charlotte" },
				{ id: 19, coords: [36.1627, -86.7816], name: "Nashville" },
				{ id: 20, coords: [39.7684, -86.1581], name: "Indianapolis" },
				{ id: 21, coords: [30.2672, -97.7431], name: "Austin" },
				{ id: 22, coords: [44.9778, -93.265], name: "Minneapolis" },
				{ id: 23, coords: [35.7796, -78.6382], name: "Raleigh" },
				{ id: 24, coords: [43.0389, -87.9065], name: "Milwaukee" },
				{ id: 25, coords: [40.4406, -79.9959], name: "Pittsburgh" },
				{ id: 26, coords: [38.2527, -85.7585], name: "Louisville" },
				{ id: 27, coords: [35.0844, -106.6504], name: "Albuquerque" },
				{ id: 28, coords: [32.7555, -97.3308], name: "Fort Worth" },
				{ id: 29, coords: [36.1745, -115.1372], name: "Paradise" },
				{ id: 30, coords: [27.9506, -82.4572], name: "Tampa" },
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
