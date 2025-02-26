import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';

function IdentityRow({ accounts, identity, toggleSelection, selected }) {
    return (
        <tr style={{ display:'flex' }}>
            <td>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Checkbox checked={selected.includes(identity)} onChange={() => toggleSelection(identity)}/>
                </Box>
            </td>
            <td style={{ flex:1 }}>{identity.cardID}</td>
            <td style={{ flex:1 }}>{accounts?.find(account => account?.identityID == identity._id)?.name || '-'}</td>
            <td style={{ flex:1 }}>{identity.wardrobeID || '-'}</td>
            <td style={{ flex:1 }}>{identity.status || '-'}</td>
        </tr>
    )
}

function CreateModal({ items, isShown, setIsShown, create }) {
    const [data, setData] = useState({});

    const hide = () => setIsShown(false);
    const message = useMessage();

    const handleAction = () => {
        if (data.cardID?.length != 0 && !isNaN(Number(data.cardID))) {
            data.cardID = Number(data.cardID);

            data.wardrobeID = isNaN(Number(data.wardrobeID)) || data.wardrobeID?.length == 0? undefined : Number(data.wardrobeID);
            data.status = data.status.length == 0? '' : data.status;

            data.currentInventory = data.currentInventory.map(item => {
                return {
                    reference: String(item.reference),
                    quantity: isNaN(Number(item.quantity)) || item.quantity?.length == 0? 0 : Number(item.quantity),
                }
            })

            data.startInventory = data.currentInventory;

            create(data);
            hide();
        } else {
            message.write('Keine Karten ID angegeben!', "danger", 1500)
        }
    }

    useEffect(() => {
        if (isShown && items) {
            setData({
                cardID: '',
                wardrobeID: '',
                status: '',

                currentInventory: items?.map(item => ({
                    reference: item._id,
                    quantity: '0',
                }))
            });
        }
    }, [isShown, items])

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog sx={{mx:2, my:2}}>
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
                    </Box>

                    <Box sx={{
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
                        {data.currentInventory && items.map((serverItem, i) => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                <Typography sx={{ flex: 1 }}>{serverItem.name}</Typography>
                                <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.currentInventory?.find(item => item.reference == serverItem._id)?.quantity} 
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
                    </Box>
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap: 1 }}>
                    <Button onClick={handleAction} sx={{flex: 1}} variant='soft'>Speichern</Button>
                    <Button onClick={hide} sx={{flex: 1}} variant='soft' color='danger'>Abbrechen</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

function EditModal({ items, isShown, setIsShown, edit, selected }) {
    const [data, setData] = useState({});

    const hide = () => setIsShown(false);
    const message = useMessage();

    const handleAction = () => {
        if (selected.length > 1) {
            data.status = data.status?.length == 0? '' : data.status;

            data.currentInventory = data.currentInventory.map(item => {
                return {
                    reference: String(item.reference),
                    quantity: Number(item.quantity),
                }
            })

            data.startInventory = data.currentInventory;

            edit(data);
            hide();
            return;
        }

        if (data.cardID?.length != 0 && !isNaN(Number(data.cardID))) {
            data.cardID = Number(data.cardID);

            if (data.wardrobeID.length == 0) {data.wardrobeID = null} else {
            data.wardrobeID = isNaN(Number(data.wardrobeID))? undefined : Number(data.wardrobeID);}

            data.status = data.status?.length == 0? '' : data.status;

            data.currentInventory = data.currentInventory.map(item => {
                return {
                    reference: String(item.reference),
                    quantity: isNaN(Number(item.quantity)) || item.quantity?.length == 0? 0 : Number(item.quantity),
                }
            })

            data.startInventory = data.currentInventory;

            edit(data);
            hide();
        } else {
            message.write('Keine Karten ID angegeben!', "danger", 1500)
        }
    }

    useEffect(() => {
        if (isShown && items) {
            setData({
                cardID: selected.length == 1? selected[0].cardID : undefined,
                wardrobeID: selected.length == 1? selected[0].wardrobeID || '' : undefined,

                isOnSite: selected.length == 1? selected[0].isOnSite : false,

                status: String(selected[0].status || ''),

                currentInventory: items?.map(serverItem => ({
                    reference: serverItem._id,
                    quantity: String(selected[0].currentInventory.find(item => item.reference == serverItem._id)?.quantity || 0),
                }))
            });
        }
    }, [isShown, items, selected])

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog sx={{mx:2, my:2}}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                    <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>
                        {selected.length == 1 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Karten ID:</Typography>
                            <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cardID} 
                                onChange={(e) => setData(prev => ({...prev, cardID: e.target.value}) )}
                            />
                        </Box>}

                        {selected.length == 1 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ flex: 1 }}>Garderoben ID:</Typography>
                            <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.wardrobeID} 
                                onChange={(e) => setData(prev => ({...prev, wardrobeID: e.target.value}) )}
                            />
                        </Box>}

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

                    <Box sx={{
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
                        {data.currentInventory && items.map((serverItem, i) => (
                            <Box key={i} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                <Typography sx={{ flex: 1 }}>{serverItem.name}</Typography>
                                <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.currentInventory?.find(item => item.reference == serverItem._id)?.quantity} 
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
                    </Box>
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap: 1, mt:1 }}>
                    <Button onClick={handleAction} sx={{flex: 1}} variant='soft'>Speichern</Button>
                    <Button onClick={hide} sx={{flex: 1}} variant='soft' color='danger'>Abbrechen</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

export default function () {
    const serverData = useServerData();
    const http = useHttp();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selected, setSelected] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [filter, setFilter] = useState('');

    const message = useMessage();

    // client functions
    useEffect(() => {
        let res;
        if (filter.length != 0) {
            res = serverData.identities.filter(identity => String(identity.cardID).includes(filter.toLowerCase()));
        } else {
            res = serverData.identities;
        }

        setFiltered(res);

        setSelected(prev => {
            return prev.filter(identity => res.find(i => i._id == identity._id))
        })

    }, [serverData.identities, filter]);

    useEffect(() => {
        const selectedIDs = selected.map(identity => identity._id)
        setSelected(serverData.identities.filter(identity => selectedIDs.includes(identity._id)))
    }, [serverData.identities]);

    const authenticate = useAuthenticate();

    useEffect(() => {
        authenticate();
    }, []);

    const toggleSelection = (identity) => {
        if (selected.includes(identity)){
            setSelected(prev => prev.filter((i) => i._id !== identity._id))
        } else {
            setSelected(prev => ([...prev, identity]))
        }
    }

    const toggleSelectAll = () => {
        if (selected.length == filtered.length) { // all are selected
            setSelected([]);
        } else {
            setSelected(filtered);
        }
    }

    // server functions
    const create = (data) => {
        http('post', '/api/identity/new', data).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });;
    }

    const edit = (data) => {
        const query = JSON.stringify({ _id: { $in: selected.map(identity => identity._id) } });
        setSelected([]);
        http('post', `/api/identity/update_many/${query}`, data).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    const remove = () => {
        const query = JSON.stringify({ _id: { $in: selected.map(identity => identity._id) } });
        setSelected([]);
        http('post', `/api/identity/delete_many/${query}`, {}).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 1,
            width:1,
            overflow: 'hidden',
        }}>
            <Topbar />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                mx: 2,
                overflow: 'hidden',
            }}>
                <Sheet sx={{
                    my: 2,
                    mx: 'auto',
                    px: 2,
                    py: 2,
                    borderRadius: 'md',
                    width: 1,
                    maxWidth: 550,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flexGrow: 1,
                    overflow: 'hidden',
                }}>
                    <Box sx={{display:'flex', flexDirection:'row', gap:1}}>
                        <Input fullWidth placeholder='Suche: ID' onChange={(e) => setFilter(e.target.value)} value={filter}></Input>
                    </Box> 

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflowY: 'auto',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}>
                        <Table sx={{flex:1}}>
                            <thead>
                                <tr style={{display:'flex'}}>
                                    <th>
                                        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                            <Checkbox checked={selected.length == filtered.length && selected.length != 0} onChange={toggleSelectAll}/>
                                        </Box>
                                    </th>
                                    <th style={{ flex:1 }}>Karten ID</th>
                                    <th style={{ flex:1 }}>Account</th>
                                    <th style={{ flex:1 }}>Garderoben ID</th>
                                    <th style={{ flex:1 }}>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((identity) => {
                                    return (<IdentityRow identity={identity} key={identity._id} toggleSelection={toggleSelection} selected={selected} accounts={serverData.accounts}/>);
                                })}
                            </tbody>
                        </Table>
                    </Box>

                    <Box sx={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 1,
                    }}>
                        <Button onClick={() => setShowCreateModal(true)} sx={{flex: 1}} variant='soft'>Erstellen</Button>
                        <Button onClick={() => {if(selected.length == 0){return}; setShowEditModal(true)}} sx={{flex: 1}} variant='soft'>Ändern</Button>
                        <Button onClick={() => {if(selected.length == 0){return}; remove()}} sx={{flex: 1}} variant='soft' color='danger'>Löschen</Button>
                    </Box>

                    <CreateModal items={serverData.items} isShown={showCreateModal} setIsShown={setShowCreateModal} create={create}/>
                    <EditModal items={serverData.items} isShown={showEditModal} setIsShown={setShowEditModal} edit={edit} selected={selected}/>
                </Sheet>
            </Box>
        </Box>
    );
}