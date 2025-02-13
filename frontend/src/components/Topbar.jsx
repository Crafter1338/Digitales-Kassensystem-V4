import React from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel, Sheet, IconButton } from "@mui/joy";

import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';

export default function(){
    const auth = useAuth();

    return (
        <Sheet
            sx={{
                width: 'auto',
                p: 2,
                display: 'flex',

                justifyContent: 'space-between',
                alignItems: 'center',
                
                borderBottomLeftRadius:8,
                borderBottomRightRadius:8,
                boxShadow: 'md',
            }}
        >
            {/*left side*/}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <IconButton>
                    <MenuIcon/>
                </IconButton>

                <Typography level="h4">SMV Kassensystem</Typography>
                <Typography>@Nico Stickel</Typography>
                <Typography>#RGPSMV</Typography>
            </Box>

            {/*right side*/}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 1 }}>
                {auth.user.name && (<Typography level="body-md">{auth.user.name}</Typography>)}

                <Button variant="soft" color="primary" size="sm" onClick={auth.logout}>
                    Abmelden
                </Button>
            </Box>
        </Sheet>
    )
}