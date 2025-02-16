import { useEffect } from 'react';
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Box } from "@mui/joy";
import Topbar from '../components/Topbar';

export default function() {
    const authenticate = useAuthenticate();
    const user = useUser();

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <Box
            sx={{
                height: 1,
                width: 1,
            }}
        >
            <Topbar />
        </Box>
    );
}
