import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

type HeaderProps = {
	onMarkerClick: () => void;
	onAccountButtonClick: () => void;
};

const Header = (
	{ onMarkerClick, onAccountButtonClick }: HeaderProps
) => (
	<AppBar position="static">
		<Toolbar>
			<PushPinIcon />
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
				Pinpoint
			</Typography>
			<Button variant="contained" sx={{ mr: 2 }} onClick={onMarkerClick}>
				Markers
			</Button>
			<Button variant="outlined" onClick={onAccountButtonClick}>
				Login
			</Button>
		</Toolbar>
	</AppBar>
);

export default Header;
