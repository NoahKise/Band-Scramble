import { Data } from '../Data';
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import A from '../assets/images/A.png'
import B from '../assets/images/B.png'
import C from '../assets/images/C.png'
import D from '../assets/images/D.png'
import E from '../assets/images/E.png'
import F from '../assets/images/F.png'
import G from '../assets/images/G.png'
import H from '../assets/images/H.png'
import I from '../assets/images/I.png'
import J from '../assets/images/J.png'
import K from '../assets/images/K.png'
import L from '../assets/images/L.png'
import M from '../assets/images/M.png'
import N from '../assets/images/N.png'
import O from '../assets/images/O.png'
import P from '../assets/images/P.png'
import Q from '../assets/images/Q.png'
import R from '../assets/images/R.png'
import S from '../assets/images/S.png'
import T from '../assets/images/T.png'
import U from '../assets/images/U.png'
import V from '../assets/images/V.png'
import W from '../assets/images/W.png'
import X from '../assets/images/X.png'
import Y from '../assets/images/Y.png'
import Z from '../assets/images/Z.png'
import SPACE from '../assets/images/SPACE.png'
import '../App.css';

// import Draggable from 'react-draggable';

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
    const [originalLetters, setOriginalLetters] = useState([]);
    const [newLetters, setNewLetters] = useState([]);
    const [backspacePressed, setBackspacePressed] = useState(false);

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

    useEffect(() => {
        const handleKeyPress = (event) => {
            const inputElement = document.getElementById('guess');
            inputElement.focus();
        };
        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
    }, []);

    const RandomArtist = useCallback(() => {
        const index = Math.floor(Math.random() * Data.length);
        const newArtist = Data[index];
        console.log(newArtist);
        const artistArray = ScrambledString(newArtist).split('')
        Discogs(newArtist);
        setArtist(newArtist);
        setRevealed(false);
        setMixedString(ScrambledString(newArtist));
        setResetClicked(false);
        setTimeLeft(newArtist.length * 3);
        // setOriginalLetters(artistArray.filter(char => char !== ' '));
        setOriginalLetters(artistArray);
        setNewLetters([]);
    }, []);

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
        outputArray.push('<nobr>');
        for (let i = 0; i < splitString.length; i++) {
            if (splitString[i] === " ") {
                outputArray.push("</nobr> <nobr>");
            } else {
                outputArray.push("-");
            }
        }
        outputArray.push("</nobr>");
        let outcome = outputArray.join('');
        return outcome;
    };

    function ScrambledString(string) {
        // let stringWithoutSpaces = string.replace(/\s/g, '');
        // let characters = stringWithoutSpaces.split('');
        let characters = string.split('');
        for (let i = characters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [characters[i], characters[j]] = [characters[j], characters[i]];
        }
        return characters.join('');
    }

    const revealArtist = () => {
        setScore(score - mixedString.length * 10);
        updateGuessedArtists(false);
        setNewLetters(artist.split(''));
        setOriginalLetters([]);
        setRevealed(true);
    }

    const scramble = () => {
        setMixedString(ScrambledString(originalLetters.join('')));
        setOriginalLetters(ScrambledString(originalLetters.join('')).split(''))
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
    const guessButtonLabel = newLetters.length === artist.length ? "Check Answer" : "Recall Tiles";

    const makeGuess = () => {
        const field = document.getElementById("guess");
        // let guess = field.value;
        // let formattedGuess = guess.toUpperCase();
        // let trimmedGuess = formattedGuess.trim();
        let trimmedGuess = newLetters.join('').toUpperCase().trim();
        if (trimmedGuess === artist) {
            if (revealed === false) {
                setScore(score + (mixedString.length + timeLeft) * 10);
            }
            setRevealed(true);
            setResetClicked(true);
            updateGuessedArtists(true);
        } else {
            // setOriginalLetters(ScrambledString(artist).split('').filter(char => char !== ' '));
            setOriginalLetters(ScrambledString(artist).split(''));
            setNewLetters([]);
            field.value = '';
        }
    };

    const startGame = () => {
        RandomArtist();
        setGameStarted(true);
    };

    const Discogs = async (bandName) => {
        const key = process.env.REACT_APP_KEY;
        const secret = process.env.REACT_APP_SECRET;
        try {
            const response = await fetch(`https://api.discogs.com/database/search?q=${bandName}&type=artist&key=${key}&secret=${secret}`);
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
        if (userId && artist !== "") {
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

    const blurAmount = timeLeft > 20 ? 10 : timeLeft / 2;

    const letterImages = {
        'A': A,
        'B': B,
        'C': C,
        'D': D,
        'E': E,
        'F': F,
        'G': G,
        'H': H,
        'I': I,
        'J': J,
        'K': K,
        'L': L,
        'M': M,
        'N': N,
        'O': O,
        'P': P,
        'Q': Q,
        'R': R,
        'S': S,
        'T': T,
        'U': U,
        'V': V,
        'W': W,
        'X': X,
        'Y': Y,
        'Z': Z,
        ' ': SPACE
    };

    const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (key === ' ' && newLetters[newLetters.length - 1] === ' ') {
            return;
        }
        if (key === 'DELETE' || key === 'BACKSPACE') {
            setBackspacePressed(true);
            if (newLetters.length > 0) {
                setNewLetters(prevNewLetters => {
                    const lastLetter = prevNewLetters[prevNewLetters.length - 1];
                    if (lastLetter === ' ') {
                        setOriginalLetters([...originalLetters, lastLetter]);
                        return prevNewLetters.slice(0, -1);
                    } else {
                        setOriginalLetters([...originalLetters, lastLetter]); // Add the last letter to originalLetters
                        return prevNewLetters.slice(0, -1);
                    }
                });
            }
        } else {
            const index = originalLetters.findIndex(letter => letter === key);
            if (index !== -1) {
                // If the key is found in the original area, move it to the new area
                const newOriginalLetters = [...originalLetters];
                newOriginalLetters.splice(index, 1); // Remove the letter from originalLetters
                setOriginalLetters(newOriginalLetters);
                setNewLetters([...newLetters, key]);
            }
            setBackspacePressed(false);
        }
    };

    useEffect(() => {
        if (!backspacePressed && findSpaceIndices(artist).includes(newLetters.length)) {
            handleKeyPress({ key: ' ' });
        }
    }, [newLetters]);


    const handleClickTile = (letter) => {
        const event = new KeyboardEvent('keydown', { key: letter });
        document.dispatchEvent(event);
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [originalLetters, newLetters]);

    const renderTiles = (areaLetters, areaType) => {
        return areaLetters.map((letter, index) => {
            const style = letter === ' ' ?
                { opacity: areaType === 'new' ? '0' : '1', display: areaType === 'original' ? 'none' : 'inline-block' }
                : {};
            return (
                <img
                    className='tile'
                    key={index}
                    src={letterImages[letter]}
                    alt={letter}
                    onClick={() => handleClickTile(letter)}
                    style={style}
                />
            );
        });
    };

    const findSpaceIndices = (artist) => {
        const spaceIndices = [];
        for (let i = 0; i < artist.length; i++) {
            if (artist[i] === " ") {
                spaceIndices.push(i);
            }
        }
        return spaceIndices;
    };

    return (
        <div className="App">
            {!gameStarted && (
                <button onClick={startGame}>Start Game</button>
            )}
            {gameStarted && (
                <>
                    {/* <Draggable> */}
                    <div id='gameImageDiv'>
                        <img src={imageURL} alt='quizzed artist' style={{ filter: revealed ? "none" : `blur(${blurAmount}px)` }} id='gameImage' />
                    </div>
                    {/* </Draggable> */}
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
                    <button id='guessButton' onClick={makeGuess}>{guessButtonLabel}</button>
                    <p>Seconds Remaining: {timeLeft}</p>
                    <div id='gameArea'>
                        <div id='topTwoRows'>
                            <div className="new-area">
                                <div className="letter-tiles">
                                    {renderTiles(newLetters, 'new')}
                                </div>
                            </div>
                            <h1 id='gameBoard' dangerouslySetInnerHTML={{ __html: GameBoard(artist) }}></h1>
                        </div>
                        {/* <h1>{revealed ? artist : mixedString || ScrambledString(artist)}</h1> */}
                        <div className="original-area">
                            <div className="letter-tiles">
                                {renderTiles(originalLetters, 'original')}
                            </div>
                        </div>
                    </div>
                    <button id='reveal' onClick={revealOrReset}>{buttonLabel}</button>
                    <button id='rescramble' onClick={scramble}>Scramble</button>
                    <h3>Score: {score}</h3>
                </>
            )}
        </div>
    );
}

export default MainGame;