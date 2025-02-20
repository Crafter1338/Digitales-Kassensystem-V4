import { Navigate, Route, Routes } from "react-router-dom";
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from './Hooks'

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Iventory from './pages/Inventory'
import Identities from "./pages/Identities";
import Devices from "./pages/Devices";
import DevicePage from "./pages/DevicePage";

import { useColorScheme } from "@mui/joy";
import { useEffect } from "react";

export default function() {
    const { mode, setMode } = useColorScheme();
    const auth = useAuthenticate();

    useEffect(() => {
        setMode('system');
        auth();
    }, []);

    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/devices"
                element={<Devices />}
            />

            <Route
                path="/device/:deviceID"
                element={<DevicePage />}
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
                path="/inventory"
                element={<Iventory />}
            />

            <Route
                path="/identities"
                element={<Identities />}
            />


            <Route
                path="/"
                element={<Navigate to="/dashboard" replace/>}
            />
        </Routes>
    );
}