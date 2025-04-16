// Fonts and styles (should always come first)
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./styles/index.css";

// Firebase side-effect init (before React tree)
import "./firebase/init";

// Theme and core setup
import darkTheme from "./theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext.tsx";

// Your app
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline /> 
			<AuthProvider>
				<App />
			</AuthProvider>
		</ThemeProvider>
	</StrictMode>
);
