import React, { useState, useEffect } from "react";
import { TextField, Button, Link, Grid, Box, Avatar, Typography, Container, FormControlLabel, Checkbox, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

const defaultTheme = createTheme();

const CustomFileInput = ({ onChange }) => {
    return (
        <React.Fragment>
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload File
                <input type="file" style={{ display: "none" }} onChange={onChange} />
            </Button>
        </React.Fragment>
    );
};

export default function Home() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState(null);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const doSignUp = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const db = getFirestore();
            const userDocRef = doc(db, 'users', user.uid);

            if (profileImage) {
                const storage = getStorage();
                const storageRef = ref(storage, `profile_images/${user.uid}`);
                await uploadBytes(storageRef, profileImage);
                const imageUrl = await getDownloadURL(storageRef);
                await setDoc(userDocRef, { username, profileImage: imageUrl });
            } else {
                await setDoc(userDocRef, { username });
            }
            navigate('/MainGame');
        } catch (error) {
            console.log("error signing up")
        }
    };

    const doSignIn = async (e) => {
        e.preventDefault();
        const email = e.target.signinEmail.value;
        const password = e.target.signinPassword.value;

        try {
            signInWithEmailAndPassword(auth, email, password);
            navigate('/MainGame');
        } catch (error) {
            console.log("error signing in")
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
            const scoresCollection = collection(db, "score");
            const snapshot = await getDocs(scoresCollection);
            const leaderboardData = [];

            // Fetch usernames for each userId
            const userIds = snapshot.docs.map(doc => doc.id);
            const usersCollection = collection(db, "users");
            const usersSnapshot = await getDocs(usersCollection);
            const userIdToUsernameMap = {};
            usersSnapshot.forEach(doc => {
                const userId = doc.id;
                const username = doc.data().username;
                userIdToUsernameMap[userId] = username;
            });
            snapshot.forEach(doc => {
                const userId = doc.id;
                const scoreData = doc.data();
                const username = userIdToUsernameMap[userId] || "Unknown"; // Default to "Unknown" if username not found
                leaderboardData.push({ username, ...scoreData });
            });
            leaderboardData.sort((a, b) => b.score - a.score);
            setLeaderboard(leaderboardData);
        };

        fetchLeaderboard();
    }, []);

    return (
        <>
            {userId ? (
                <>
                    <div id="leaderboard">
                        <h1>LEADERBOARD</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Username</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{entry.username}</td>
                                        <td>{entry.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Avatar id='avatar' sx={{ m: 1, bgcolor: "secondary.main" }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography id="signInH1" component="h1" variant="h5">
                                {showSignUp ? "Sign Up" : "Sign In"}
                            </Typography>
                            <Box component="form" onSubmit={showSignUp ? doSignUp : doSignIn} noValidate sx={{ mt: 1 }}>
                                {showSignUp && (
                                    <>
                                        <TextField type='text' name='email' placeholder='Email' fullWidth />
                                        <TextField type="text" name="username" placeholder="Username" fullWidth />
                                        <TextField minLength="6" type="password" name="password" placeholder="Password" fullWidth />
                                        <br />
                                        Profile Image:
                                        <br />
                                        <CustomFileInput onChange={handleImageChange} />
                                        <br />
                                    </>
                                )}
                                {!showSignUp && (
                                    <>
                                        <TextField margin="normal" required fullWidth id="signinEmail" label="Email Address" name="signinEmail" autoComplete="email" autoFocus />
                                        <TextField margin="normal" required fullWidth name="signinPassword" label="Password" type="password" id="signinPassword" autoComplete="current-password" />
                                    </>
                                )}
                                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    {showSignUp ? "Sign Up" : "Sign In"}
                                </Button>
                                <Grid container>
                                    <Grid item xs>
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
                                    <Grid item>
                                        <Link href="#" variant="body2" onClick={() => setShowSignUp(!showSignUp)}>
                                            {showSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            )}
        </>
    );
}