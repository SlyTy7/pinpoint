import { Card, CardContent, Typography, Button } from "@mui/material";

type HeaderCardProps = {
  onMarkerClick: () => void;
};

const HeaderCard = ({ onMarkerClick }: HeaderCardProps) => (
  <Card sx={{ zIndex: 100, margin: 2 }}>
    <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h5" component="div">
        PinPoint
      </Typography>
      <Button variant="outlined" onClick={onMarkerClick}>
        Markers
      </Button>
    </CardContent>
  </Card>
);

export default HeaderCard;
