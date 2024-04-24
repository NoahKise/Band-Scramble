import '../App.css'
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import SPACE from '../assets/images/SPACE.png'
import first from '../assets/images/first.png'

// import puppeteer from 'puppeteer';

export const Account = () => {
    const [username, setUsername] = useState('');
    const [bioText, setBioText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        const userId = user.uid;
                        const userRef = doc(db, 'users', userId);
                        const userSnapshot = await getDoc(userRef);
                        // scrapeBio();
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

    // const scrapeBio = async () => {
    //     const url = 'https://www.deezer.com/us/artist/1676/biography';
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();
    //     await page.goto(url);

    //     const bio = await page.evaluate(() => {
    //         const p = document.querySelectorAll('p');
    //         console.log(p);
    //     });
    // };

    return (
        <>
            <div id='userInfo'>
                <p>Logged in as {username}</p>
                <button className='button' onClick={doSignOut}>Sign out</button>
            </div>
        </>
    );
}