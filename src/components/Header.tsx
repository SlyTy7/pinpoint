import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

type HeaderProps = {
	isLoggedIn: boolean;
	onMarkerClick: () => void;
	onLoginClick: () => void;
	onLogoutClick: () => void;
};

const Header = ({
	isLoggedIn,
	onMarkerClick,
	onLoginClick,
	onLogoutClick,
}: HeaderProps) => (
	<AppBar elevation={2} position="static">
		<Toolbar>
			<PushPinIcon />
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
				Pinpoint
			</Typography>
			{isLoggedIn && (
				<Button
					variant="contained"
					sx={{ mr: 2 }}
					onClick={onMarkerClick}
				>
					Markers
				</Button>
			)}
			{isLoggedIn ? (
				<Button variant="outlined" onClick={onLogoutClick}>
					Sign Out
				</Button>
			) : (
				<Button variant="outlined" onClick={onLoginClick}>
					Sign In
				</Button>
			)}
		</Toolbar>
	</AppBar>
);

export default Header;
