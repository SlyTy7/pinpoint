import { useEffect, useRef, useState } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	Typography,
	Button,
	Stack,
	Divider,
	Box,
} from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

const MarkerCard = ({
	loading,
	markers,
	userLocation,
	onPanToMarker,
	createNewMarker,
}: {
	loading: boolean;
	markers: MarkerData[];
	userLocation: [number, number];
	onPanToMarker: (coords: [number, number]) => void;
	createNewMarker: (coords: [number, number]) => void;
}) => (
	<Card
		sx={{
			maxWidth: 400,
			position: "absolute",
			top: 80,
			left: 20,
			zIndex: 1000,
		}}
	>
		<CardHeader title="Markers" />
		<CardContent>
			<Box>
				<Stack
					direction="row"
					justifyContent="space-between"
					sx={{ mb: 1 }}
				>
					<Typography variant="subtitle2">Name</Typography>
					<Typography variant="subtitle2">Coordinates</Typography>
				</Stack>
				<Divider />
				{markers.map((marker) => (
					<Box
						key={marker.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							padding: 1,
							cursor: "pointer",
							"&:hover": { backgroundColor: "#f5f5f5" },
						}}
						onClick={() => onPanToMarker(marker.coords)}
					>
						<Typography>{marker.name}</Typography>
						<Typography>{marker.coords.join(", ")}</Typography>
					</Box>
				))}
			</Box>
			<Divider sx={{ my: 2 }} />
			<Button
				fullWidth
				variant="contained"
				disabled={loading}
				onClick={() => createNewMarker(userLocation)}
			>
				Add Current Location
			</Button>
		</CardContent>
	</Card>
);

type HeaderCardProps = {
	onMarkerClick: () => void;
};

const HeaderCard = ({ onMarkerClick }: HeaderCardProps) => (
	<Card sx={{ margin: 2, zIndex: 100, }}>
		<CardContent
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<Typography variant="h5" component="div">
				PinPoint
			</Typography>
			<Button variant="outlined" onClick={onMarkerClick}>
				Markers
			</Button>
		</CardContent>
	</Card>
);

const getCityFromCoords = async (lat: number, lng: number) => {
	const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
	const res = await fetch(
		`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
	);
	const data = await res.json();
	return data.results[0]?.components?.city;
};

function App() {
	const [coordinates, setCoordinates] = useState<[number, number]>([
		37.7749, -122.4194,
	]);
	const [userLocation, setUserLocation] = useState<[number, number]>([0, 0]);
	const [loading, setLoading] = useState<boolean>(false);
	const [zoomLevel, setZoomLevel] = useState(7);
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

		navigator.geolocation.getCurrentPosition((position) => {
			const { latitude, longitude } = position.coords;
			// Round to 4 decimal places
			const roundedLat = parseFloat(latitude.toFixed(4));
			const roundedLng = parseFloat(longitude.toFixed(4));

			setUserLocation([roundedLat, roundedLng]);
		});

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
		setCoordinates(coords); // pan view to coords
		setZoomLevel(10); // zoom in when panning
		setShowMarkers(false); // close markers meny after clicking
	};

	const createNewMarker = async (coords: [number, number]) => {
		setLoading(true);
		const cityName = await getCityFromCoords(coords[0], coords[1]);
		const newMarker: MarkerData = {
			id: markers.length,
			coords,
			name: cityName,
		};

		// adds 2 second delay
		setTimeout(() => {
			setMarkers((prev) => [...prev, newMarker]);
			setLoading(false);
		}, 2000);
	};

	return (
		<>
			<HeaderCard onMarkerClick={handleMarkerClick} />
			{showMarkers && (
				<MarkerCard
					loading={loading}
					markers={markers}
					userLocation={userLocation}
					onPanToMarker={handlePanToMarker}
					createNewMarker={createNewMarker}
				/>
			)}
			<div id="map" style={{ height: "500px", width: "100%" }}></div>
		</>
	);
}

export default App;
