import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    Typography,
  } from "@mui/material";
  
  type MarkerData = {
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
    <Card sx={{ maxWidth: 400, position: "absolute", top: 80, left: 20, zIndex: 1000 }}>
      <CardHeader title="Markers" />
      <CardContent>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
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
  
  export default MarkerCard;
  