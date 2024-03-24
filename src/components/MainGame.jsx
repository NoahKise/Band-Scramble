import { Data } from '../Data';
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
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
    const [gameStarted, setGameStarted] = useState(false);
    const [imageURL, setImageUrl] = useState('');
    const [guessedArtists, setGuessedArtists] = useState([]);

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
        const fetchScore = async () => {
            if (userId) {
                const scoreDoc = await getDoc(doc(db, "score", userId));
                if (scoreDoc.exists()) {
                    const userData = scoreDoc.data();
                    setScore(userData.score);
                } else {
                    console.log("score not found")
                }
            }
        };
        fetchScore();
    }, [userId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (userId) {
                const historyDoc = await getDoc(doc(db, "guessedArtists", userId));
                if (historyDoc.exists()) {
                    const userData = historyDoc.data();
                    setGuessedArtists(userData.artists);
                } else {
                    console.log("score not found")
                }
            }
        };
        fetchHistory();
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
        Discogs(newArtist);
        setArtist(newArtist);
        setRevealed(false);
        setMixedString(ScrambledString(newArtist));
        setResetClicked(false);
        setTimeLeft(newArtist.length * 3);
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
        setScore(score - mixedString.length * 10);
        updateGuessedArtists(false);
        setRevealed(true);
    }

    const scramble = () => {
        setMixedString(ScrambledString(artist));
    }

    const revealOrReset = () => {
        if (resetClicked) {
            document.getElementById("guess").value = "";
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
            if (revealed === false) {
                setScore(score + (mixedString.length + timeLeft) * 10);
            }
            setRevealed(true);
            setResetClicked(true);
            updateGuessedArtists(true);
        }
    };

    const startGame = () => {
        setGameStarted(true);
    };

    const Discogs = async (bandName) => {
        try {
            const response = await fetch(`https://api.discogs.com/database/search?q=${bandName}&type=artist&key=bftHJbsZWhaQDOurHzfZ&secret=bHndDwKStHlMhuQcLSHqrWbaePvoZQPm`);
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            const jsonifiedresponse = await response.json();
            let url = jsonifiedresponse.results[0].cover_image;
            setImageUrl(url);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const updateGuessedArtists = async (boolean) => {
        if (userId) {
            const userDocRef = doc(db, "guessedArtists", userId);
            const userDoc = await getDoc(userDocRef);
            let flux = 0;
            if (boolean === true) {
                flux += (mixedString.length + timeLeft) * 10;
            } else {
                flux -= mixedString.length * 10;
            }
            let updatedArtists = [...guessedArtists, { artist, correct: boolean, scoreChange: flux, totalScore: score + flux, timestamp: Date.now() }];
            if (userDoc.exists()) {
                await updateDoc(userDocRef, { artists: updatedArtists });
            } else {
                await setDoc(userDocRef, { artists: updatedArtists });
            }
            setGuessedArtists(updatedArtists);
        }
    };

    const blurAmount = timeLeft > 10 ? 10 : timeLeft;

    return (
        <div className="App">
            {!gameStarted && (
                <button onClick={startGame}>Start Game</button>
            )}
            {gameStarted && (
                <>
                    <div id='gameImageDiv'>
                        <img src={imageURL} alt='quizzed artist' style={{ filter: revealed ? "none" : `blur(${blurAmount}px)` }} id='gameImage' />
                    </div>
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
                </>
            )}
        </div>
    );
}

export default MainGame;