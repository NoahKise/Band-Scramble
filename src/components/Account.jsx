import '../App.css'
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import SPACE from '../assets/images/SPACE.png'
import first from '../assets/images/first.png'

export const Account = () => {
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

    const doSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.log('error signing out');
        }
    };

    return (
        <>
            <div id='userInfo'>
                <p>Logged in as {username}</p>
                <button className='button' onClick={doSignOut}>Sign out</button>
            </div>
            <img id='first' src={first} alt="first"></img>
        </>
    );
}