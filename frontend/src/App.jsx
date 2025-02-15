import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Box } from '@mui/joy';
import { useColorScheme } from '@mui/joy/styles';

import { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts.jsx'

import useHttp from './hooks/useHttp';
import useValidate from './hooks/useValidate';

export default function App() {
    const navigate = useNavigate();
    const auth = useAuth();
    const http = useHttp();
    const validate = useValidate();
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        setMode('system');
    }, []);

    useEffect(() => {
        validate();
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

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
