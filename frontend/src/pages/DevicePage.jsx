import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, CardActions, CardContent, Checkbox, Grid, IconButton, Input, Modal, ModalDialog, Option, Select, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import APIEndpoint from '../API';


function ActivatorDeactivator({ device }) {
    const serverData = useServerData();
    const [cardID, setCardID] = useState(null);

    useEffect(() => {
        const handleScanEvent = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.deviceID == device.deviceID) {
                    setCardID(data.cardID);
                }
            } catch {}
        }
        serverData.eventSource.addEventListener("scan-uid", handleScanEvent)

        return () => {
            serverData.eventSource.removeEventListener("scan-uid", handleScanEvent);
        };
    }, [])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,

            mx: 2,
            my:2,

            overflow: 'hidden',
        }}>
            {cardID && <Card sx={{
                my: 'auto',
                mx: 'auto',
                p:2,

                width: 1,

                maxWidth: 250,

                borderRadius: 'md',

                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
            }}>
                {device?.name && <Typography sx={{ textAlign:'center' }} level='h4'>{device?.name}:</Typography>}
                <Typography level='h4' color={device?.mode == 0 && 'success' || device?.mode == 1 && 'danger'} sx={{ textAlign:'center' }}>{cardID}</Typography>
            </Card>}
        </Box>
    );
}

export default function () {
    const { deviceID } = useParams();

    const message = useMessage();
    const serverData = useServerData();
    const http = useHttp();
    const viewport = useViewport();
    const authenticate = useAuthenticate();

    const [device, setDevice] = useState();

    useEffect(() => {
        const currentDevice = serverData.devices.find(device => device.deviceID == deviceID);
        setDevice(currentDevice);
    }, [deviceID, serverData.devices]);

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 1,
                width: 1,
            }}
        >
            <Topbar />

            {(device?.mode == 0 || device?.mode == 1) && <ActivatorDeactivator device={device} />}
        </Box>
    );
}