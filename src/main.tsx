import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline /> 
			<App />
		</ThemeProvider>
	</StrictMode>
);
