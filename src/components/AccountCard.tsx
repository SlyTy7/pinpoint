import { Paper, Typography, Box } from "@mui/material";

type AccountCardProps = {
	isLoading: boolean;
	isLoggedIn: boolean;
};

const AccountCard = ({ isLoading, isLoggedIn }: AccountCardProps) => (
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
			<Typography
				sx={{ flex: "1 1 100%", p: 2 }}
				variant="h5"
				id="tableTitle"
			>
				{isLoggedIn ? "Your Account" : "Log In"}
			</Typography>
		</Paper>
	</Box>
);

export default AccountCard;
