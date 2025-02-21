import { createContext, useContext, useState, useEffect } from "react";
import { useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Drawer, Box, Typography, Card, IconButton, Divider, Button, Table, CardActions, Modal, ModalDialog, Input, Textarea } from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext(null);

function formatted_date() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ":" +
           d.getMinutes().toString().padStart(2, '0')
}

function HelpModal ({ isShown, setIsShown }) {
    const hide = () => setIsShown(false);
    const [message, setMessage] = useState('')

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog sx={{ display:'flex', flexDirection:'column' }}>
                <Typography level="h4">Hilferuf:</Typography>
                
                <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                    <Typography sx={{ flex:1 }}>Nachricht:</Typography>
                    <Textarea sx={{ flex: 1, p:0, m:0, ml:1, pl:1, minHeight:100 }} value={message} onChange={(e) => setMessage(e.target.value)}/>
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                    <Button fullWidth variant="soft">Absenden</Button>
                    <Button fullWidth variant="soft" color="danger" onClick={hide}>Abbrechen</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

function Sidebar({ open }) {
    const viewport = useViewport();
    const user = useUser();

    const [showHelpModal, setShowHelpModal] = useState(false);

    const [time, setTime] = useState(formatted_date(Date.now()))
    const [drawerSize, setDrawerSize] = useState('sm')
    const navigate = useNavigate();
    const sidebar = useSidebar();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatted_date(Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setDrawerSize('sm')

        console.log(viewport);

        if (viewport.isMd) {
            setDrawerSize('md')
        }

        if (viewport.isSm) {
            setDrawerSize('lg');
        }
    }, [])

    const handleNavigate = (location) => {
        sidebar.hide();
        navigate(location)
    }

    return (
        <Drawer open={open} size={drawerSize}>
            <Box sx={{
                m:2,

                display:'flex',
                flexDirection:'column',
                gap:2,
            }}>
                <Box sx={{display:'inline-flex', flexDirection:'row', alignContent:'center'}}>
                    <Typography level='h4' sx={{width:1}}>Navigation</Typography>
                    <IconButton size='sm' onClick={sidebar.hide}><CloseIcon/></IconButton>
                </Box>

                <Divider/>
            </Box>

            <Box sx={{
                mx:2,
                height:1,

                overflowY:'scroll',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },

                display:'flex',
                flexDirection:'column',
                gap:2,
            }}>

                <Button variant='soft' color='primary' sx={{ // ALLE
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }} onClick={() => handleNavigate('dashboard')}>
                    Dashboard
                </Button>

                <Divider />

                <Button variant='soft' color='neutral' sx={{ // ALLE
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }} onClick={() => handleNavigate('devices')}>
                    Geräte
                </Button>

                <Button variant='soft' color='neutral' sx={{ // ALLE
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Hilferufe
                </Button>

                {user.current?.authority && user.current.authority > 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }} onClick={() => handleNavigate('accounts')}>
                    Accounts
                </Button>}

                {user.current?.authority && user.current.authority >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }} onClick={() => handleNavigate('identities')}>
                    Identitäten
                </Button>}

                {user.current?.authority && user.current.authority >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }} onClick={() => handleNavigate('inventory')}>
                    Inventar
                </Button>}

                {user.current?.authority && user.current.authority >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Schichteditor
                </Button>}

                {user.current?.authority && user.current.authority >= 10 && <Divider />}

                {user.current?.authority && user.current.authority >= 10 && <Button variant='soft' color='danger' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Transaktionen
                </Button>}

                {user.current?.authority && user.current.authority >= 12 && <Button variant='soft' color='danger' sx={{ // mind. 12
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Systemlogs
                </Button>}
            </Box>  
            <Box sx={{m:2}}>
                <Card>
                    <Box>
                        <Box sx={{display:'flex', flexDirection:'row'}}>
                            <Typography level='title-lg' sx={{width:1}}>Account:</Typography>
                            <Typography level='title-lg' sx={{textAlign:'right', width:1}}>{time} Uhr</Typography>
                        </Box>
                        <Typography level='title-md'>{user.current?.name}</Typography>
                    </Box>

                    <Box sx={{display: { sm: 'none', xs: 'none', md: 'none', lg: 'block' }}}>
                        <Table>
                        <thead>
                                <tr>
                                    <th>Identität</th>
                                    <th>Authorität</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>{user.current?.identity || '-'}</td>
                                    <td>{user.current?.authority}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Box>

                    <Box>
                        <Typography level='title-md'>Nächste Schicht</Typography>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Jetzt</th>
                                    <th>18 Uhr</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Kasse</td>
                                    <td>Kasse</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Box>

                    <CardActions sx={{flexDirection:'column'}}>
                        <Box sx={{width:1, display:'flex', flexDirection:'row', gap:2}}>
                            <Button sx={{width:1}} variant='soft' onClick={() => setShowHelpModal(true)}>Hilfe rufen</Button>
                        </Box>

                        <Button sx={{width:1}} variant='soft' color='success'>Mein Schichtplan</Button>
                    </CardActions>
                </Card>
            </Box>
            <HelpModal isShown={showHelpModal} setIsShown={setShowHelpModal}/>
        </Drawer>
    );
}

export function SidebarProvider({ children }) {
    const [open, setOpen] = useState(false);
    
    const show = () => {
        setOpen(true);
    }

    const hide = () => {
        setOpen(false);
    }

    return (
        <SidebarContext.Provider value={{ setOpen, show, hide }}>
            {children}
            <Sidebar open={open}/>
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}