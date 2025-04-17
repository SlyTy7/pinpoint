import "./styles/App.css";

import { useEffect, useState, useCallback } from "react";
import { getCityFromCoords } from "./utils/geo";
import { auth } from "./firebase/init";
import {
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";

import Map from "./components/Map";
import Header from "./components/Header";
import MarkerCard from "./components/MarkerCard";
import AccountCard from "./components/AccountCard";

export type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

// TODO: remove and get this from a database via API
const STATIC_MARKERS: MarkerData[] = [
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

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
	const [isLoading, setIsLoading] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(7);
	const [markers, setMarkers] = useState<MarkerData[]>([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showMarkerCard, setShowMarkerCard] = useState(false);
	const [showAccountCard, setShowAccountCard] = useState(false);

	useEffect(() => {
		// TODO: remove and get this from a database via API
		setMarkers(STATIC_MARKERS);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setUserLocation([
					parseFloat(latitude.toFixed(4)),
					parseFloat(longitude.toFixed(4)),
				]);
			},
			(error) => {
				console.warn("Geolocation failed:", error);
			}
		);

		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user);
		});

		return () => unsubscribe(); // clean up listener on unmount
	}, []);

	const handleDeleteMarkers = (ids: number[]) => {
		setMarkers((prev) => prev.filter((marker) => !ids.includes(marker.id)));
	};

	const handlePanToMarker = useCallback((coords: [number, number]) => {
		setCoordinates(coords);
		setZoomLevel(10);
		setShowMarkerCard(false);
	}, []);

	const handleLogin = async (providerType: string) => {
		try {
			let provider;

			if (providerType === "Google") {
				provider = new GoogleAuthProvider();
			}

			if (provider) {
				const signInResponse = await signInWithPopup(auth, provider);


				console.log(signInResponse);

				setIsLoggedIn(true);

				console.log(auth);

				return signInResponse;
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const createNewMarker = async (coords: [number, number]) => {
		setIsLoading(true);
		const cityName = await getCityFromCoords(coords[0], coords[1]);
		const newMarker: MarkerData = {
			id: markers.length + 1,
			coords,
			name: cityName,
		};

		setTimeout(() => {
			setMarkers((prev) => [newMarker, ...prev]);
			setIsLoading(false);
		}, 2000);
	};

	const toggleCard = (card: "markers" | "account") => {
		if (card === "markers") {
			setShowMarkerCard(!showMarkerCard);
			if (showAccountCard) setShowAccountCard(false);
		}

		if (card === "account") {
			setShowAccountCard(!showAccountCard);
			if (showMarkerCard) setShowMarkerCard(false);
		}
	};

	return (
		<>
			<Header
				isLoggedIn={isLoggedIn}
				onMarkerClick={() => toggleCard("markers")}
				onAccountButtonClick={() => toggleCard("account")}
			/>
			{showMarkerCard && (
				<MarkerCard
					isLoading={isLoading}
					markers={markers}
					userLocation={userLocation}
					onPanToMarker={handlePanToMarker}
					createNewMarker={createNewMarker}
					onDeleteMarkers={handleDeleteMarkers}
				/>
			)}
			{showAccountCard && (
				<AccountCard
					isLoggedIn={isLoggedIn}
					isLoading={isLoading}
					onLogin={handleLogin}
					onLogout={handleLogout}
				/>
			)}
			<Map center={coordinates} zoom={zoomLevel} markers={markers} />
		</>
	);
}

export default App;
