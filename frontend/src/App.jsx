import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useColorScheme } from '@mui/joy/styles';

import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard'

import useHttp from './hooks/useHttp';
import useValidate from './hooks/useValidate';

export default function App() {
    const navigate = useNavigate();
    const auth = useAuth();
    const http = useHttp();
    const validate = useValidate();

    const { mode, setMode } = useColorScheme();
    useEffect(() => {
        setMode('system')
    }, [])

    useEffect(() => {
        validate();
    }, [])

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={auth.user? <Dashboard />:<Navigate to="/login" replace />} />

            <Route path="/" element={auth.user? <Navigate to="/dashboard" replace />:<Navigate to="/login" replace />} />
            <Route path="*" element={auth.user? <Navigate to="/dashboard" replace />:<Navigate to="/login" replace />} />
        </Routes>
    );
}