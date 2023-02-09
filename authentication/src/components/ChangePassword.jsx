import { useState, useContext } from "react";
import axios from 'axios';
import { GlobalContext } from '../context/context';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route, Link, Navigate } from "react-router-dom";


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();


function ChangenewPassword() {

    let { state, dispatch } = useContext(GlobalContext);
    const [result, setResult] = useState("")
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            currentnewPassword: data.get('currentnewPassword'),
            newPassword: data.get('newPassword'),
        });
    };

    const proceedChangePassword = async (e) => {

        e.preventDefault();

        try {
            let response = await axios.post(`${state.baseUrl}/change-password`, {
                currentPassword: currentPassword,
                newPassword: newPassword
            }, {
                withCredentials: true
            })
            // toast('Login Succuesful ', {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     });

            console.log("Login  successful");
            setResult("password change sucessfully")

            e.reset()
        }
        catch (err) {
            console.log("err: ", err);
            // toast.error('Error', {
            //     position: "top-center",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     });
        }



    }



    return (
        <>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Change newPassword
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="curentPassword"
                                type="Password"
                                label="Current Password"
                                name="currentPassword"
                                autoComplete="Password"
                                autoFocus
                                onChange={(e) => {
                                    setcurrentPassword(e.target.value)
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="newPassword"
                                label="newPassword"
                                type="newPassword"
                                id="newPassword"
                                autoComplete="newPassword"
                                onChange={(e) => {
                                    setnewPassword(e.target.value)
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="newPassword"
                                label="newPassword"
                                type="newPassword"
                                id="confirmnewPassword"
                                autoComplete="current-newPassword"
                                onChange={(e) => {
                                    setnewPassword(e.target.value)
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={proceedChangePassword}
                            >
                                Change newPassword
                            </Button>
                        </Box>
                    </Box>
                    {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
                </Container>
            </ThemeProvider>
        </>



    );
}

export default ChangenewPassword;
