import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import useHttp from './hooks/useHttp';

export default function App() {
    const navigate = useNavigate();
    const auth = useAuth();
    const http = useHttp();

    useEffect(() => {
        if (!auth.user) {
            if (localStorage.getItem('token')) {
                http('post', '/action/validate', {token: localStorage.getItem('token')}).then((response) => {
                    auth.setUser({name: response.data.username})
                    navigate('/dashboard');
                }).catch(() => {
                    auth.logout();
                    navigate('/login');
                })
            } else {
                navigate('/login');
            }
        }
    }, [])

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}