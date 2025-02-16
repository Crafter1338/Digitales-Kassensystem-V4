import { Navigate, Route, Routes } from "react-router-dom";
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from './Hooks'

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';

import { useColorScheme } from "@mui/joy";
import { useEffect } from "react";

export default function() {
    const { mode, setMode } = useColorScheme();
    const user = useUser();

    useEffect(() => {
        setMode('system');
    }, []);

    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
            
            <Route
                path="/accounts"
                element={<Accounts />}
            />


            <Route
                path="/"
                element={<Navigate to="/dashboard" replace/>}
            />
            <Route
                path="*"
                element={<Navigate to="/dashboard" replace/>}
            />
        </Routes>
    );
}