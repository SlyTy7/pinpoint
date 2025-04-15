import React from "react";
import {
	alpha,
	Box,
	Checkbox,
	IconButton,
	Button,
	Paper,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import { MarkerData } from "./MarkerCard";

type Order = "asc" | "desc";

type MarkerTableProps = {
	markers: MarkerData[];
	loading: boolean;
	userLocation: [number, number];
	onPanToMarker: (coords: [number, number]) => void;
	onDeleteMarkers: (ids: number[]) => void;
	createNewMarker: (coords: [number, number]) => void;
};

type HeadCell = {
	id: keyof MarkerData | "coords";
	label: string;
	numeric?: boolean;
};

const headCells: readonly HeadCell[] = [
	{ id: "name", numeric: false, label: "City" },
	{ id: "coords", numeric: false, label: "Coordinates" },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T | "coords") {
	if (orderBy === "coords") {
		const aCoord = (a as any).coords.join(", ");
		const bCoord = (b as any).coords.join(", ");
		return bCoord.localeCompare(aCoord);
	}
	return (b[orderBy] as any)
		.toString()
		.localeCompare((a[orderBy] as any).toString());
}

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props: {
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	numSelected: number;
	rowCount: number;
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof MarkerData | "coords"
	) => void;
}) {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler =
		(property: keyof MarkerData | "coords") =>
		(event: React.MouseEvent<unknown>) =>
			onRequestSort(event, property);

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={
							numSelected > 0 && numSelected < rowCount
						}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all markers" }}
					/>
				</TableCell>
				{headCells.map((headCell, index) => (
					<TableCell
						key={headCell.id}
						align={index === headCells.length - 1 ? "right" : "left"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

function EnhancedTableToolbar(props: {
	numSelected: number;
	onDelete: () => void;
}) {
	const { numSelected, onDelete } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography
					sx={{ flex: "1 1 100%" }}
					color="inherit"
					variant="subtitle1"
				>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					sx={{ flex: "1 1 100%" }}
					variant="h6"
					id="tableTitle"
				>
					Your Markers
				</Typography>
			)}

			{numSelected > 0 && (
				<Tooltip title="Delete">
					<IconButton onClick={onDelete}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
}

export default function MarkerTable({
	markers,
	loading,
	userLocation,
	onPanToMarker,
	onDeleteMarkers,
	createNewMarker,
}: MarkerTableProps) {
	const [order, setOrder] = React.useState<Order>("asc");
	const [orderBy, setOrderBy] = React.useState<keyof MarkerData | "coords">(
		"id"
	);
	const [selected, setSelected] = React.useState<number[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof MarkerData | "coords"
	) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.checked) {
			const newSelected = markers.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (
		event: React.MouseEvent<unknown>,
		id: number,
		coords: [number, number]
	) => {
		onPanToMarker(coords);
		const selectedIndex = selected.indexOf(id);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = [...selected, id];
		} else {
			newSelected = selected.filter((item) => item !== id);
		}

		setSelected(newSelected);
	};

	const handleDelete = () => {
		onDeleteMarkers(selected);
		setSelected([]);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const sortedMarkers = React.useMemo(
		() => markers.slice().sort(getComparator(order, orderBy)),
		[markers, order, orderBy]
	);

	const visibleRows = sortedMarkers.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	const isSelected = (id: number) => selected.indexOf(id) !== -1;

	return (
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
				<EnhancedTableToolbar
					numSelected={selected.length}
					onDelete={handleDelete}
				/>
				<TableContainer sx={{ pb: 4 }}>
					<Table aria-labelledby="tableTitle" size="medium">
						<EnhancedTableHead
							numSelected={selected.length}
							onSelectAllClick={handleSelectAllClick}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={markers.length}
						/>
						<TableBody>
							{visibleRows.map((row) => {
								const isItemSelected = isSelected(row.id);
								return (
									<TableRow
										hover
										onClick={(event) =>
											handleClick(
												event,
												row.id,
												row.coords
											)
										}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										selected={isItemSelected}
										sx={{ cursor: "pointer" }}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												checked={isItemSelected}
											/>
										</TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell sx={{ textAlign: "right"}}>
											{row.coords.join(", ")}
										</TableCell>
									</TableRow>
								);
							})}
							{visibleRows.length < rowsPerPage && (
								<TableRow
									style={{
										height:
											53 *
											(rowsPerPage - visibleRows.length),
									}}
								>
									<TableCell colSpan={4} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<Grid
					container
					spacing={0}
					sx={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Grid size={6}>
						<Button
							variant="contained"
							disabled={loading}
							onClick={() => createNewMarker(userLocation)}
						>
							Add Current Location
						</Button>
					</Grid>
					<Grid size={6}>
						<TablePagination
							rowsPerPageOptions={[5]}
							component="div"
							count={markers.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Grid>
				</Grid>
			</Paper>
		</Box>
	);
}
