import { Box, Divider, Stack, Typography } from "@mui/material";
import { MarkerData } from "./MarkerCard";

type MarkerTableProps = {
  markers: MarkerData[];
  onPanToMarker: (coords: [number, number]) => void;
};

const MarkerTable = ({ markers, onPanToMarker }: MarkerTableProps) => (
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
);

export default MarkerTable;
