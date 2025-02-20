import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';

export default function () {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 1,
            width:1,
            overflow: 'hidden',
        }}>
            <Topbar />
        
        </Box>
    );
}