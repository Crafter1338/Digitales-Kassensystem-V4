import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { CssBaseline, CssVarsProvider } from '@mui/joy';
import '@fontsource/inter';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { SnackProvider } from './contexts/SnackContext.jsx';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<>
		<CssVarsProvider>
			<CssBaseline />
			<Router>
				<AuthProvider>
					<SnackProvider>
						<App />
					</SnackProvider>
				</AuthProvider>
			</Router>
		</CssVarsProvider>
	</>,
);
