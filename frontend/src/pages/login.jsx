import React from 'react'

import { Box, Card, Typography, Button, Input, FormControl, FormLabel, IconButton } from "@mui/joy";

import VisibilityOn from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import ReportIcon from '@mui/icons-material/Report';
import DoneIcon from '@mui/icons-material/Done';
import LoadingIcon from '@mui/icons-material/Cached';

import { useSnack } from '../contexts/SnackContext';
import SnackMessage from '../components/SnackMessage';
import { useAuth } from '../contexts/AuthContext';
import useHttp from '../hooks/useHttp';
import { useNavigate } from 'react-router-dom';

function CustomCard({sx, ...props}) {
    return (
        <Card sx = {{
            mx: 2,
            maxWidth: 400,
            width:1,

            p: 2,
            gap:2,

            ...sx
        }}>
            {props.children}
        </Card>
    );
}

export default function () {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [errors, setErrors] = React.useState({
        username: false,
        password: false
    });

    const snack = useSnack();
    const auth  = useAuth();
    const http  = useHttp();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleUsernameChange = (e) => {
        setUsername((e.target.value).toLowerCase());

        if (errors.username) {
            setErrors(prev => ({...prev, username: false}));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);

        if (errors.password) {
            setErrors(prev => ({...prev, password: false}));
        }
    };

    const handleSignIn = () => {
        let validated = [true, true, true]
        if (username.length == 0) { setErrors(prev => ({...prev, username: true})); validated[0] = false; validated[1] = false }
        if (password.length == 0) { setErrors(prev => ({...prev, password: true})); validated[0] = false; validated[2] = false }

        if (!validated[0]) {
            let errorMessage = '';
            if (!validated[1]){
                errorMessage += 'Benutzername';
            }
            if (!validated[2]){
                if (!validated[1]){ errorMessage += ' und '}

                errorMessage += 'Passwort';
            }

            snack.addSnack(
                <SnackMessage sx={{}} color='danger' endDecorator={<ReportIcon></ReportIcon>}>
                    {errorMessage + ' nicht ausgefüllt!'}
                </SnackMessage>
            );

            return;
        }

        snack.addSnack(
            <SnackMessage sx={{}} color='warning' endDecorator={<LoadingIcon></LoadingIcon>}>
                Wird Angemeldet..
            </SnackMessage>
        );

        http('post', '/action/login', {name: username, password}).then((response) => {
            auth.setUser({name: username})
            localStorage.setItem('token', response.data.token);

            snack.addSnack(
                <SnackMessage sx={{}} color='success' endDecorator={<DoneIcon></DoneIcon>}>
                    Erfolgreich Angemeldet!
                </SnackMessage>
            );

            navigate('/dashboard')
        }).catch((e) => {
            snack.addSnack(
                <SnackMessage sx={{}} color='danger' endDecorator={<ReportIcon></ReportIcon>}>
                    Falsche Eingabe!
                </SnackMessage>
            );
        })
    }

    const handleForgotData = () => {

    }

    return (
        <>
            <Box sx={{
                height:'100vh',
                width:'100vw',

                display:'flex',
                alignItems:'center',
                justifyContent:'center',

                flexDirection:'column',
                gap:2,
            }}>
                <CustomCard sx={{gap:1}}>
                    <Typography level="h4" sx={{textAlign:'center'}}>
                        Digitales Kassensystem
                    </Typography>

                    <Typography sx={{textAlign:'center'}}>
                        #Modern #RGPSMV #OneOfAKind #Crazy
                    </Typography>
                </CustomCard>

                <CustomCard>
                    <Typography level="h4">
                        Wilkommen zurück.
                    </Typography>

                    <FormControl>
                        <FormLabel>
                            <Typography color={errors.username? 'danger':'neutral'}>{errors.username? 'Benutzername *':'Benutzername'}</Typography>
                        </FormLabel>
                        <Input
                            color={errors.username? 'danger':'neutral'} 
                            fullWidth 
                            type="text" 
                            value={username} 
                            onChange={handleUsernameChange}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>
                            <Typography color={errors.password? 'danger':'neutral'}>{errors.password? 'Passwort *':'Passwort'}</Typography>
                        </FormLabel>
                        <Input
                            color={errors.password? 'danger':'neutral'}
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            endDecorator={
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword? <VisibilityOff /> : <VisibilityOn />}
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

                <CustomCard sx={{gap:1}}>
                    <Typography level="h4">
                        Danke.
                    </Typography>

                    <Typography>
                        Dieses System wurde von @Nico Stickel für die SMV des RGPs erstellt. Vielen Dank euch allen für diese Chance.
                    </Typography>
                </CustomCard>
            </Box>
        </>
    );
}