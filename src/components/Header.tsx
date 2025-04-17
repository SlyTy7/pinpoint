import {
	AppBar,
	Toolbar,
	Typography,
	Button,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPinOutlined";

type HeaderProps = {
	isLoggedIn: boolean;
	isLoading: boolean;
	onMarkerClick: () => void;
	onLoginClick: () => void;
	onLogoutClick: () => void;
};

const Header = ({
	isLoggedIn,
	isLoading,
	onMarkerClick,
	onLoginClick,
	onLogoutClick,
}: HeaderProps) => (
	<AppBar elevation={2} position="static">
		<Toolbar>
			<PushPinIcon color="primary" />
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
				Pinpoint
			</Typography>
			{isLoggedIn && (
				<Button
					disabled={isLoading}
					variant="contained"
					sx={{ mr: 2 }}
					onClick={onMarkerClick}
				>
					Markers
				</Button>
			)}
			{isLoggedIn ? (
				<Button
					disabled={isLoading}
					variant="outlined"
					onClick={onLogoutClick}
				>
					Sign Out
				</Button>
			) : (
				<Button
					disabled={isLoading}
					variant="outlined"
					onClick={onLoginClick}
				>
					Sign In
				</Button>
			)}
		</Toolbar>
	</AppBar>
);

export default Header;
