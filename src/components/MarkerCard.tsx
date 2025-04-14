import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import MarkerTable from "./MarkerTable"; // Import the new MarkerTable component

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
};

const MarkerCard = ({
  loading,
  markers,
  userLocation,
  onPanToMarker,
  createNewMarker,
}: MarkerCardProps) => (
  <Card sx={{ maxWidth: "100%", position: "absolute", top: 64, left: 0, right: 0, m: 2, p: 1, zIndex: 100 }}>
    <CardHeader title="Markers" />
    <CardContent>
      <MarkerTable markers={markers} onPanToMarker={onPanToMarker} /> {/* Use MarkerTable here */}
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

export default MarkerCard;
