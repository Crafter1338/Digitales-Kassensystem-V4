import React, { useEffect } from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel } from "@mui/joy";
import Topbar from '../components/Topbar';
import useHttp from '../hooks/useHttp';
import { useNavigate } from 'react-router-dom';

export default function() {
    const http = useHttp();
    const navigate = useNavigate();

    useEffect(() => {
        http('post', '/action/validate', {token: localStorage.getItem('token')}).catch(() => {
            navigate('/login')
        })
    }, [])

    return (
        <Box
            sx={{
                height:'100vh',
                width:'100vw',
            }}
        >
            <Topbar></Topbar>
        </Box>
    )
}