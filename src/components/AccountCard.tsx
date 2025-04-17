import { Paper, Typography, Box, Button } from "@mui/material";

type AccountCardProps = {
	isLoading: boolean;
	isLoggedIn: boolean;
	onLogin: (providerType: string) => void;
	onLogout: () => void;
};

const AccountCard = ({ isLoading, isLoggedIn, onLogin, onLogout }: AccountCardProps) => (
	<Box
		sx={{
			maxWidth: "600px",
			width: "100%",
			position: "absolute",
			top: 64,
			right: 0,
			m: 2,
			zIndex: 100,
		}}
	>
		<Paper sx={{ width: "100%", p: 2 }}>
			<Typography sx={{ flex: "1 1 100%", p: 2 }} variant="h5" id="tableTitle">
				{isLoggedIn ? "Your Account" : "Log In"}
			</Typography>

			<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
				{isLoggedIn ? (
					<Button variant="outlined" onClick={onLogout} disabled={isLoading}>
						Log Out
					</Button>
				) : (
					<Button variant="contained" onClick={() => onLogin("Google")} disabled={isLoading}>
						Log In
					</Button>
				)}
			</Box>
		</Paper>
	</Box>
);

export default AccountCard;
