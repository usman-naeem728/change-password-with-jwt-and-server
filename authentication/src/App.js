import './App.css';
import * as React from 'react';
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from './context/context';
import { Routes, Route, Link, Navigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import axios from 'axios'
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/home';
import Products from './components/products';





function App() {




  let { state, dispatch } = useContext(GlobalContext);
  const [auth, setAuth] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async () => {
    try {
      let response = await axios.post(`${state.baseUrl}/logout`, {
        withCredentials: true
      })
      console.log("response: ", response);

      dispatch({
        type: 'USER_LOGOUT'
      })
    } catch (error) {
      console.log("axios error: ", error);
    }

  }

  useEffect(() => {



    const getProfile = async () => {

      try {
        let response = await axios.get(`${state.baseUrl}/profile`, {
          withCredentials: true,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        })

        console.log("response: ", response);

        dispatch({
          type: 'USER_LOGIN',
          payload: response.data
        })
      } catch (error) {

        console.log("axios error: ", error);

        dispatch({
          type: 'USER_LOGOUT'
        })
      }



    }
    getProfile();

  }, [])






  return (
    <>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            {/* <ButtonGroup variant="contained" aria-label="outlined primary button group"> */}
            <Stack spacing={4} direction="row">
              {
                (state.isLogin === true) ?
                  <>
                    <Link to={`/`} ><Button variant="contained">Home</Button></Link>
                    <Link to={`/products`} ><Button variant="contained"> Products</Button></Link>
                  </>
                  :
                  null
              }
              {
                (state.isLogin === false) ?
                  <>
                    <Link to={`/`} ><Button variant="contained">Signin</Button></Link>
                    <Link to={`/signup`} ><Button variant="contained">Signup</Button></Link>
                  </>
                  :
                  null
              }
            </Stack>
            {/* </ButtonGroup> */}
            {(state.isLogin === true) ?
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>{state.user.firstName} {state.user.lastName}</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>
              </div>
              :
              null
            }

          </Toolbar>
        </AppBar>
      </Box>

      {(state.isLogin === true) ?

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
        :
        null
      }

      {(state.isLogin === false) ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="Signup" element={<Signup />} />
        </Routes> :
        null
      }

      {(state.isLogin === null) ?

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '100vh' }}>
          <h1>Loading</h1>
        </div>

        : null}




    </>
  );
}

export default App;
