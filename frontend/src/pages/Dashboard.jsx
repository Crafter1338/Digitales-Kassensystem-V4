import React, { useEffect } from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel } from "@mui/joy";
import Topbar from '../components/Topbar';

import { useNavigate } from 'react-router-dom';

import useHttp from '../hooks/useHttp';
import useValidate from '../hooks/useValidate';

export default function() {
    const http = useHttp();
    const navigate = useNavigate();
    const validate = useValidate();

    useEffect(() => {
        validate();
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