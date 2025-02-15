import React, { useEffect, useState } from 'react';

import { Box, Card, Typography, Button, Input, FormControl, FormLabel } from "@mui/joy";
import Topbar from '../components/Topbar';

import { useNavigate } from 'react-router-dom';

import useHttp from '../hooks/useHttp';
import useValidate from '../hooks/useValidate';

export default function() {
    const validate = useValidate();

    useEffect(() => {
        validate();
    }, []);

    return (
        <Box
            sx={{
                height: 1,
                width: '100vw',
            }}
        >
            <Topbar />
        </Box>
    );
}
