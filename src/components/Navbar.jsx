import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../App.css';

export const Navbar = () => {
    const [value, setValue] = React.useState(0);
    const [isSignedIn, setIsSignedIn] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsSignedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleNavigation = (index) => {
        setValue(index);
        switch (index) {
            case 0:
                navigate('/');
                break;
            case 1:
                navigate('/mainGame');
                break;
            case 2:
                navigate('/statistics');
                break;
            case 3:
                navigate('/account');
                break;
            default:
                break;
        }
    };

    if (!isSignedIn) {
        return null;
    }

    return (
        <div id='navbar'>
            <Box sx={{ width: 400 }} >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        handleNavigation(newValue);
                    }}
                >
                    <BottomNavigationAction icon={<HomeIcon />} />
                    <BottomNavigationAction icon={<SportsEsportsIcon />} />
                    <BottomNavigationAction icon={<QueryStatsIcon />} />
                    <BottomNavigationAction icon={<ManageAccountsIcon />} />
                </BottomNavigation>
            </Box>
        </div>
    );
};