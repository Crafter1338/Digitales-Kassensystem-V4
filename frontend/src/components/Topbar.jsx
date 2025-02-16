import { Box, Card, Typography, Button, Sheet, IconButton } from "@mui/joy";
import { Menu } from '@mui/icons-material';

import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

export default function() {
    const sidebar = useSidebar();
    const user    = useUser();
    const message = useMessage();

    return (
        <Sheet
            sx={{
                width: 1,
                display: 'flex',
                p: 2,

                justifyContent: 'space-between',
                alignItems: 'center',

                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                boxShadow: 'md',
            }}
        >
            {/* Left side */}
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={sidebar.show}>
                    <Menu />
                </IconButton>

                <Typography
                    level="h4"
                    sx={{
                        display: { xs: 'none', sm: 'block' }, // Hide on small screens
                    }}
                >
                    SMV Kassensystem
                </Typography>

                <Typography
                    level="h4"
                    sx={{
                        display: { xs: 'block', sm: 'none' }, // Show on small screens
                    }}
                >
                    SMV
                </Typography>

                <Typography
                    sx={{
                        display: { xs: 'none', sm: 'block' }, // Show on larger screens
                    }}
                >
                    @Nico Stickel
                </Typography>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {user.current?.name && (
                        <Typography level="body-md" textAlign="right">
                            {user.current.name}
                        </Typography>
                    )}
                </Box>

                <Button variant="soft" color="primary" size="sm" onClick={() => {user.abandon(); message.write('Erfolgreich abgemeldet', 'success', 2500)}}>
                    Abmelden
                </Button>
            </Box>
        </Sheet>
    );
}