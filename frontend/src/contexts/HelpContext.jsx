import { createContext, useContext, useState, useEffect } from "react";
import { useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Drawer, Box, Typography, Card, IconButton, Divider, Button, Table, CardActions, Modal, ModalDialog, Input, Textarea } from '@mui/joy'

const HelpContext = createContext(null);

export function HelpProvider({ children }) {
    const serverData = useServerData();
    const user = useUser();
    const viewport = useViewport();
    const message = useMessage();

    useEffect(() => {
        if (serverData?.eventSource) {
            const handleHelpRequest = (event) => {
                try {
                    const data = JSON.parse(event.data);
    
                    if (data.userID != user.current?._id) {
                        message.write(`${serverData.accounts?.find(account => account._id == data.userID)?.name} benötigt Hilfe!`, 'help', -1, ({ handleClose }) => {
                            return (
                                <ModalDialog>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Typography level='h4' sx={{ textAlign: 'left' }} color="danger">
                                            Hilferuf:
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap:1 }}>
                                                <Typography sx={{ flex: 1 }}>Account:</Typography>
                                                <Typography sx={{ flex: 1 }}>{serverData.accounts?.find(account => account._id == data.userID)?.name}</Typography>
                                            </Box>
    
                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap:1 }}>
                                                <Typography sx={{ flex: 1 }}>Schicht:</Typography>
                                                <Typography sx={{ flex: 1 }}>{serverData.accounts?.find(account => account._id == data.userID)?.name}</Typography>
                                            </Box>
                                        </Box>
    
                                        <Box>
                                            <Typography sx={{ textAlign: 'left', maxWidth: 300 }}>
                                                {data.message}
                                            </Typography>
                                        </Box>
                                    </Box>
    
                                    <CardActions>
                                        <Button onClick={handleClose} variant='soft' color='danger'>
                                            OK
                                        </Button>
                                    </CardActions>
                                </ModalDialog>
                            )
                        });
                    }
                } catch {}
            }
    
            serverData.eventSource.addEventListener("help", handleHelpRequest)
    
            return () => {
                serverData.eventSource.removeEventListener("help", handleHelpRequest);
            };
        }
    }, [serverData.eventSource, user.current]);

    return (
        <HelpContext.Provider value={{}}>
            {children}
        </HelpContext.Provider>
    );
}