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
    const [username, setUsername] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        const userId = user.uid;
                        const userRef = doc(db, 'users', userId);
                        const userSnapshot = await getDoc(userRef);

                        if (userSnapshot.exists()) {
                            const userData = userSnapshot.data();
                            setUsername(userData.username)
                        } else {
                            console.log("User not found!");
                        }
                    }
                });
            } catch (error) {
                console.log('error fetching user data');
            }
        };
        fetchData();
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

    return (
        <div id='navbar' style={{ display: username ? '' : 'none' }}>
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