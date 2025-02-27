import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate, useActionConfirmation } from '../Hooks'
import { Box, Button, Card, CardActions, CardContent, Checkbox, Divider, Grid, IconButton, Input, Modal, ModalDialog, Option, Select, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import APIEndpoint from '../API';


function formatted_date() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ":" +
           d.getMinutes().toString().padStart(2, '0')
}

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

function Reader({ device }) {
    const serverData = useServerData();
    const [cardID, setCardID] = useState(null);
    const [identity, setIdentity] = useState(null);

    const [data, setData] = useState({
        cardID: "",
        wardrobeID: "",
        status: "",
        isOnSite: false,
        currentInventory: [],
    });
    

    const http = useHttp();
    const user = useUser();

    const edit = (data) => {
        const query = JSON.stringify({ _id: identity._id });
        http('post', `/api/identity/update_many/${query}`, data).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });

        setCardID(null); setIdentity(null);
    }

    const handleAction = () => {
        if (data.cardID?.length != 0 && !isNaN(Number(data.cardID))) {
            data.cardID = Number(data.cardID);

            data.wardrobeID = isNaN(Number(data.wardrobeID)) || data.wardrobeID?.length == 0? undefined : Number(data.wardrobeID);
            data.status = data.status?.length == 0? '' : data.status;

            data.currentInventory = data.currentInventory.map(item => {
                return {
                    reference: String(item.reference),
                    quantity: isNaN(Number(item.quantity)) || item.quantity?.length == 0? 0 : Number(item.quantity),
                }
            })

            data.startInventory = data.currentInventory;

            edit(data);
        } else {
            message.write('Keine Karten ID angegeben!', "danger", 1500)
        }
    }

    useEffect(() => {
        if (serverData?.eventSource) {
            const handleScanEvent = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.deviceID == device.deviceID) {
                        setIdentity(serverData.identities.find(identity => identity.cardID == data.cardID));
                        setCardID(data.cardID);
                    }
                } catch {}
            }
            serverData.eventSource.addEventListener("scan-uid", handleScanEvent)
    
            return () => {
                serverData.eventSource.removeEventListener("scan-uid", handleScanEvent);
            };
        }
    }, [serverData.eventSource]);

    useEffect(() => {
        if (identity && cardID) {
            setData({
                cardID: String(cardID),
                wardrobeID: String(identity.wardrobeID || ''),
                status: String(identity.status || ''),

                isOnSite: identity.isOnSite || false,

                currentInventory: serverData.items?.map(serverItem => ({
                    reference: serverItem._id,
                    quantity: String(identity.currentInventory.find(item => item.reference == serverItem._id)?.quantity || 0),
                }))
            });
        } else {
            setData({
                cardID: "",
                wardrobeID: "",
                status: "",
                isOnSite: false,
                currentInventory: [],
            });
        }
    }, [serverData.items, cardID, identity])

    useEffect(() => {
        if (cardID) {
            setIdentity(serverData.identities.find(identity => identity.cardID == cardID));
        }
    }
    , [serverData.identities])

    const hide = () => { setCardID(null); setIdentity(null) }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',

            flex: 1,
        }}>
            {cardID && serverData.identities.find(identity => identity.cardID == cardID) && data &&<Card sx={{
                m:2,
                display:'flex',
                gap:1
            }}>
                <Box>
                    <Typography level='h4' color='success' variant='soft' sx={{ textAlign: 'left' }}>Karte {cardID}:</Typography>
                    {/*<Typography sx={{ textAlign: 'left' }} color='success'>Karte gültig!</Typography>*/}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                    <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Karten ID:</Typography>
                            <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cardID} 
                                onChange={(e) => setData(prev => ({...prev, cardID: e.target.value}) )}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Garderoben ID:</Typography>
                            <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.wardrobeID} 
                                onChange={(e) => setData(prev => ({...prev, wardrobeID: e.target.value}) )}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Status:</Typography>
                            <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.status} 
                                onChange={(e) => setData(prev => ({...prev, status: e.target.value}) )}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Auf Gelände:</Typography>
                            <Checkbox sx={{ flex: 1, p: 0 }} checked={data.isOnSite} 
                                onChange={(e) => setData(prev => ({...prev, isOnSite: e.target.checked}) )}
                            />
                        </Box>
                    </Box>

                    {user?.current?.authority > 10 && <Box sx={{
                            display:'flex',
                            flexDirection:'column', 
                            gap: 1,

                            maxHeight: 400,
                            overflowY: 'auto', 
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            }
                        }}>
                        {data.currentInventory && serverData.items.map((serverItem, i) => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                <Typography sx={{ flex: 1 }}>{serverItem.name}</Typography>
                                <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.currentInventory?.find(item => item.reference == serverItem._id)?.quantity || "0"} 
                                    onChange={(e) => setData(prev => {
                                        const updatedInventory = prev.currentInventory?.filter(item => item.reference !== serverItem._id) || [];
                                        updatedInventory.push({
                                            reference: serverItem._id,
                                            quantity: e.target.value,
                                        });

                                        return {
                                            ...prev,
                                            currentInventory: updatedInventory,
                                        };
                                    })}
                                />
                            </Box>
                        ))}
                    </Box>}
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap: 1, mt:1 }}>
                    {user?.current?.authority > 10 && <Button onClick={handleAction} sx={{flex: 1}} variant='soft'>Änderung annehmen</Button>}
                    <Button onClick={hide} sx={{flex: 1}} variant='soft'>OK</Button>
                </Box>
            </Card>}

            {cardID && !serverData.identities.find(identity => identity.cardID == cardID) && <Card sx={{
                display: 'flex',
                flexDirection: 'column',

                width:1,
                maxWidth:300,

                mx:'auto',
                my:'auto',

                gap: 1,
                p: 2,
            }}>
                <Typography level='h4' color='danger' variant='soft' sx={{ textAlign: 'left' }}>Karte {cardID}:</Typography>
                <Box>
                    <Typography level='body-lg' sx={{ textAlign: 'left' }}>Karte ungültig!</Typography>
                    <Typography level='body-lg' sx={{ textAlign: 'left' }}>Zugang verweigern!</Typography>
                </Box>

                <Button onClick={hide} sx={{flex: 1, mt:1}} variant='soft' color='danger'>OK</Button>
            </Card>}
        </Box>
    );
}

function Writer({ device }) {

}

function Register({ device }) {
    const serverData = useServerData();
    const user = useUser();
    const http = useHttp(); 
    const viewport = useViewport();
    const confirmation = useActionConfirmation();
    const message = useMessage();

    const [currentTimeString, setCurrentTimeString] = useState(formatted_date(Date.now()))

    const [cardID, setCardID] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTimeString(formatted_date(Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const initInventory = (identity) => {
        setInventory(serverData.items.map(serverItem => {
            return {
                reference: serverItem._id,
                quantity: identity.currentInventory.find(item => item.reference == serverItem._id)?.quantity || 0,
            }
        }));
    }

    useEffect(() => {
        if (serverData?.eventSource) {
            const handleScanEvent = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    if (data.deviceID == device.deviceID) {
                        console.log(serverData.identities);
                        setCardID(data.cardID);
                        const identity = serverData.identities.find(identity => identity.cardID == data.cardID) || null;

                        setIdentity(identity);

                        if (identity) {
                            initInventory(identity);
                        }
                    }
                } catch {}
            }
            serverData.eventSource.addEventListener("scan-uid", handleScanEvent)

            return () => {
                serverData.eventSource.removeEventListener("scan-uid", handleScanEvent);
            };
        }
    }, [serverData.eventSource]);

    useEffect(() => {
        const identity = serverData.identities.find(identity => identity.cardID == cardID);
        
        if (identity) {
            setIdentity(identity);
            initInventory(identity);
        }
    }, [serverData.identities])

    const performTransaction = () => {
        http('post', `/action/perform-transaction/${user.current._id}/${identity._id}`, {
            inventoryBefore: identity.currentInventory,
            inventoryAfter: inventory,
        }).then(() => {
            setCardID(null); setIdentity(null); setInventory([]);
        }).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    const performPayout = () => {
        http('post', `/action/perform-payout/${user.current._id}/${identity._id}`, {}).then(() => {
            setCardID(null); setIdentity(null); setInventory([]);
        }).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    return (
        <Box sx = {{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            p:2, gap:2,

            overflow: 'hidden',
        }}>
            <Sheet sx={{
                display:'flex',
                flexDirection:'column',

                p:2, gap:2,

                borderRadius: 'md',

                minWidth:240,
                maxWidth:270,

                overflowY: 'auto', 

                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}>
                <Box sx={{
                    display:'flex',
                    flexDirection:'column',

                    gap:2,
                    flex:1,
                }}>
                    <Typography level='h4'>System: {user?.current?.name}</Typography>

                    <Box sx={{
                        display:'flex',
                        flexDirection:'column',

                        gap:0.5,
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Uhrzeit:</Typography>
                            <Typography sx={{ flex: 1 }}>{currentTimeString} Uhr</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Nächste Schicht:</Typography>
                            <Typography sx={{ flex: 1 }}>18:00 Uhr Abendkasse</Typography>
                        </Box>
                    </Box>

                    {cardID && identity && <><Divider/>

                    <Typography level='h4'>Kund*in: {identity?.cardID}</Typography>

                    <Box sx={{
                        display:'flex',
                        flexDirection:'column',

                        gap:0.5,
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Authorität:</Typography>
                            <Typography sx={{ flex: 1 }}>{serverData?.accounts?.find(account => account.identityID == identity._id)?.authority || '-'}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Status:</Typography>
                            <Typography sx={{ flex: 1 }}>{identity?.status || '-'} </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Abs. Ausgaben:</Typography>
                            <Typography sx={{ flex: 1 }}>
                                {identity.transactions.reduce((total, identityTransaction) => {
                                    const transaction = serverData?.transactions?.find(transaction => transaction?._id == identityTransaction?.reference);

                                    if (transaction.buyer == identity?._id) {
                                        total += transaction.totalPrice;
                                    }

                                    return !isNaN(total)? total : 0;
                                }, 0)} €
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Abs. Saldo:</Typography>
                            <Typography sx={{ flex: 1 }}>
                                {identity.currentInventory.reduce((total, item) => {
                                    const serverItem = serverData?.items?.find(serverItem => serverItem?._id == item?.reference);
                                    const startItem = identity?.startInventory?.find(startItem => startItem?.reference == item?.reference) || { reference: item?.reference, quantity: 0 }

                                    total += Math.max(item?.quantity - startItem?.quantity, 0) * serverItem?.price;

                                    return !isNaN(total)? total : 'ERROR';
                                }, 0)} €
                            </Typography>
                        </Box>


                    </Box>

                    <Button fullWidth variant='soft' color='danger'
                    onClick={() => {confirmation.confirm('Bist du dir sicher, dass du auszahlen möchtest?', 'Ja!', performPayout, 'danger')}}>
                        Auszahlen
                    </Button></>}
                </Box>

                {cardID && identity && <><Divider />

                <Box sx={{
                    display:'flex',
                    flexDirection:'column',

                    gap:2,
                }}>
                    <Typography level='h4'>Transaktion: #{identity.transactions?.length + 1}</Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Betrag:</Typography>
                        <Typography sx={{ flex: 1 }}>{(() => {
                            let total = 0;

                            inventory.forEach(item => {
                                const identityItem = identity?.currentInventory.find(identityItem => identityItem?.reference == item?.reference) || { reference: item?.reference, quantity: 0 }
                                const serverItem = serverData?.items?.find(serverItem => serverItem?._id == item?.reference);

                                total += serverItem?.price * Math.max(0, (item?.quantity - identityItem?.quantity));
                            });

                            return total;
                        })()} €</Typography>
                    </Box>

                    <Box sx={{display:'flex', flexDirection:'column', gap:2}}>
                        <Button fullWidth variant='soft' color='success'
                        onClick={() => {confirmation.confirm('Bist du dir sicher, dass du buchen möchtest?', 'Ja!', performTransaction, 'success')}}>
                            Buchen
                        </Button>

                        <Button fullWidth variant='soft' color='danger' onClick={() => {setCardID(null); setIdentity(null); setInventory([])}}>Abbrechen</Button>
                    </Box>
                </Box></>}
            </Sheet>




            <Modal open={cardID && !identity}>
                <ModalDialog>
                    <Typography level='h4' color='danger' variant='soft' sx={{ textAlign: 'left' }}>Karte {cardID}:</Typography>
                    <Box>
                        <Typography level='body-lg' sx={{ textAlign: 'left' }}>Karte ungültig!</Typography>
                    </Box>

                    <Button onClick={() => setCardID(null)} sx={{flex: 1, mt:1}} variant='soft' color='danger'>OK</Button>
                </ModalDialog>
            </Modal>

            <Sheet sx={{
                display:'flex',
                flexDirection:'column',

                p:2, gap:2,

                borderRadius: 'md',

                overflowY: 'auto', 

                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },

                flex:1,
            }}>
                <Typography level='h4'>Inventar:</Typography>
                {cardID && identity && <Grid container spacing={1}>
                    {serverData?.items?.map((serverItem, i) => {
                        const inventoryItem = inventory.find(item => item.reference == serverItem._id) || { reference: serverItem._id, quantity: 0 };
                        const difference = inventoryItem.quantity - (identity.currentInventory.find(item => item.reference == serverItem._id)?.quantity || 0);

                        return (<Grid xs={12} sm={6} md={4} lg={3} key={i}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography level="h4" color='primary'>{serverItem.name}</Typography>
                                    
                                    <Box>
                                        <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                                            <Typography sx={{ flex:1 }}>Verfügbar:</Typography>
                                            <Typography sx={{ flex:1 }}>{serverItem?.maxQuantity - (Math.max(serverItem?.totalQuantitySold || 0, serverItem?.totalQuantityFetched || 0) + Math.max(0, difference))}</Typography>
                                        </Box>

                                        <Box sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                                            <Typography sx={{ flex:1 }}>Im Inventar:</Typography>
                                            <Typography sx={{ flex:1 }} color={difference != 0 && (difference > 0? 'success': 'danger')}>
                                                {inventoryItem?.quantity} {difference != 0 && (difference > 0? "(+":"(")}{difference != 0 && `${difference})`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>

                                <CardActions>
                                    <Button fullWidth variant="soft" color="success"
                                        onClick={() => setInventory(prev => [...prev.map(item => item.reference == serverItem._id? {...item, quantity: item.quantity + 1}: item)])}
                                    >+</Button>
                                    <Button fullWidth variant="soft" color="danger"
                                        onClick={() => setInventory(prev => [...prev.map(item => item.reference == serverItem._id? {...item, quantity: Math.max(0, item.quantity - 1)}: item)])}
                                    >-</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                    )}
                </Grid>}

            </Sheet>
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
            {device?.mode == 3  && <Reader device={device} />}
            {device?.mode == 4  && <Register device={device} />}
        </Box>
    );
}