import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'
import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Topbar from '../components/Topbar';
import { useCallback, useEffect, useState } from 'react';

export default function () {
    const serverData = useServerData();
    const http = useHttp();

    const [nameFilter, setNameFilter] = useState('');
    const [idFilter, setIdFilter] = useState('');

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
                    maxWidth: 700,

                    display: 'flex',
                    flexDirection: 'column',

                    gap: 2,
                    flexGrow: 1,

                    overflow: 'hidden',
                }}>
                    <Box sx={{display:'flex', flexDirection:'row', gap:1}}>
                        <Input fullWidth placeholder='Suche: Verkäufer Name' onChange={(e) => setNameFilter(e.target.value)} value={nameFilter}></Input>
                        <Input fullWidth placeholder='Suche: Käufer ID' onChange={(e) => setIdFilter(e.target.value)} value={idFilter}></Input>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        gap: 1,

                        flex: 1,

                        overflowY: 'auto',
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}>
                        {serverData.transactions?.filter(transaction => {
                                const sellerName = (serverData.accounts?.find(account => account._id == transaction.seller)?.name || "").toLowerCase();
                                const buyerID = String(serverData.identities?.find(identity => identity._id == transaction.buyer)?.cardID || "");

                                return (!nameFilter || sellerName.includes(nameFilter.toLowerCase())) &&
                                    (!idFilter || buyerID.includes(idFilter.toLowerCase()));
                            }).map(transaction => {

                            const buyer = serverData.identities?.find(identity=>identity._id == transaction.buyer);
                            const seller = serverData.accounts?.find(account=>account._id == transaction.seller);

                            const timestamp = new Date(String(transaction.timestamp));

                            return (
                            <Card color={(!buyer || !seller) && 'neutral' || 'primary'} variant='outlined' key={transaction._id} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                p: 2,

                                borderRadius: 'md',
                            }}>
                                <Box sx={{ display:'flex', flexDirection:'row', gap: 1, flex:1 }}>
                                    <Typography sx={{ flex:1 }} color='primary'>Verkäufer: {seller?.name}</Typography>
                                    <Typography sx={{ flex:1 }} color='primary'>Käufer: {buyer?.cardID || "-"}</Typography>
                                    <Typography color={transaction?.totalPrice > 0 && 'success' || 'danger'} sx={{ flex:1 }}>Wert: {transaction?.totalPrice} €</Typography>
                                </Box>

                                <Box sx={{ display:'flex', flexDirection:'row', gap: 1, flex:1 }}>
                                    <Typography sx={{ flex:1 }}>Lokale Zeit: {timestamp.getHours()}:{timestamp.getMinutes()}:{timestamp.getSeconds()}</Typography>
                                    <Typography sx={{ flex:1 }} color='neutral'>T: {timestamp.getTime()}</Typography>
                                    <Typography sx={{ flex:1 }} color='neutral'>{transaction?._id}</Typography>
                                </Box>
                            </Card>
                        )})}
                    </Box>
                </Sheet>
            </Box>
        </Box>
    );
}