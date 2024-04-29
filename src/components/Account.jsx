import '../App.css'
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import wood from '../assets/images/wood.jpg'
import avatar1 from '../assets/images/avatar1.png'
import avatar2 from '../assets/images/avatar2.png'
import avatar3 from '../assets/images/avatar3.png'
import avatar4 from '../assets/images/avatar4.png'
import avatar5 from '../assets/images/avatar5.png'
import avatar6 from '../assets/images/avatar6.png'
import avatar7 from '../assets/images/avatar7.png'
import avatar8 from '../assets/images/avatar8.png'
import avatar9 from '../assets/images/avatar9.png'

export const Account = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [soundSetting, setSoundSetting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        const userId = user.uid;
                        setUserId(user.uid || '');
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

    useEffect(() => {
        const fetchSoundSetting = async () => {
            if (userId) {
                const soundSettingDoc = await getDoc(doc(db, "soundSetting", userId));
                if (soundSettingDoc.exists()) {
                    const userData = soundSettingDoc.data();
                    setSoundSetting(userData.soundSetting);
                } else {
                    console.log("sound setting not found")
                }
            }
        };
        fetchSoundSetting();
    }, [userId]);

    useEffect(() => {
        const updateSoundSetting = async () => {
            if (userId) {
                await setDoc(doc(db, "soundSetting", userId), { soundSetting });
            }
        };
        updateSoundSetting();
    }, [soundSetting]);

    const handleSoundSettingChange = async (event) => {
        const newValue = event.target.checked ? true : false;
        setSoundSetting(newValue);
    };

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
            <button id='signOutButton' className='button' onClick={doSignOut}>Sign out</button>
            <div id='userInfo'>
                <img id='avatarPic' src={wood} alt='avatar' />
                <h1>{username}</h1>
            </div>
            <div id="soundToggle">
                <h2>Game Sounds</h2>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={soundSetting}
                        onChange={handleSoundSettingChange}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            <div id='avatarSelect'>
                <input type="radio" id="huey" name="drone" value="huey" />
                <label for="huey">Huey</label>
            </div>
        </>
    );
}