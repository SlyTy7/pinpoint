import { useState, useMemo, MouseEvent, ChangeEvent } from "react";
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

type MarkerData = {
	id: string;
	coords: [number, number];
	name: string;
};

type Order = "asc" | "desc";

type MarkerTableProps = {
	markers: MarkerData[];
	isLoading: boolean;
	userLocation: [number, number];
	onPanToMarker: (coords: [number, number]) => void;
	onDeleteMarkers: (ids: string[]) => void;
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

	const aValue = a[orderBy];
	const bValue = b[orderBy];

	if (typeof aValue === "number" && typeof bValue === "number") {
		return bValue - aValue;
	}

	if (typeof aValue === "string" && typeof bValue === "string") {
		return bValue.localeCompare(aValue);
	}

	return 0; // fallback if types don't match or are unsupported
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
	order: Order;
	orderBy: string;
	numSelected: number;
	rowCount: number;
	onRequestSort: (
		event: MouseEvent<unknown>,
		property: keyof MarkerData | "coords"
	) => void;
}) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler =
		(property: keyof MarkerData | "coords") =>
		(event: MouseEvent<unknown>) =>
			onRequestSort(event, property);

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox"></TableCell>
				{headCells.map((headCell, index) => (
					<TableCell
						key={headCell.id}
						align={
							index === headCells.length - 1 ? "right" : "left"
						}
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
					variant="h5"
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

function MarkerCard({
	markers,
	isLoading,
	userLocation,
	onPanToMarker,
	onDeleteMarkers,
	createNewMarker,
}: MarkerTableProps) {
	const [order, setOrder] = useState<Order>("asc");
	const [orderBy, setOrderBy] = useState<keyof MarkerData | "coords">("id");
	const [selected, setSelected] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleRequestSort = (
		_event: MouseEvent<unknown>,
		property: keyof MarkerData | "coords"
	) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleClick = (
		_event: MouseEvent<unknown>,
		id: string,
		coords: [number, number]
	) => {
		onPanToMarker(coords);
		const selectedIndex = selected.indexOf(id);
		let newSelected: string[] = [];

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

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const sortedMarkers = useMemo(
		() => markers.slice().sort(getComparator(order, orderBy)),
		[markers, order, orderBy]
	);

	const visibleRows = sortedMarkers.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	const isSelected = (id: string) => selected.includes(id);

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
										<TableCell
											padding="checkbox"
											onClick={(e) => e.stopPropagation()}
										>
											<Checkbox
												color="primary"
												checked={isItemSelected}
												onChange={() => {
													const selectedIndex =
														selected.indexOf(
															row.id
														);
													let newSelected: string[] =
														[];

													if (selectedIndex === -1) {
														newSelected = [
															...selected,
															row.id,
														];
													} else {
														newSelected =
															selected.filter(
																(item) =>
																	item !==
																	row.id
															);
													}

													setSelected(newSelected);
												}}
											/>
										</TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell sx={{ textAlign: "right" }}>
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
							disabled={isLoading}
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

export default MarkerCard;
