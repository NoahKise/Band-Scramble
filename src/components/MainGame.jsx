import { Data } from '../Data';
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import '../App.css';

const MainGame = () => {
    const [artist, setArtist] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [mixedString, setMixedString] = useState("");
    const [resetClicked, setResetClicked] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        setUserId(user.uid || '');
                        console.log(user.uid);
                    }
                });
            } catch (error) {
                console.log("error fetching current user")
            }
        };

        checkCurrentUser();
    }, []);

    useEffect(() => {
        const fetchScore = async () => {
            if (userId) {
                const scoreDoc = await getDoc(doc(db, "score", userId));
                if (scoreDoc.exists()) {
                    const userData = scoreDoc.data();
                    setScore(userData.score);
                    console.log("score found")
                } else {
                    console.log("score not found")
                }
            }
        };
        fetchScore();
    }, [userId]);

    useEffect(() => {
        const updateScore = async () => {
            if (userId) {
                await setDoc(doc(db, "score", userId), { score });
            }
        };
        updateScore();
    }, [score]);

    const RandomArtist = useCallback(() => {
        const index = Math.floor(Math.random() * Data.length);
        const newArtist = Data[index];
        setArtist(newArtist);
        setRevealed(false);
        setMixedString(ScrambledString(newArtist));
        setResetClicked(false);
        setTimeLeft(newArtist.length * 3);
        document.getElementById("guess").value = "";
    }, []);

    useEffect(() => {
        RandomArtist();
    }, [RandomArtist]);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        if (timeLeft === 0) {
            revealArtist();
            setResetClicked(true);
            clearInterval(timerInterval);
        } else if (revealed) {
            clearInterval(timerInterval);
        }
        return () => clearInterval(timerInterval);
    }, [revealed, timeLeft]);

    const GameBoard = (string) => {
        let outputArray = [];
        const splitString = string.split('');
        for (let i = 0; i < splitString.length; i++) {
            if (splitString[i] === " ") {
                outputArray.push(" ");
            } else {
                outputArray.push("-");
            }
        }
        return outputArray.join('');
    }

    function ScrambledString(string) {
        let stringWithoutSpaces = string.replace(/\s/g, '');
        let characters = stringWithoutSpaces.split('');
        for (let i = characters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [characters[i], characters[j]] = [characters[j], characters[i]];
        }
        return characters.join('');
    }

    const revealArtist = () => {
        setRevealed(true);
    }

    const scramble = () => {
        setMixedString(ScrambledString(artist));
    }

    const revealOrReset = () => {
        if (resetClicked) {
            RandomArtist();
        } else {
            revealArtist();
        }
        setResetClicked(!resetClicked);
    }

    const buttonLabel = revealed ? "Next Level" : "Reveal";

    const makeGuess = () => {
        let guess = document.getElementById("guess").value;
        let formattedGuess = guess.toUpperCase();
        let trimmedGuess = formattedGuess.trim();
        if (trimmedGuess === artist) {
            console.log("correct");
            if (revealed === false) {
                setScore(score + (mixedString.length + timeLeft) * 10);
            }
            setRevealed(true);
            setResetClicked(true);
        } else {
            console.log("try again");
        };
    };

    return (
        <div className="App">
            <img src='https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' alt='nirvana' style={{ filter: revealed ? "none" : "blur(15px)" }} id='gameImage' />
            <br></br>
            <input
                type='text'
                id='guess'
                autoComplete='off'
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && revealed === true) {
                        revealOrReset();
                    } else if (e.key === 'Enter' && e.shiftKey) {
                        scramble();
                    } else if (e.key === 'Enter') {
                        makeGuess();
                    }
                }}
            >
            </input>
            <button id='guessButton' onClick={makeGuess}>Check Answer</button>
            <p>Seconds Remaining: {timeLeft}</p>
            <h1>{GameBoard(artist)}</h1>
            <h1>{revealed ? artist : mixedString || ScrambledString(artist)}</h1>
            <button id='reveal' onClick={revealOrReset}>{buttonLabel}</button>
            <button id='rescramble' onClick={scramble}>Scramble</button>
            <h3>Score: {score}</h3>

        </div>
    );
}

export default MainGame;