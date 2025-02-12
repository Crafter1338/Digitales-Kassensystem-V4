import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { CssBaseline } from '@mui/joy';
import '@fontsource/inter';

import { AuthProvider } from './hooks/AuthContext';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
	<>
		<CssBaseline />
		<Router>
			<AuthProvider>
				<App />
			</AuthProvider>
		</Router>
	</>,
);
