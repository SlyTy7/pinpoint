import { Card, CardContent, CardHeader } from "@mui/material";
import MarkerTable from "./MarkerTable";

export type MarkerData = {
	id: number;
	coords: [number, number];
	name: string;
};

type MarkerCardProps = {
	loading: boolean;
	markers: MarkerData[];
	userLocation: [number, number];
	onPanToMarker: (coords: [number, number]) => void;
	createNewMarker: (coords: [number, number]) => void;
	onDeleteMarkers: (ids: number[]) => void;
};

const MarkerCard = ({
	loading,
	markers,
	userLocation,
	onPanToMarker,
	createNewMarker,
	onDeleteMarkers
}: MarkerCardProps) => (
	<Card
		sx={{
			maxWidth: "768px",
			width: "100%",
			position: "absolute",
			top: 64,
			right: 0,
			m: 2,
			p: 1,
			zIndex: 100,
		}}
	>
		<CardHeader title="Markers" />
		<CardContent>
			<MarkerTable
				markers={markers}
				loading={loading}
				userLocation={userLocation}
				onPanToMarker={onPanToMarker}
				createNewMarker={createNewMarker}
				onDeleteMarkers={onDeleteMarkers}
			/>
		</CardContent>
	</Card>
);

export default MarkerCard;
