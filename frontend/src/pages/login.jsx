import { useEffect, useState } from 'react';
import { useSidebar, useServerData, useMessage, useUser, useViewport, useHttp, useAuthenticate } from '../Hooks'

import { Box, Card, Typography, FormControl, FormLabel, Input, IconButton, Button } from "@mui/joy";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

function CustomCard({sx, ...props}) {
    return (
        <Card sx = {{
            mx: 'auto',
            maxWidth: 450,
            width:1,

            p: 2,
            gap:2,

            ...sx
        }}>
            {props.children}
        </Card>
    );
}

export default function() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [mistakes, setMistakes] = useState({
        username: false,
        password: false
    });

    const user = useUser();
    const navigate = useNavigate();
    const http = useHttp();
    const message = useMessage();
    const authenticate = useAuthenticate();

    const handleUsernameChange = (e) => {
        setUsername((e.target.value).toLowerCase());

        if (mistakes.username) {
            setMistakes(prev => ({...prev, username: false}));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

        if (mistakes.password) {
            setMistakes(prev => ({...prev, password: false}));
        }
    };

    const handleSignIn = () => {
        let validated = [true, true, true]
        if (username.length == 0) { setMistakes(prev => ({...prev, username: true})); validated[0] = false; validated[1] = false }
        if (password.length == 0) { setMistakes(prev => ({...prev, password: true})); validated[0] = false; validated[2] = false }

        if (!validated[0]) {
            let errorMessage = '';

            if (!validated[1]){
                errorMessage += 'Benutzername';
            }

            if (!validated[2]){
                if (!validated[1]){ errorMessage += ' und '}

                errorMessage += 'Passwort';
            }

            message.write(errorMessage + ' nicht ausgefüllt', 'danger', 2500);

            return;
        }

        message.write('Wird angemeldet...', 'warning', 1500);

        http('post', '/action/login', {name: username, password}).then((response) => {
            localStorage.setItem('token', response.data.token);
            user.use(username);

            message.write('Erfolgreich angemeldet', 'success', 2500);

            navigate('/dashboard')
        }).catch((e) => {
            console.log(e);
            message.write('Falsche Eingabe', 'danger', 2500);
        })
    }

    const handleForgotData = () => {

    }

    useEffect(() => {
        authenticate().then(() => navigate('dashboard'));
    }, []);

    return (
        <Box sx={{
            height:1,
            width:1,

            display:'flex',

            flexDirection:'column',

            overflowY: 'auto',
            "::-webkit-scrollbar": {
                display: 'none'
            },

            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
        }}>
            <Box sx={{
                my: 'auto',
                px:2,
                display:'flex',

                flexDirection:'column',
                gap:2,
            }}>
                <CustomCard sx={{gap:1, mt: 2}}>
                    <Typography level="h4" sx={{textAlign:'center'}}>
                        Digitales Kassensystem
                    </Typography>

                    <Typography sx={{textAlign:'center'}}>
                        #RGPOnTop #RGPSMV #MadeWithLove
                    </Typography>
                </CustomCard>

                <CustomCard>
                    <Typography level="h4">
                        Wilkommen:
                    </Typography>

                    <FormControl>
                        <FormLabel>
                            <Typography color={mistakes.username? 'danger':'neutral'}>{mistakes.username? 'Benutzername *':'Benutzername'}</Typography>
                        </FormLabel>
                        <Input
                            color={mistakes.username? 'danger':'neutral'} 
                            fullWidth 
                            type="text" 
                            value={username} 
                            onChange={handleUsernameChange}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            <Typography color={mistakes.password? 'danger':'neutral'}>{mistakes.password? 'Passwort *':'Passwort'}</Typography>
                        </FormLabel>
                        <Input
                            color={mistakes.password? 'danger':'neutral'}
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            endDecorator={
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            }
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </FormControl>

                    <Box sx = {{
                        display: 'flex',
                        flexDirection:'row',
                        gap:2,
                    }}>
                        
                        <Button fullWidth variant="soft" color="primary" onClick={handleSignIn}>
                            Anmelden
                        </Button>
                        
                        {
                        /*<Button fullWidth variant="soft" color="danger" onClick={handleForgotData}>
                            Daten vergessen
                        </Button>*/
                        }
                    </Box>
                </CustomCard>

                <CustomCard sx={{gap:1, mb: 2}}>
                    <Typography level="h4">
                        Danke.
                    </Typography>

                    <Typography>
                        Dieses System wurde von @Nico Stickel für die SMV des RGPs erstellt. Vielen Dank euch allen für diese Chance.
                    </Typography>
                </CustomCard>
            </Box>
        </Box>
    );
}