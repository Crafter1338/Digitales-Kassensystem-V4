import React from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel } from "@mui/joy";
import Topbar from '../components/Topbar';

export default function() {
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