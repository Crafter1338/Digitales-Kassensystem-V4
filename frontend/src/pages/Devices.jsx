import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, CardActions, CardContent, Checkbox, Grid, IconButton, Input, Modal, ModalDialog, Option, Select, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const modeToText = {
    0:'Aktivator',
    1:'Deaktivator',
    2:'Schreiber',
    3:'Leser',
    4:'Kasse',
}

const entryToText = {
    0:'Entritt',
    1:'Austritt',
    2:'Wechsel',
    3:'Keiner',
}

function EditModal({ device, isShown, setIsShown }) {
    const [data, setData] = useState({});
    const authenticate = useAuthenticate();
    const http = useHttp();

    const handleAction = () => {
        http('post', `/api/devices/update_one/${device.deviceID}`, data);
        hide();
    }

    const initializeData = () => {
        setData({
            name: device.name || '',
            description: device.description || '',

            mode: device.mode || 0,
            entryDetection: device.entryDetection || 0,
        })
    }

    useEffect(() => {
        if (isShown) {
            initializeData();
            authenticate();
        }
    }, [isShown])

    const hide = () => setIsShown(false)

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog>
                <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Name:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.name} 
                            onChange={(e) => setData(prev => ({...prev, name: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Beschreibung:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.description} 
                            onChange={(e) => setData(prev => ({...prev, description: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Modus:</Typography>
                        <Select
                            value={data.mode}
                            onChange={(e, newValue) => setData((prev) => ({ ...prev, mode: newValue }))}
                            sx={{ flex: 1, p:0, m:0, ml:1, pl:1 }}
                        >
                            {Object.entries(modeToText).map(([key, label]) => (
                                <Option key={key} value={Number(key)}>
                                    {label}
                                </Option>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Eintritts Erkennung:</Typography>
                        <Select
                            value={data.entryDetection}
                            onChange={(e, newValue) => setData((prev) => ({ ...prev, entryDetection: newValue }))}
                            sx={{ flex: 1, p:0, m:0, ml:1, pl:1 }}
                        >
                            {Object.entries(entryToText).map(([key, label]) => (
                                <Option key={key} value={Number(key)}>
                                    {label}
                                </Option>
                            ))}
                        </Select>
                    </Box>
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap: 1 }}>
                    <Button onClick={handleAction} sx={{flex: 1}} variant='soft'>Speichern</Button>
                    <Button onClick={hide} sx={{flex: 1}} variant='soft' color='danger'>Abbrechen</Button>
                </Box>
            </ModalDialog>
        </Modal>
    )
}

function DeviceBox({ device, setShowEdit, setEditID }) {
    const user = useUser();
    const navigate = useNavigate();

    return (
        <Card sx={{
            width:1,
            maxWidth:280
        }}>
            <Box>
                <Typography level='h4'>{(!device.name? 'Gerät: ':'') + device.deviceID} {device.name && ': ' + device.name}</Typography>
                {device.description && <Typography>{device.description}</Typography>}
            </Box>

            {user.current.authority > 10 && <CardContent>
                <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                    <Typography sx={{ flex: 1 }} level='body-sm'>Karten ID:</Typography>
                    <Typography sx={{ flex: 1 }} level='body-sm'>{device.scanCardID || '-'}</Typography>   
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                    <Typography sx={{ flex: 1 }} level='body-sm'>Modus:</Typography>
                    <Typography sx={{ flex: 1 }} level='body-sm'>{modeToText[device.mode] || 'FEHLER'}</Typography>   
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                    <Typography sx={{ flex: 1 }} level='body-sm'> Eint. Erkennung:</Typography>
                    <Typography sx={{ flex: 1 }} level='body-sm'>{entryToText[device.entryDetection] || 'FEHLER'}</Typography>   
                </Box>
            </CardContent>}

            <CardActions>
                <Button fullWidth variant='soft' onClick={() => navigate(`/device/${device.deviceID}`)}>Öffnen</Button>
                {user.current.authority > 10 && <Button fullWidth variant='soft' onClick={() => {setEditID(device.deviceID); setShowEdit(true)}}>Ändern</Button>}
            </CardActions>
        </Card>
    );
}

export default function () {
    const [showEdit, setShowEdit] = useState(false);
    const [editID, setEditID] = useState('');

    const message = useMessage();
    const serverData = useServerData();
    const http = useHttp();
    const viewport = useViewport();
    const authenticate = useAuthenticate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 1,
                width: 1,
                overflow: 'hidden',
            }}
        >
            <Topbar />

            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    width: 1,
                    margin: '0 auto',

                    gap:2,
                }}
            >
                {serverData.devices?.map((device, id) => {
                    return (<DeviceBox device={device} key={id} setShowEdit={setShowEdit} setEditID={setEditID}></DeviceBox>);
                })}
            </Box>

            <EditModal isShown={showEdit} setIsShown={setShowEdit} device={serverData.devices.find(device => device.deviceID == editID)}>
                
            </EditModal>
        </Box>
    );
}
