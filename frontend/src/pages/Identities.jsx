import { useEffect, useState } from 'react';
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Box, Button, Card, Checkbox, IconButton, Input, Modal, ModalDialog, Sheet, Tab, Table, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Topbar from '../components/Topbar';

import { Add } from '@mui/icons-material'
import { width } from '@mui/system';

export default function() {
    const authenticate = useAuthenticate();
    const user = useUser();
    const viewport = useViewport();
    const serverData = useServerData();

    const [identityFilter, setIdentityFilter] = useState('');

    const [editData, setEditData] = useState();
    const [showEdit, setShowEdit] = useState(false);

    const [createData, setCreateData] = useState();
    const [showCreate, setShowCreate] = useState(false);

    const toggleSelection = (identity) => {
        setSelected((prevSelected) =>
            prevSelected.includes(identity)
                ? prevSelected.filter((item) => item !== identity)
                : [...prevSelected, identity]
        );
    };

    const selectAll = (identities) => {
        if (identities.every((identity) => selected.includes(identity))) {
            setSelected([]);
        } else {
            setSelected(identities);
        }
    };


    const performCreate = () => {
        setSelected([]);

        http('post', `/api/identity/new`, createData);
    }

    const performDelete = () => {
        if (selected.length == 0) { return }

        const identityIds = selected.map(identity => identity._id);
        const query = JSON.stringify({ _id: { $in: identityIds } });

        setSelected([]);

        http('post', `/api/identity/delete_many/${encodeURIComponent(query)}`, {});
    }

    const performEdit = () => {
        if (selected.length == 0) { return }

        const identityIds = selected.map(identity => identity._id);
        const query = JSON.stringify({ _id: { $in: identityIds } });

        setSelected([]);

        delete editData._id;
        http('post', `/api/identity/update_many/${encodeURIComponent(query)}`, editData);
    }

    const handleEdit = () => {
        if (selected.length == 0) { return }

        setEditData({...selected[0]});
        setShowEdit(true);
    }

    const handleCreate = () => {
        setCreateData({
            cardID: '',
        });

        setShowCreate(true);
    }

    useEffect(() => {
        authenticate();
    }, []);

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
                <Sheet sx={{
                    my:2,
                    mx:'auto',

                    borderRadius:'md',

                    width:1,
                    maxWidth:550,

                    p:2
                }}>
                    
                </Sheet>
            </Box>
        </Box>
    );
}
