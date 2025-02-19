import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';

function ItemRow({ item, toggleSelection, selected }) {
    return (
        <tr style={{ display:'flex' }}>
            <td>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Checkbox checked={selected.includes(item)} onChange={() => toggleSelection(item)}/>
                </Box>
            </td>
            <td style={{ flex:1.5 }}>{String(item?.name)}</td>
            <td style={{ flex:1 }}>{String(item?.price) || 0} €</td>
            <td style={{ flex:1 }}>{String(item?.maxQuantity - Math.max(item?.totalQuantitySold || 0, item?.totalQuantityFetched || 0) || 0)}</td>
            <td style={{ flex:1 }}>{String(item?.totalQuantitySold || 0)}</td>
            <td style={{ flex:1 }}>{String(item?.totalQuantityFetched || 0)}</td>
        </tr>
    )
}

function average(numbers) {
    const validNumbers = numbers.filter(num => !isNaN(num) && num !== undefined);
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    return validNumbers.length > 0 ? sum / validNumbers.length : 0; // Avoid division by zero
}

function CreateModal({ isShown, setIsShown, create }) {
    const [data, setData] = useState({});

    const hide = () => setIsShown(false);
    const message = useMessage();

    const handleAction = () => {
        if (data.name.length != 0) {
            data.cost = data.cost.length == 0 || isNaN(Number(data.cost))? 0 : Number(data.cost);
            data.price = data.price.length == 0 || isNaN(Number(data.price))? 0 : Number(data.price);
            data.maxQuantity = data.maxQuantity.length == 0 || isNaN(Number(data.maxQuantity))? 0 : Number(data.maxQuantity);

            create(data);
            hide();
        } else {
            message.write('Name nicht angegeben!', 'danger', 1500);
        }
    }

    useEffect(() => {
        if (isShown) {
            setData({
                name: '',
                cost: '0',
                price: '0',
                maxQuantity: '0',
            });
        }
    }, [isShown])

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog>
                <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Name:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.name} onChange={(e) => setData(prev => ({...prev, name: e.target.value}) )}/>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Kosten:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cost} 
                            onChange={(e) => setData(prev => ({...prev, cost: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Preis:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.price} 
                            onChange={(e) => setData(prev => ({...prev, price: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Max. Anzahl:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.maxQuantity} 
                            onChange={(e) => setData(prev => ({...prev, maxQuantity: e.target.value}) )}
                        />
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

function EditModal({ isShown, setIsShown, edit, selected }) {
    const [data, setData] = useState({});

    const hide = () => setIsShown(false);
    const message = useMessage();

    const handleAction = () => {
        if (selected.length != 1 || data.name?.length != 0) {
            data.cost = data.cost.length == 0  || isNaN(Number(data.cost))? 0 : Number(data.cost);
            data.price = data.price.length == 0  || isNaN(Number(data.price))? 0 : Number(data.price);

            data.maxQuantity = data.maxQuantity.length == 0  ||isNaN(Number(data.maxQuantity))? 0 : Number(data.maxQuantity);
            
            if (data.totalQuantitySold) {
                data.totalQuantitySold = data.totalQuantitySold.length == 0  || isNaN(Number(data.totalQuantitySold))? 0 : Number(data.totalQuantitySold);
                data.totalQuantityFetched = data.totalQuantityFetched.length == 0  || isNaN(Number(data.totalQuantityFetched))? 0 : Number(data.totalQuantityFetched);
            }

            edit(data);
            hide();
        } else {
            message.write('Name nicht angegeben!', 'danger', 1500);
        }
    }

    useEffect(() => {
        if (isShown) {
            setData({
                name: selected.length == 1 ? String(selected[0].name) : undefined,

                cost: String(selected.length == 1 ? selected[0].cost || 0 : average(selected.map((item) => item.cost)) ),
                price: String(selected.length == 1 ? selected[0].price || 0 : average(selected.map((item) => item.price)) ),
                maxQuantity: String(selected.length == 1 ? selected[0].maxQuantity : average(selected.map((item) => item.maxQuantity)) ),

                totalQuantitySold: selected.length == 1 ? String(selected[0].totalQuantitySold || 0) : undefined,
                totalQuantityFetched: selected.length == 1 ? String(selected[0].totalQuantityFetched || 0) : undefined,
            });
        }

    }, [isShown, selected])

    return (
        <Modal open={isShown} onClose={hide}>
            <ModalDialog>
                <Box sx={{ display:'flex', flexDirection:'column', gap: 1}}>
                    {selected.length == 1 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Name:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.name} onChange={(e) => setData(prev => ({...prev, name: e.target.value}) )}/>
                    </Box>}

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Kosten:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.cost} 
                            onChange={(e) => setData(prev => ({...prev, cost: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Preis:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.price} 
                            onChange={(e) => setData(prev => ({...prev, price: e.target.value}) )}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Max. Anzahl:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.maxQuantity} 
                            onChange={(e) => setData(prev => ({...prev, maxQuantity: e.target.value}) )}
                        />
                    </Box>

                    {selected.length == 1 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Verkauft:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.totalQuantitySold} 
                            onChange={(e) => setData(prev => ({...prev, totalQuantitySold: e.target.value}) )}
                        />
                    </Box>}

                    {selected.length == 1 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>Abgeholt:</Typography>
                        <Input sx={{ flex: 1, p: 0, ml:1, pl:1 }} value={data.totalQuantityFetched} 
                            onChange={(e) => setData(prev => ({...prev, totalQuantityFetched: e.target.value}) )}
                        />
                    </Box>}
                </Box>

                <Box sx={{ display:'flex', flexDirection:'row', gap: 1 }}>
                    <Button onClick={handleAction} sx={{flex: 1}} variant='soft'>Speichern</Button>
                    <Button onClick={hide} sx={{flex: 1}} variant='soft' color='danger'>Abbrechen</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

export default function() {
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
            res = serverData.items.filter(item => String(item.name).toLowerCase().includes(filter.toLowerCase()));
        } else {
            res = serverData.items;
        }

        setFiltered(res);

        setSelected(prev => {
            return prev.filter(item => res.find(i => i._id == item._id))
        })
    }, [serverData.items, filter]);

    useEffect(() => {
        const selectedIDs = selected.map(item => item._id)
        setSelected(serverData.items.filter(item => selectedIDs.includes(item._id)))
    }, [serverData.items]);

    const authenticate = useAuthenticate();

    useEffect(() => {
        authenticate();
    }, []);

    const toggleSelection = (item) => {
        if (selected.includes(item)){
            setSelected(prev => prev.filter((i) => i._id !== item._id))
        } else {
            setSelected(prev => ([...prev, item]))
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
        http('post', '/api/item/new', data);
    }

    const edit = (data) => {
        const query = JSON.stringify({ _id: { $in: selected.map(item => item._id) } });
        setSelected([]);
        http('post', `/api/item/update_many/${query}`, data).catch(() => {
            message.write('Es ist ein Fehler aufgetreten');
        });
    }

    const remove = () => {
        const query = JSON.stringify({ _id: { $in: selected.map(item => item._id) } });
        setSelected([]);
        http('post', `/api/item/delete_many/${query}`, {}).catch(() => {
            message.write('Es ist ein Fehler aufgetreten');
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

                    overflowY:'scroll',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                    <Box sx={{display:'flex', flexDirection:'row', gap:1}}>
                        <Input fullWidth placeholder='Suche: Name' onChange={(e) => setFilter(e.target.value)} value={filter}></Input>
                    </Box> 

                    <Table sx={{flex:1}}>
                        <thead>
                            <tr style={{display:'flex'}}>
                                <th>
                                    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                        <Checkbox checked={selected.length == filtered.length && selected.length != 0} onChange={toggleSelectAll}/>
                                    </Box>
                                </th>
                                <th style={{ flex:1.5 }}>Name</th>
                                <th style={{ flex:1 }}>Preis</th>
                                <th style={{ flex:1 }}>Anzahl</th>
                                <th style={{ flex:1 }}>Verkauft</th>
                                <th style={{ flex:1 }}>Abgeholt</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((item) => {
                                return (<ItemRow item={item} key={item._id} toggleSelection={toggleSelection} selected={selected} />);
                            })}
                        </tbody>
                    </Table>

                    <Box sx={{
                        display:'flex',
                        flexDirection:'row',
                        gap: 1,
                    }}>
                        <Button onClick={() => setShowCreateModal(true)} sx={{flex: 1}} variant='soft'>Erstellen</Button>
                        <Button onClick={() => {if(selected.length == 0){return}; setShowEditModal(true)}} sx={{flex: 1}} variant='soft'>Ändern</Button>
                        <Button onClick={() => {if(selected.length == 0){return}; remove()}} sx={{flex: 1}} variant='soft' color='danger'>Löschen</Button>
                    </Box>

                    <CreateModal isShown={showCreateModal} setIsShown={setShowCreateModal} create={create}/>
                    <EditModal isShown={showEditModal} setIsShown={setShowEditModal} edit={edit} selected={selected}/>
                </Sheet>
            </Box>
        </Box>
    );
}