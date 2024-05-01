import '../App.css'
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import avatar1 from '../assets/images/avatar1.png'
import avatar2 from '../assets/images/avatar2.png'
import avatar3 from '../assets/images/avatar3.png'
import avatar4 from '../assets/images/avatar4.png'
import avatar5 from '../assets/images/avatar5.png'
import avatar6 from '../assets/images/avatar6.png'
import avatar7 from '../assets/images/avatar7.png'
import avatar8 from '../assets/images/avatar8.png'
import avatar9 from '../assets/images/avatar9.png'
import editIcon from '../assets/images/editIcon.svg'

export const Account = () => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [soundSetting, setSoundSetting] = useState(false);
    const [avatarId, setAvatarId] = useState(8);
    const [avatarSelectClicked, setAvatarSelectClicked] = useState(false);
    const [avatarSelectOpen, setAvatarSelectOpen] = useState(false);
    const [artistSpotlight, setArtistSpotlight] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState('');
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
        const fetchAvatarId = async () => {
            if (userId) {
                const avatarIdDoc = await getDoc(doc(db, "avatarId", userId));
                if (avatarIdDoc.exists()) {
                    const userData = avatarIdDoc.data();
                    setAvatarId(userData.avatarId);
                } else {
                    console.log("avatar ID not found")
                }
            }
        };
        fetchAvatarId();
    }, [userId]);

    useEffect(() => {
        const fetchArtistSpotlight = async () => {
            if (userId) {
                const artistSpotlightDoc = await getDoc(doc(db, "artistSpotlight", userId));
                if (artistSpotlightDoc.exists()) {
                    const userData = artistSpotlightDoc.data();
                    setArtistSpotlight(userData.artistSpotlight);
                } else {
                    console.log("artist spotlight not found")
                }
            }
        };
        fetchArtistSpotlight();
    }, [userId]);

    useEffect(() => {
        const updateArtistSpotlight = async () => {
            if (userId) {
                await setDoc(doc(db, "artistSpotlight", userId), { artistSpotlight });
            }
        };
        updateArtistSpotlight();
    }, [artistSpotlight]);

    useEffect(() => {
        const updateAvatarId = async () => {
            if (userId) {
                await setDoc(doc(db, "avatarId", userId), { avatarId });
            }
        };
        updateAvatarId();
    }, [avatarId]);

    useEffect(() => {
        const updateSoundSetting = async () => {
            if (userId) {
                await setDoc(doc(db, "soundSetting", userId), { soundSetting });
            }
        };
        updateSoundSetting();
    }, [soundSetting]);

    const handleArtistSpotlightChange = () => {
        const input = document.getElementById('artistSpotlightInput');
        setArtistSpotlight(input.value);
        setConfirmationMessage("Changes saved successfully!");
    }

    const handleSoundSettingChange = async (event) => {
        const newValue = event.target.checked ? true : false;
        setSoundSetting(newValue);
    };

    const handleAvatarChange = (event) => {
        const selectedAvatar = event.target.value;
        setAvatarId(selectedAvatar);
    };

    const toggleAvatarSelect = () => {
        setAvatarSelectClicked(true);
        if (!avatarSelectOpen) {
            setAvatarSelectOpen(true);
        } else {
            setAvatarSelectOpen(false);
        }
    }

    const doSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.log('error signing out');
        }
    };

    const avatarImages = {
        1: avatar1,
        2: avatar2,
        3: avatar3,
        4: avatar4,
        5: avatar5,
        6: avatar6,
        7: avatar7,
        8: avatar8,
        9: avatar9,
    };


    return (
        <>
            <div id='userInfo'>
                <button id='signOutButton' className='button' onClick={doSignOut}>Sign out</button>
                <img id='avatarPic' src={avatarImages[avatarId]} alt='avatar' />
                <h1>{username}</h1>
                <div id='avatarButtonDiv' onClick={toggleAvatarSelect}>
                    <img src={editIcon} id='avatarEditButton' alt='edit icon' />
                </div>
            </div>
            <div id='artistSpotlightDiv'>
                <h2>Artist Spotlight</h2>
                <input type='text' id='artistSpotlightInput' defaultValue={artistSpotlight} maxLength='30'></input>
                <button id='artistSpotlightButton' onClick={handleArtistSpotlightChange}>Save Changes</button>
                <p>{confirmationMessage}</p>
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
            <div
                id='avatarSelect'
                className={`animate__animated ${avatarSelectOpen ? 'animate__fadeInDown' : 'animate__fadeOutUp'}`}
                style={{ display: avatarSelectClicked ? '' : 'none' }}>
                <button id='avatarSelectCloseButton' onClick={toggleAvatarSelect}>X</button>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar1" name="avatar" value="1" onChange={handleAvatarChange} />
                    <label htmlFor="avatar1">
                        <img className='avatarPreview' src={avatar1} alt='avatar1' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar2" name="avatar" value="2" onChange={handleAvatarChange} />
                    <label htmlFor="avatar2">
                        <img className='avatarPreview' src={avatar2} alt='avatar2' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar3" name="avatar" value="3" onChange={handleAvatarChange} />
                    <label htmlFor="avatar3">
                        <img className='avatarPreview' src={avatar3} alt='avatar3' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar4" name="avatar" value="4" onChange={handleAvatarChange} />
                    <label htmlFor="avatar4">
                        <img className='avatarPreview' src={avatar4} alt='avatar4' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar5" name="avatar" value="5" onChange={handleAvatarChange} />
                    <label htmlFor="avatar5">
                        <img className='avatarPreview' src={avatar5} alt='avatar5' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar6" name="avatar" value="6" onChange={handleAvatarChange} />
                    <label htmlFor="avatar6">
                        <img className='avatarPreview' src={avatar6} alt='avatar6' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar7" name="avatar" value="7" onChange={handleAvatarChange} />
                    <label htmlFor="avatar7">
                        <img className='avatarPreview' src={avatar7} alt='avatar7' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar8" name="avatar" value="8" onChange={handleAvatarChange} />
                    <label htmlFor="avatar8">
                        <img className='avatarPreview' src={avatar8} alt='avatar8' />
                    </label>
                </div>
                <div className='radioPair'>
                    <input className='radio' type="radio" id="avatar9" name="avatar" value="9" onChange={handleAvatarChange} />
                    <label htmlFor="avatar9">
                        <img className='avatarPreview' src={avatar9} alt='avatar9' />
                    </label>
                </div>
            </div>
        </>
    );
}