import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';

function AccountRow({ account, identities, toggleSelection, selected }) {
    const identity = identities.find(identity => identity._id == account?.identityID)

    return (
        <tr style={{ display:'flex' }}>
            <td>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Checkbox checked={selected.includes(account)} onChange={() => toggleSelection(account)}/>
                </Box>
            </td>
                                
            <td style={{ flex:1 }}>{account.name}</td>
            <td style={{ flex:1 }}>{identity?.cardID || '-'}</td>
            <td style={{ flex:1 }}>{account.authority || '-'}</td>
        </tr>
    )
}

function CreateModal({ accounts, identities, isShown, setIsShown, create, selectedTab }) {
    const [data, setData] = useState({});
    const message = useMessage();
    const user = useUser();
    const authenticate = useAuthenticate();

    const handleAction = () => {
        if (data.name.length == 0) { return message.write('Kein Name angegeben!', 'danger')}
        if (data.password.length == 0) { return message.write('Kein Passwort angegeben!', 'danger')}
        if (data.authority.length == 0 || isNaN(Number(data.authority))) { return message.write('Authorität muss eine Nummer sein!', 'danger')}

        let res = {}
        res.name = data.name;
        res.password = data.password;
        if (user.current.authority) {
            res.authority = Math.min(Number(user?.current?.authority), Number(data.authority));
        } else {
            authenticate();
            return;
        }

        res.identityID = identities.find(identity => identity.cardID == Number(data.cardID))?._id || undefined;

        create(res);
        hide();
    }

    const initializeData = () => {
        setData({
            name: '',
            password: '',
            cardID: '',
            authority: (selectedTab == 0 && '5') || (selectedTab == 1 && '15') || (selectedTab == 2 && '25') || '',
        })
    }

    useEffect(() => {
        if (isShown) {
            initializeData();
        }
    }, [isShown])

    const hide = () => setIsShown(false)
    
    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog>
                <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Benutzername:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.name} 
                            onChange={(e) => setData(prev => ({...prev, name: String(e.target.value).toLowerCase()}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Passwort:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.password} 
                            onChange={(e) => setData(prev => ({...prev, password: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Karten ID:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cardID} 
                            onChange={(e) => setData(prev => ({...prev, cardID: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Authorität:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.authority} 
                            onChange={(e) => setData(prev => ({...prev, authority: e.target.value}) )}
                        />
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

function EditModal({ accounts, identities, isShown, setIsShown, edit, selected, selectedTab }) {
    const [data, setData] = useState({});
    const message = useMessage();
    const user = useUser();
    const authenticate = useAuthenticate();

    const handleAction = () => {
        if (data.name.length == 0) { return message.write('Kein Name angegeben!', 'danger')}
        if (data.authority.length == 0 || isNaN(Number(data.authority))) { return message.write('Authorität muss eine Nummer sein!', 'danger')}

        let res = {}
        res.name = data.name;
    
        if (data.password.length != 0) {
            res.password = data.password;
        }

        if (user.current.authority) {
            res.authority = Math.min(Number(user?.current?.authority), Number(data.authority));
        } else {
            authenticate();
            return;
        }

        if (data.cardID != identities.find(identity => identity._id == selected[0].identityID)?.cardID) {
            res.identityID = identities.find(identity => identity.cardID == Number(data.cardID))?._id || null;
        }

        edit(res);
        hide();
    }

    const initializeData = () => {
        setData({
            name: selected[0].name || '',
            password: '',
            cardID: identities.find(identity => identity._id == selected[0].identityID)?.cardID || '',
            authority: selected[0].authority || (selectedTab == 0 && '5') || (selectedTab == 1 && '15') || (selectedTab == 2 && '25') || '',
        })
    }

    useEffect(() => {
        if (isShown) {
            initializeData();
        }
    }, [isShown])

    const hide = () => setIsShown(false)

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog>
                <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Benutzername:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.name} 
                            onChange={(e) => setData(prev => ({...prev, name: String(e.target.value).toLowerCase()}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Passwort:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.password} 
                            onChange={(e) => setData(prev => ({...prev, password: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Karten ID:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cardID} 
                            onChange={(e) => setData(prev => ({...prev, cardID: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Authorität:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.authority} 
                            onChange={(e) => setData(prev => ({...prev, authority: e.target.value}) )}
                        />
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

export default function () {
    const [nameFilter, setNameFilter] = useState('');
    const [idFilter, setIdFilter] = useState('');

    const [filtered, setFiltered] = useState([]);
    const [selected, setSelected] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const message = useMessage();
    const serverData = useServerData();
    const http = useHttp();
    const viewport = useViewport();
    const user = useUser();
    const authenticate = useAuthenticate();

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        let res;
        if (nameFilter.length != 0) {
            res = serverData.accounts.filter(account => String(account.name).includes(nameFilter.toLowerCase()));
        } else { 
            res = serverData.accounts;
        }

        if (idFilter.length != 0) {
            res = res.filter(account => account)
                  .filter(account => serverData.identities.some(identity => identity._id === account.identityID));
        }

        setSelected(prev => {
            return prev.filter(account => res.find(i => i._id == account._id))
        })

        setFiltered(res);

    }, [nameFilter, idFilter, serverData.identities, serverData.accounts]);

    // client functions
    const toggleSelection = (account) => {
        if (selected.includes(account)){
            setSelected(prev => prev.filter((i) => i._id !== account._id))
        } else {
            setSelected(prev => ([...prev, account]))
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
        http('post', '/api/account/new', data).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    const edit = (data) => {
        const query = JSON.stringify({ _id: { $in: selected.map(account => account._id) } });
        http('post', `/api/account/update_many/${query}`, data).then(() => {
            setSelected([]);
        }).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    const remove = () => {
        const query = JSON.stringify({ _id: { $in: selected.map(account => account._id) } });
        http('post', `/api/account/delete_many/${query}`, {}).then(() => {
            setSelected([]);
        }).catch(() => {
            message.write('Es ist ein Fehler aufgetreten!', 'danger', 1500);
        });
    }

    return (
        <Box sx={{
            height:1,
            width:1,

            display:'flex',
            flexDirection:'column',
        }}>
            <Topbar />

            <Box sx={{
                height:1,

                flex:1,
                display:'flex',
                mx:2
            }}>
                <Sheet sx={{
                    my:2,
                    mx:'auto',

                    px:2,
                    py:2,

                    borderRadius:'md',

                    width:1,
                    maxWidth:550,

                    display:'flex',
                    flexDirection:'column',

                    gap:2,
                }}>
                    <Box sx={{display:'flex', flexDirection:'row', gap:1}}>
                        <Input fullWidth placeholder='Suche: Name' onChange={(e) => setNameFilter(e.target.value)} value={nameFilter}></Input>
                        <Input fullWidth placeholder='Suche: ID' onChange={(e) => setIdFilter(e.target.value)} value={idFilter}></Input>
                    </Box> 

                    <Box sx={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 1,
                    }}>
                        <Button sx={{flex: 1}} variant='soft' color={selectedTab == 0? 'primary':'neutral'} onClick={() => setSelectedTab(0)}>{viewport.isSm? 'SMV':'SMV Mitglieder'}</Button>
                        <Button sx={{flex: 1}} variant='soft' color={selectedTab == 1? 'primary':'neutral'} onClick={() => setSelectedTab(1)}>{viewport.isSm? 'Admins':'Administratoren'}</Button>
                        <Button sx={{flex: 1}} variant='soft' color={selectedTab == 2? 'primary':'neutral'} onClick={() => setSelectedTab(2)}>{viewport.isSm? 'Devs':'Entwickler'}</Button>
                    </Box>

                    <Table sx={{flex:1}}>
                        <thead>
                            <tr style={{display:'flex'}}>
                                <th>
                                    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                        <Checkbox checked={selected.length == filtered.length && selected.length != 0} onChange={toggleSelectAll}/>
                                    </Box>
                                </th>
                                <th style={{ flex:1 }}>Name</th>
                                <th style={{ flex:1 }}>Karten ID</th>
                                <th style={{ flex:1 }}>Authorität</th>
                            </tr>
                        </thead>
 
                        <tbody>
                            {filtered?.map((account, i) => {
                                if (selectedTab == 0 && account.authority < 10) {
                                    return (<AccountRow key={i} account={account} identities={serverData.identities} toggleSelection={toggleSelection} selected={selected}/>);
                                }

                                if (selectedTab == 1 && account.authority >= 10 && account.authority < 20) {
                                    return (<AccountRow key={i} account={account} identities={serverData.identities} toggleSelection={toggleSelection} selected={selected}/>);
                                }

                                if (selectedTab == 2 && account.authority >= 20) {
                                    return (<AccountRow key={i} account={account} identities={serverData.identities} toggleSelection={toggleSelection} selected={selected}/>);
                                }
                            })}
                        </tbody>
                    </Table>

                    <Box sx={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 1,
                    }}>
                        <Button sx={{flex: 1}} variant='soft' onClick={() => setShowCreateModal(true)}>Erstellen</Button>
                        <Button sx={{flex: 1}} variant='soft' onClick={() => {if(selected.length == 0){return}; setShowEditModal(true)}}>Ändern</Button>
                        <Button sx={{flex: 1}} variant='soft' color='danger' onClick={() => {if(selected.length == 0){return}; remove()}}>Löschen</Button>
                    </Box>
                </Sheet>

                <CreateModal accounts={serverData.accounts} identities={serverData.identities} isShown={showCreateModal} setIsShown={setShowCreateModal} create={create} selectedTab={selectedTab}/>
                <EditModal accounts={serverData.accounts} identities={serverData.identities} isShown={showEditModal} setIsShown={setShowEditModal} edit={edit} selected={selected} selectedTab={selectedTab}/>
            </Box> 
        </Box>
    );
}