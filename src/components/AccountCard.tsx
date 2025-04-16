import { Paper, Typography, Box } from "@mui/material";

type AccountCardProps = {
	loading: boolean;
};

const AccountCard = ({ loading }: AccountCardProps) => (
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
				sx={{ flex: "1 1 100%" }}
				variant="h5"
				id="tableTitle"
			>
				Your Account
			</Typography>
		</Paper>
	</Box>
);

export default AccountCard;
