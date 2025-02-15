import React, { useEffect, useState } from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel, Sheet, IconButton, Drawer, ModalClose, Divider, CardActions, Table, Stack, ListItem } from "@mui/joy";
import { useNav } from '../contexts/NavContext';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

function formatted_date() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ":" +
           d.getMinutes().toString().padStart(2, '0')
}

function StatusModal({ open }) {
    return (
        <Modal>

        </Modal>
    );
}

export default function({ open, type }) {
    const theme = useTheme();
    const navbar = useNav();
    const auth = useAuth();

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    const [time, setTime] = useState(formatted_date(Date.now()))
    const [drawerSize, setDrawerSize] = useState('sm')

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(formatted_date(Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setDrawerSize('sm')
        if (isSm) {
            setDrawerSize('lg');
        }
    }, [])

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
                    <IconButton size='sm' onClick={navbar.hide}><CloseIcon/></IconButton>
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
                }}>
                    Dashboard
                </Button>

                <Divider />

                <Button variant='soft' color='neutral' sx={{ // ALLE
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Geräte
                </Button>

                <Button variant='soft' color='neutral' sx={{ // ALLE
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Hilferufe
                </Button>

                {type && type > 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Accounts
                </Button>}

                {type && type >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Identitäten
                </Button>}

                {type && type >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Inventar
                </Button>}

                {type && type >= 10 && <Button variant='soft' color='neutral' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Schichteditor
                </Button>}

                {type && type >= 10 && <Divider />}

                {type && type >= 10 && <Button variant='soft' color='danger' sx={{ // mind. 10
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    width: 1,
                }}>
                    Transaktionen
                </Button>}

                {type && type >= 12 && <Button variant='soft' color='danger' sx={{ // mind. 12
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
                        <Typography level='title-md'>{auth.user?.name}</Typography>
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
                                    <td>{auth.user?.identity || '-'}</td>
                                    <td>{auth.user?.authority}</td>
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
                            <Button sx={{width:1}} variant='soft'>Hilfe rufen</Button>
                            <Button sx={{width:1}} variant='soft'>Status ändern</Button>
                        </Box>

                        <Button sx={{width:1}} variant='soft' color='success'>Mein Schichtplan</Button>
                    </CardActions>
                </Card>
            </Box>
        </Drawer>
    );
}