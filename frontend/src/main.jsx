import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, CssVarsProvider, Box } from '@mui/joy';
import '@fontsource/inter';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { SnackProvider } from './contexts/SnackContext.jsx';

import App from './App.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { NavProvider } from './contexts/NavContext.jsx';

function Main() {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setViewportHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box
            sx={{
                height: viewportHeight,
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <DataProvider>
                <AuthProvider>
                    <SnackProvider>
                        <NavProvider>
                            <App />
                        </NavProvider>
                    </SnackProvider>
                </AuthProvider>
            </DataProvider>
        </Box>
    );
}

createRoot(document.getElementById('root')).render(
	<CssVarsProvider>
		<CssBaseline />
		<Router>
			<Main />
		</Router>
	</CssVarsProvider>
);
