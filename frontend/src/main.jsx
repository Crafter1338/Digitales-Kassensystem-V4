import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

import ContextManager from "./contexts/Contexts";
import App from './App'
import { StrictMode } from "react";

createRoot(document.getElementById('root')).render(
	<CssVarsProvider>
		<CssBaseline />
		<Router>
			<ContextManager>
				<App />
			</ContextManager>
		</Router>
	</CssVarsProvider>
);