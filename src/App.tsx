import "./styles/App.css";

import { useEffect, useState, useCallback } from "react";
import { getCityFromCoords } from "./utils/geo";
import {
	collection,
	addDoc,
	getDocs,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { auth, db } from "./firebase/init";
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
	id: string;
	coords: [number, number];
	name: string;
};

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

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setIsLoggedIn(!!user);

			if (user) {
				const snapshot = await getDocs(
					collection(db, "users", user.uid, "markers")
				);
				const userMarkers = snapshot.docs.map((doc) => ({
					id: doc.id,
					...(doc.data() as Omit<MarkerData, "id">),
				}));
				setMarkers(userMarkers);
			}
		});

		return () => unsubscribe();
	}, []);

	const handleDeleteMarkers = async (ids: string[]) => {
		const user = auth.currentUser;
		if (!user) return;

		setMarkers((prev) => prev.filter((marker) => !ids.includes(marker.id)));

		for (const id of ids) {
			const markerRef = doc(db, "users", user.uid, "markers", id);
			await deleteDoc(markerRef);
		}
	};

	const handlePanToMarker = useCallback((coords: [number, number]) => {
		setCoordinates(coords);
		setZoomLevel(10);
		setShowMarkerCard(false);
	}, []);

	const handleLogin = async (providerType: string) => {
		try {
			setIsLoading(true);

			let type = providerType.toLowerCase();
			let provider;

			if (type === "google") {
				provider = new GoogleAuthProvider();
			}

			if (provider) {
				await signInWithPopup(auth, provider);
				setIsLoggedIn(true);
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

		const user = auth.currentUser;
		if (!user) return;

		const markerData = {
			coords,
			name: cityName,
			timestamp: Date.now(), // optional
		};

		const userMarkersRef = collection(db, "users", user.uid, "markers");
		const docRef = await addDoc(userMarkersRef, markerData); // Firestore doc ID is here

		const newMarker: MarkerData = {
			id: docRef.id, // use Firestore doc ID
			coords,
			name: cityName,
		};

		setMarkers((prev) => [newMarker, ...prev]);
		setIsLoading(false);
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
