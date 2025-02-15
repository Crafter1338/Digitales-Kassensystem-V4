import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, TabList, TabPanel, Divider, Card, Typography, Button, MenuItem, Dropdown, MenuButton, Menu, Input } from "@mui/joy";
import Topbar from '../components/Topbar';

import { useAuth } from '../contexts/AuthContext';
import useValidate from '../hooks/useValidate';
import { useData } from '../contexts/DataContext';

function CustomTabPanel({value, children, handleSort}) {
    return (
        <TabPanel value={value} sx={{
            height:1,

            overflowY:'scroll',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        }}>
        <Box sx={{
                display:'flex', gap: 1
            }}>
                <Dropdown sx={{}}>
                    <MenuButton sx={{width:1, flex:1}}>
                        Sortieren
                    </MenuButton>

                    <Menu>
                        <MenuItem color='primary' onClick={() => handleSort(0)}>Name (A-Z)</MenuItem>
                        <MenuItem color='danger' onClick={() => handleSort(1)}>Name (Z-A)</MenuItem>
                        <MenuItem color='primary' onClick={() => handleSort(2)}>Kartennummer (aufsteigend)</MenuItem>
                        <MenuItem color='danger' onClick={() => handleSort(3)}>Kartennummer (absteigend)</MenuItem>
                        <MenuItem color='primary' onClick={() => handleSort(4)}>Authorität (aufsteigend)</MenuItem>
                        <MenuItem color='danger' onClick={() => handleSort(5)}>Authorität (absteigend)</MenuItem>
                    </Menu>
                </Dropdown>

                <Input sx={{width:1, flex:2}} placeholder='Namensfilter'></Input>
            </Box>
            {children}
        </TabPanel>
    );
}

export default function() {
    const validate = useValidate();
    const auth = useAuth();
    const data = useData();

    const [accounts, setAccounts] = useState({
        smv: [],
        admin: [],
        dev: [],
    })

    const [isSm, setIsSm] = React.useState(window.innerWidth < 600);

    const handleSort = () => {

    }

    useEffect(() => {
        validate();

        const handleResize = () => {
            setIsSm(window.innerWidth < 600);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        let result = {smv: [], admin: [], dev: []}

        data.accounts.forEach((account) => {
            if (account.authority < 10){
                result.smv.push(account);
            } else if (account.authority < 20){
                result.admin.push(account);
            } else {
                result.dev.push(account);
            }
        })

        setAccounts(result);
    }, [data.accounts])

    return (
        <Box
            sx={{
                height: 1,
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Topbar />

            <Box
                sx={{
                    my:2,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <Tabs
                    defaultValue={0}
                    sx={{
                        mx: 'auto',

                        maxWidth: 650,
                        width: 1,
                        height: 1,

                        p: 2,

                        boxShadow: 'md',
                        borderRadius: 'md',

                        display:'flex',
                        flexDirection:'column'
                    }}
                >
                    <TabList disableUnderline sx={{ display: 'flex', gap: 2 }}>
                        <Tab
                            disabled={auth.user?.authority < 10}
                            disableIndicator
                            sx={{ borderRadius: 'md', width: 1, justifyContent: 'flex-start' }}
                            color="neutral"
                            variant="soft"
                        >
                            {isSm ? 'SMV' : 'SMV Mitglieder'}
                        </Tab>

                        <Tab
                            disabled={auth.user?.authority < 10}
                            disableIndicator
                            sx={{ borderRadius: 'md', width: 1, justifyContent: 'flex-start' }}
                            color="neutral"
                            variant="soft"
                        >
                            {isSm ? 'Admins' : 'Administratoren'}
                        </Tab>

                        <Tab
                            disabled={auth.user?.authority < 20}
                            disableIndicator
                            sx={{ borderRadius: 'md', width: 1, justifyContent: 'flex-start' }}
                            color="neutral"
                            variant="soft"
                        >
                            {isSm ? 'Devs' : 'Entwickler'}
                        </Tab>
                    </TabList>

                    <Divider sx={{ my: 2 }} />

                    <CustomTabPanel value={0} handleSort={handleSort}>
                        {accounts.smv.map((v, i) => 
                            <Card sx={{
                                display:'flex',
                                flexDirection:'row'
                            }}>
                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>admin</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Karte: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Auth: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, display:'flex', flexDirection:'row', gap:1}}>
                                    <Button sx={{flex:1}} variant='soft'>Editieren</Button>
                                    <Button sx={{flex:1}} variant='soft' color='danger'>Löschen</Button>
                                </Box>
                            </Card>
                        )}
                    </CustomTabPanel>

                    <CustomTabPanel value={1} handleSort={handleSort}>
                    {accounts.smv.map((v, i) => 
                            <Card sx={{
                                display:'flex',
                                flexDirection:'row'
                            }}>
                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>admin</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Karte: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Auth: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, display:'flex', flexDirection:'row', gap:1}}>
                                    <Button sx={{flex:1}} variant='soft'>Editieren</Button>
                                    <Button sx={{flex:1}} variant='soft' color='danger'>Löschen</Button>
                                </Box>
                            </Card>
                        )}
                    </CustomTabPanel>

                    <CustomTabPanel value={2} handleSort={handleSort}>
                    {accounts.dev.map((v, i) => 
                            <Card sx={{
                                display:'flex',
                                flexDirection:'row'
                            }}>
                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>admin</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Karte: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, height:1, display:'flex', alignItems:'center'}}>
                                    <Typography>Auth: 0</Typography>
                                </Box>

                                <Box sx={{flex:1, display:'flex', flexDirection:'row', gap:1}}>
                                    <Button sx={{flex:1}} variant='soft'>Editieren</Button>
                                    <Button sx={{flex:1}} variant='soft' color='danger'>Löschen</Button>
                                </Box>
                            </Card>
                        )}
                    </CustomTabPanel>
                </Tabs>
            </Box>
        </Box>
    );
}