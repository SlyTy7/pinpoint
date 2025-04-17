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

export type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

// TODO: remove and get this from a database via API
const STATIC_MARKERS: MarkerData[] = [
	{ id: 1744859592001, coords: [37.9101, -122.0652], name: "Walnut Creek" },
	{ id: 1744859592002, coords: [37.3387, -121.8853], name: "San Jose" },
	{ id: 1744859592003, coords: [37.8044, -122.2712], name: "Oakland" },
	{ id: 1744859592004, coords: [34.0522, -118.2437], name: "Los Angeles" },
	{ id: 1744859592005, coords: [40.7128, -74.006], name: "New York City" },
	{ id: 1744859592006, coords: [41.8781, -87.6298], name: "Chicago" },
	{ id: 1744859592007, coords: [29.7604, -95.3698], name: "Houston" },
	{ id: 1744859592008, coords: [39.7392, -104.9903], name: "Denver" },
	{ id: 1744859592009, coords: [25.7617, -80.1918], name: "Miami" },
	{ id: 1744859592010, coords: [47.6062, -122.3321], name: "Seattle" },
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
			setIsLoading(true);

			let provider;

			if (providerType === "Google") {
				provider = new GoogleAuthProvider();
			}

			if (provider) {
				await signInWithPopup(auth, provider);
				setIsLoggedIn(true);
				setMarkers(STATIC_MARKERS);
			}

			setIsLoading(false);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleLogout = async () => {
		try {
			setIsLoading(true);
			// sign out of google account auth
			await signOut(auth);
			// reset markers on logging out
			setMarkers([]);
			// close open cards
			if (showAccountCard) setShowAccountCard(false);
			if (showMarkerCard) setShowMarkerCard(false);
			// give a loading state of at least 3 seconds
			setTimeout(() => {
				setIsLoading(false);
			}, 3000);
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const createNewMarker = async (coords: [number, number]) => {
		setIsLoading(true);
		const cityName = await getCityFromCoords(coords[0], coords[1]);
		const newMarker: MarkerData = {
			id: Date.now(),
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
				isLoading={isLoading}
				onMarkerClick={() => toggleCard("markers")}
				onLoginClick={() => handleLogin("Google")}
				onLogoutClick={handleLogout}
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
			<Map center={coordinates} zoom={zoomLevel} markers={markers} />
		</>
	);
}

export default App;
