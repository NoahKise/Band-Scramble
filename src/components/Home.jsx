import React, { useState, useEffect } from "react";
import { TextField, Button, Link, Grid, Box, Typography, Container, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import avatar1 from '../assets/images/avatar1.png'
import avatar2 from '../assets/images/avatar2.png'
import avatar3 from '../assets/images/avatar3.png'
import avatar4 from '../assets/images/avatar4.png'
import avatar5 from '../assets/images/avatar5.png'
import avatar6 from '../assets/images/avatar6.png'
import avatar7 from '../assets/images/avatar7.png'
import avatar8 from '../assets/images/avatar8.png'
import avatar9 from '../assets/images/avatar9.png'
import PLACEHOLDER from '../assets/images/PLACEHOLDER.png'
import logo from '../assets/images/logo.png'
import S from '../assets/images/S.png'
import I from '../assets/images/I.png'
import G from '../assets/images/G.png'
import N from '../assets/images/N.png'
import SPACE from '../assets/images/SPACE.png'

const defaultTheme = createTheme();

export default function Home() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [enterred, setEnterred] = useState(false);
    const navigate = useNavigate();

    const doSignUp = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;

        try {
            const db = getFirestore();
            const usersCollection = collection(db, 'users');
            const querySnapshot = await getDocs(query(usersCollection, where("username", "==", username)));

            if (!querySnapshot.empty) {
                setErrorMessage("Username already exists. Please choose a different username.");
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { username });
            navigate('/MainGame');
        } catch (error) {
            setErrorMessage("Error signing up. Perhaps you already have an account? Passwords must be a minimum of 6 characters in length");
        }
    };

    const doSignIn = async (e) => {
        e.preventDefault();
        const email = e.target.signinEmail.value;
        const password = e.target.signinPassword.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/MainGame');
        } catch (error) {
            if (error.code === 'auth/invalid-login-credentials') {
                setErrorMessage("Invalid email or password. Please try again.");
            } else {
                console.error("Error signing in:", error.message);
                setErrorMessage(error.message);
            }
        }
    };

    const doPasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetSuccess("Password reset email sent. Check your inbox!");
        } catch (error) {
            setResetSuccess(`Error sending reset email: ${error.message}`);
        }
    };

    const handleForgotPassword = () => {
        setForgotPassword(!forgotPassword);
    };

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        setUserId(user.uid || '');
                    }
                });
            } catch (error) {
                console.log("error fetching current user")
            }
        };

        checkCurrentUser();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const scoresCollection = collection(db, "score");
                const avatarIdsCollection = collection(db, "avatarId");
                const artistSpotlightsCollection = collection(db, "artistSpotlight");
                const snapshot = await getDocs(scoresCollection);
                const avatarIdSnapshot = await getDocs(avatarIdsCollection);
                const artistSpotlightSnapshot = await getDocs(artistSpotlightsCollection);
                const leaderboardData = [];

                const userIdToUsernameMap = {};
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                usersSnapshot.forEach(doc => {
                    const userId = doc.id;
                    const username = doc.data().username;
                    userIdToUsernameMap[userId] = username;
                });

                const avatarIdMap = {};
                avatarIdSnapshot.forEach(doc => {
                    const userId = doc.id;
                    const avatarId = doc.data().avatarId;
                    avatarIdMap[userId] = avatarId;
                });

                const artistSpotlightMap = {};
                artistSpotlightSnapshot.forEach(doc => {
                    const userId = doc.id;
                    const artistSpotlight = doc.data().artistSpotlight;
                    artistSpotlightMap[userId] = artistSpotlight;
                });

                snapshot.forEach(doc => {
                    const userId = doc.id;
                    const scoreData = doc.data();
                    const username = userIdToUsernameMap[userId] || "Unknown";
                    const avatarId = avatarIdMap[userId] || null;
                    const artistSpotlight = artistSpotlightMap[userId] || null;
                    leaderboardData.push({ username, avatarId, artistSpotlight, ...scoreData });
                });

                leaderboardData.sort((a, b) => b.score - a.score);
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

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
        10: PLACEHOLDER,
    };

    const enter = () => {
        setEnterred(true);
    }

    return (
        <>
            {userId ? (
                <>
                    <div id="leaderboard">
                        <h1>LEADERBOARD</h1>
                        <table id="scoreTable">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Score</th>
                                    <th>Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <img
                                                    src={entry.avatarId ? avatarImages[entry.avatarId] : avatarImages[10]}
                                                    alt={`Avatar for ${entry.username}`}
                                                    className="leaderboardAvatar"
                                                />
                                                <div className="leaderboardNameGroup">
                                                    <p className="leaderboardUsername">{entry.username}</p>
                                                    <p className="leaderboardArtistSpotlight" style={{ padding: entry.artistSpotlight ? '3px' : '' }}>{entry.artistSpotlight ? entry.artistSpotlight : ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="leaderboardScore">{entry.score}</td>
                                        <td className="rank">{index + 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : enterred ? (
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box id='signInBox' sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div id='signInTiles'>
                                <img className='downLetter' src={S} alt='S' />
                                <img src={I} alt='I' />
                                <img className='downLetter' src={G} alt='G' />
                                <img src={N} alt='N' />
                                <img style={{ display: 'inline-block', opacity: '0' }} src={SPACE} alt='SPACE' />
                                <img src={I} alt='I' />
                                <img className='downLetter' src={N} alt='N' />
                            </div>
                            <Box component="form" onSubmit={showSignUp ? doSignUp : doSignIn} noValidate sx={{ mt: 1 }}>
                                {showSignUp && (
                                    <>
                                        <TextField type='text' name='email' placeholder='Email' fullWidth />
                                        <TextField inputProps={{ maxLength: 20 }} id="usernameInput" type="text" name="username" placeholder="Username" fullWidth />
                                        <TextField type="password" name="password" placeholder="Password" fullWidth />
                                    </>
                                )}
                                {!showSignUp && (
                                    <>
                                        <TextField margin="normal" required fullWidth id="signinEmail" label="Email Address" name="signinEmail" autoComplete="email" autoFocus />
                                        <TextField margin="normal" required fullWidth name="signinPassword" label="Password" type="password" id="signinPassword" autoComplete="current-password" />
                                    </>
                                )}
                                {errorMessage && <Typography variant="subtitle2" color="error">{errorMessage}</Typography>}
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    {showSignUp ? "Sign Up" : "Sign In"}
                                </Button>
                                <Grid container>

                                    <Grid item id='signUp'>
                                        <Link href="#" variant="body2" onClick={() => setShowSignUp(!showSignUp)}>
                                            {showSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        {forgotPassword ? (
                                            <>
                                                <TextField type="text" name="resetEmail" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                                <br />
                                                <Button type="button" variant="contained" onClick={doPasswordReset}>
                                                    Reset Password
                                                </Button>
                                                {resetSuccess && <p>{resetSuccess}</p>}
                                            </>
                                        ) : (
                                            <Link href="#" variant="body2" onClick={handleForgotPassword}>
                                                Forgot password?
                                            </Link>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            ) : (
                <>
                    <div id="logoAndEnterButton">
                        <img className='animate_animated animate__heartBeat' id="logo" src={logo} alt="band scramble logo" />
                        <button id="enterButton" className="button-53" onClick={enter}>Enter</button>
                    </div>
                    <a id="githubLink" href="https://github.com/NoahKise/Band-Scramble" target="_blank" rel="noopener noreferrer">Created by Noah Kise</a>
                </>
            )}
        </>
    );
}