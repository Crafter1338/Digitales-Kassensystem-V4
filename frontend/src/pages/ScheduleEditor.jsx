import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, CardActions, Checkbox, Grid, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Textarea, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useRef, useState } from 'react';

function ScheduleEntry() {
    const [isEdit, setIsEdit] = useState({
        name: false,
        description: false,
    });

    const [data, setData] = useState({
        name: '',
        description: '',
    });

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);

    const handleClickOutside = (event) => {
        if (nameRef.current && !nameRef.current.contains(event.target)) {
            setIsEdit((prev) => ({ ...prev, name: false }));
        }
        
        if (descriptionRef.current && !descriptionRef.current.contains(event.target)) {
            setIsEdit((prev) => ({ ...prev, description: false }));
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display:'flex'}}>
            <Card sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    {isEdit.name ? (
                        <Input
                            ref={nameRef}
                            sx={{ p: 0.5 }}
                            autoFocus
                            onChange={(e) =>
                                setData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            value={data.name}
                        />
                    ) : (
                        <Typography
                            onClick={() => setIsEdit((prev) => ({ ...prev, name: true }))}
                            level="h4"
                        >
                            {data.name || 'Schichtname'}
                        </Typography>
                    )}

                    {isEdit.description ? (
                        <Textarea
                            ref={descriptionRef}
                            sx={{ p: 0.5 }}
                            autoFocus
                            onChange={(e) =>
                                setData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            value={data.description}
                        />
                    ) : (
                        <Typography
                            onClick={() => setIsEdit((prev) => ({ ...prev, description: true }))}
                        >
                            {data.description || 'Schichtbeschreibung'}
                        </Typography>
                    )}
                </Box>

                <CardActions>
                    <Button variant="soft" color='danger'>Löschen</Button>
                </CardActions>
            </Card>
        </Grid>
    );
}

function AddScheduleEntry () {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
            <Card sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, justifyContent: 'center', alignItems: 'center', height: 1 }}>
                    <Button variant='soft' fullWidth onClick={handleCreate}>
                        Schicht hinzufügen
                    </Button>
                </Box>
            </Card>
        </Grid>
    );
}

export default function () {
    const [tab, setTab] = useState(0);

    const serverData = useServerData();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',

            gap:2,

            height: 1,
            width:1,

            overflow: 'hidden',
        }}>
            <Topbar />

            <Box sx={{ px:2, pb:2, flex:1, display:'flex', flexDirection:'column' }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ flex:1, borderRadius:'md', overflow:'hidden', width:1, mx:'auto', p:2, display:'flex', flexDirection:'column', gap:1,  }}>
                    <TabList disableUnderline sx={{ display:'flex', flexDirection:'row', gap:1 }}>
                        <Tab 
                            disableIndicator
                            value={0}
                            color={tab == 0 ? 'primary' : 'neutral'}
                            variant='soft'

                            sx = {{
                                flex:1,
                                //maxWidth:300,
                                borderRadius:'md'
                            }}>
                                Schichten bearbeiten
                        </Tab>

                        <Tab
                            disableIndicator
                            value={1}
                            color={tab == 1 ? 'primary' : 'neutral'}
                            variant='soft'

                            sx = {{
                                flex:1,
                                //maxWidth:300,
                                borderRadius:'md',
                            }}>
                                Schichten zuweisen
                        </Tab>
                    </TabList>

                    <TabPanel
                        value={0}
                        sx = {{
                            display:'flex',
                            flexDirection:'column',

                            mx: -2,
                            mb: -2,
                        }}
                    >
                        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                            {serverData.scheduleEntries.map((entry) => (
                                <ScheduleEntry scheduleEntry={entry} key={entry.id} />
                            ))}
                            <AddScheduleEntry />
                        </Grid>
                    </TabPanel>

                    <TabPanel
                        value={1}
                        sx = {{
                            mx: -2,
                            mb: -2,
                        }}
                    >

                    </TabPanel>
                </Tabs>
            </Box>
        </Box>
    );
}