import { useEffect, useState } from 'react';
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Box, Button, Card, Checkbox, IconButton, Input, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Topbar from '../components/Topbar';

import { Add } from '@mui/icons-material'
import { width } from '@mui/system';

function EditModal() {

}

function CustomTabPanel({ value, selectAll, accounts, setSelected, selected, toggleSelection }) {
    const [filteredAccounts, setFilteredAccounts] = useState(accounts);

    const [nameFilter, setNameFilter] = useState('');
    const [identityFilter, setIdentityFilter] = useState('');

    const [edit, setEdit] = useState();

    const handleDelete = () => {
        const accountIds = selected.map(account => account._id);
        const query = JSON.stringify({ _id: { $in: accountIds } });

        setSelected([]);

        http('post', `/api/account/delete_many/${encodeURIComponent(query)}`, {});
    }

    const handleEdit = () => {
        setEdit(selected[0]);
    }

    const performEdit = () => {
        const accountIds = selected.map(account => account._id);
        const query = JSON.stringify({ _id: { $in: accountIds } });

        let payload = edit;
        delete payload._id;

        http('post', `/api/account/update_many/${encodeURIComponent(query)}`, payload).then(() => {setSelected([]);});
    }

    useEffect(() => {
        const filtered = accounts.filter((account) => {
            const matchesName = nameFilter
                ? account.name.toLowerCase().includes(nameFilter.toLowerCase())
                : true;
    
            const matchesIdentity = identityFilter
                ? account.identity && account.identity.toString().toLowerCase().includes(identityFilter.toLowerCase())
                : true;

            if (identityFilter && !account.identity) {
                return false;
            }
    
            return matchesName && matchesIdentity;
        });
    
        setFilteredAccounts(filtered);
    }, [nameFilter, identityFilter, accounts]);
    

    return (
        <TabPanel sx={{p:0, mt:2, mb:2 }} value={value}>
            <Box sx={{m: 0, p: 0, mx: 2, height:1, display:'flex', flexDirection:'column'}}>
                <Box sx={{display:'flex', flexDirection:'row', gap:1 }}>
                    <Input sx={{flex:1}} placeholder='Name filtern' onChange={(e) => setNameFilter(e.target.value)} value={nameFilter}></Input>
                    <Input sx={{flex:1}} placeholder='Identität filtern' onChange={(e) => setIdentityFilter(e.target.value)} value={identityFilter}></Input>
                </Box>

                <Box sx={{flex:1}}>
                    <Table sx={{mt: 2}}>
                        <thead>
                            <tr style={{display:'flex'}}>
                                <th>
                                    <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                        <Checkbox onChange={() => selectAll(accounts)} checked={(selected?.length == accounts?.length) && selected?.length != 0 && selected}/>
                                    </Box>
                                </th>
                                <th style={{ flex:1 }}>Name</th>
                                <th style={{ flex:1 }}>Identität</th>
                                <th style={{ flex:1 }}>Authorität</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAccounts.map((account, i) => {
                                return (
                                <tr style={{display:'flex'}} key={i}>
                                    <td>
                                        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                                            <Checkbox checked={selected.includes(account)} onChange={() => toggleSelection(account)} />
                                        </Box>
                                    </td>
                                    <td style={{ flex:1 }}>{account.name}</td>
                                    <td style={{ flex:1 }}>{account.identity || '-'}</td>
                                    <td style={{ flex:1 }}>{account.authority}</td>
                                </tr>);
                            })}
                        </tbody>
                    </Table>
                </Box>

                <Box sx={{display:'flex', flexDirection:'row', gap:2}}>
                    <IconButton size='md' color='primary' variant='soft' sx={{flex:2}}>
                        <Typography sx={{flex:1}}>Account anlegen</Typography>
                    </IconButton>

                    <IconButton size='md' color='neutral' variant='soft' sx={{flex:1}} onClick={edit}>
                        <Typography>Editieren</Typography>
                    </IconButton>

                    <IconButton size='md' color='danger' variant='soft' sx={{flex:1}} onClick={handleDelete}>
                        <Typography>Löschen</Typography>
                    </IconButton>
                </Box>
            </Box>
        </TabPanel>
    );
}

export default function() {
    const [selectedTab, setSelectedTab] = useState(0);

    const authenticate = useAuthenticate();
    const user = useUser();
    const http = useHttp();
    const viewport = useViewport();
    const serverData = useServerData();

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        setSelected([]);
    }, [selectedTab])

    const toggleSelection = (account) => {
        setSelected((prevSelected) =>
            prevSelected.includes(account)
                ? prevSelected.filter((item) => item !== account)
                : [...prevSelected, account]
        );
    };

    const selectAll = (accounts) => {
        if (accounts.every((account) => selected.includes(account))) {
            setSelected([]);
        } else {
            setSelected(accounts);
        }
    };

    return (
        <Box
            sx={{
                height: 1,
                width: 1,
                display:'flex',
                flexDirection:'column'
            }}
        >
            <Topbar />
            
            <Box sx={{
                height:1,

                flex:1,
                display:'flex',
                mx:2
            }}>
                <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} sx={{
                    my:2,
                    mx:'auto',

                    borderRadius:'md',

                    width:1,
                    maxWidth:550,
                }}>
                    <TabList disableUnderline sx={{display: 'flex', gap:1, borderRadius:'md', mx:2, mt:2}}>
                        <Tab disableIndicator sx={{flex:1, borderRadius:'md'}} value={0}
                            color   = {selectedTab === 0 ? "primary" : "neutral"}
                            variant = {selectedTab === 0 ? "plain" : "soft"}
                        >
                            <Typography>{viewport.isSm? 'SMV':'SMV Mitglieder'}</Typography>
                        </Tab>
                        
                        <Tab disabled={!user.current?.authority >= 20} disableIndicator sx={{flex:1, borderRadius:'md'}} value={1}
                            color   = {selectedTab === 1 ? "primary" : "neutral"}
                            variant = {selectedTab === 1 ? "plain" : "soft"}
                        >
                            <Typography>{viewport.isSm? 'Admins':'Administratoren'}</Typography>
                        </Tab>

                        <Tab disabled={!user.current?.authority >= 30} disableIndicator sx={{flex:1, borderRadius:'md'}} value={2}
                            color   = {selectedTab === 2 ? "primary" : "neutral"}
                            variant = {selectedTab === 2 ? "plain" : "soft"}
                        >
                            <Typography>{viewport.isSm? 'Devs':'Entwickler'}</Typography>
                        </Tab>
                    </TabList>


                    <CustomTabPanel value={0} handleDelete={handleDelete} handleEdit={handleEdit} nID={5} selectAll={selectAll} toggleSelection={toggleSelection} selected={selected} accounts={serverData.accounts.filter((account) => account.authority < 10)} />

                    <CustomTabPanel value={1} handleDelete={handleDelete} handleEdit={handleEdit} nID={15} selectAll={selectAll} toggleSelection={toggleSelection} selected={selected} accounts={serverData.accounts.filter((account) => account.authority >= 10 && account.authority < 20)} />

                    <CustomTabPanel value={2} handleDelete={handleDelete} handleEdit={handleEdit} nID={25} selectAll={selectAll} toggleSelection={toggleSelection} selected={selected} accounts={serverData.accounts.filter((account) => account.authority >= 20)} />
                </Tabs>
            </Box>
        </Box>
    );
}
