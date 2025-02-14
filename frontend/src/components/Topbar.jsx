import React from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel, Sheet, IconButton } from "@mui/joy";

import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';
import { useNav } from '../contexts/NavContext';

export default function(){
    const auth = useAuth();
    const navbar = useNav();

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
                <IconButton onClick={navbar.show}>
                    <MenuIcon/>
                </IconButton>

                <Typography level="h4">SMV Kassensystem</Typography>
                <Typography>@Nico Stickel</Typography>
            </Box>

            {/*right side*/}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 1 }}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    {/*<Typography>Eingeloggt als</Typography>*/}
                    {auth?.user?.name && (<Typography level="body-md" textAlign="right">{auth.user.name}</Typography>)}
                </Box>

                <Button variant="soft" color="primary" size="sm" onClick={auth.logout}>
                    Abmelden
                </Button>
            </Box>
        </Sheet>
    )
}