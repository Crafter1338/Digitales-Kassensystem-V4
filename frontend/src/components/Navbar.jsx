import React from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel, Sheet, IconButton, Drawer, ModalClose } from "@mui/joy";
import { useNav } from '../contexts/NavContext';

export default function({ open, type }) {
    const navbar = useNav();

    return (    
        <Drawer open={open} onClose={navbar.hide}>
            <ModalClose />
        </Drawer>
    );
}