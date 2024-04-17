import { technoData, rockData, hiphopData, allData, noahData, topChartData, countryData } from '../Data';
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
import PLACEHOLDER from '../assets/images/PLACEHOLDER.png'
import hintIcon from '../assets/images/hintIcon.png'
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
    const [scoreFluctuation, setScoreFluctuation] = useState(0);
    const [userHistory, setUserHistory] = useState([]);
    const [answerPool, setAnswerPool] = useState([]);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState([]);

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
        const fetchData = async () => {
            if (userId) {
                const userDocRef = doc(db, "guessedArtists", userId);
                try {
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc._document.data.value.mapValue.fields.artists.arrayValue.values;
                        const historyList = userData.map((data) => {
                            const listArtist = data.mapValue.fields.artist.stringValue;
                            return listArtist;
                        });
                        setUserHistory(historyList);
                        const difference = allData.filter(element => !historyList.includes(element));
                        setAnswerPool(difference);
                    } else {
                        setUserHistory([]);
                        setAnswerPool(allData);
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (userId) {
                const historyDoc = await getDoc(doc(db, "guessedArtists", userId));
                if (historyDoc.exists()) {
                    const userData = historyDoc.data();
                    setGuessedArtists(userData.artists);
                } else {
                    console.log("history not found")
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

    const RandomArtist = useCallback(async () => {
        if (answerPool.length > 0) {
            const remainder = allData.filter((element) => answerPool.includes(element));
            const index = Math.floor(Math.random() * remainder.length); // change data variables for different data sets
            const newArtist = remainder[index]; // to test with specific string set newArtist to test value
            // const newArtist = "DARKTHRONE"
            // console.log(newArtist);
            const artistArray = ScrambledString(newArtist).split('');
            Discogs(newArtist);
            Deezer(newArtist);
            setArtist(newArtist);
            setRevealed(false);
            setMixedString(ScrambledString(newArtist));
            setResetClicked(false);
            if (newArtist.length > 6) {
                setTimeLeft(newArtist.length * 3);
            } else {
                setTimeLeft(20);
            }
            setOriginalLetters(artistArray);
            setNewLetters([]);
            setScoreFluctuation(0);
        }
    }, [answerPool]);

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
        const placeholdersRemoved = originalLetters.filter((element) => element !== '!')
        setMixedString(ScrambledString(placeholdersRemoved.join('')));
        setOriginalLetters(ScrambledString(placeholdersRemoved.join('')).split(''))
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
    const advanceButtonClass = revealed ? "advance" : "reveal";
    const recallTilesButtonClass = newLetters.length === artist.length ? "guess" : "recallTiles";
    const recallTilesText = scoreFluctuation > 0 ? `+${scoreFluctuation}` : (scoreFluctuation < 0 ? scoreFluctuation : "GUESS");
    const scoreColor = { color: scoreFluctuation < 0 ? 'red' : (scoreFluctuation > 0 ? 'green' : ((newLetters.length === artist.length && revealed !== true) ? 'black' : 'transparent')) }
    const scrambleButtonClass = revealed ? "message" : "shuffle";
    const scrambleButtonText = scoreFluctuation > 0 ? "NICE!" : (scoreFluctuation === 0 ? '...' : "SORRY");


    const makeGuess = () => {
        if (revealed === true) {
            return;
        }
        const field = document.getElementById("guess");
        let trimmedGuess = newLetters.join('').toUpperCase().trim();
        if (trimmedGuess === artist) {
            if (revealed === false) {
                setScore(score + (mixedString.length + timeLeft) * 10);
            }
            setRevealed(true);
            setResetClicked(true);
            updateGuessedArtists(true);
        } else {
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

    const Deezer = async (bandName) => {
        const index = Math.floor(Math.random() * 3);
        console.log(index);
        try {
            const response = await fetch(`https://corsproxy.io/?https://api.deezer.com/search/track?q=${bandName}`);
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            const jsonifiedresponse = await response.json();
            console.log(jsonifiedresponse);
            if (jsonifiedresponse) {
                let url = jsonifiedresponse.data[index].preview;
                console.log(url);
                setAudioPreviewUrl(url);
            } else {
                console.log('no api response')
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

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
            setScoreFluctuation(flux);
            let updatedArtists = [...guessedArtists, { artist, correct: boolean, scoreChange: flux, totalScore: score + flux, timestamp: Date.now() }];
            if (userDoc.exists()) {
                await updateDoc(userDocRef, { artists: updatedArtists });
            } else {
                await setDoc(userDocRef, { artists: updatedArtists });
            }
            setGuessedArtists(updatedArtists);
            const newAnswerPool = [...answerPool];
            const index = newAnswerPool.indexOf(artist);
            if (index > -1) {
                newAnswerPool.splice(index, 1);
            }
            setAnswerPool(newAnswerPool);
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
        ' ': SPACE,
        '!': PLACEHOLDER
    };

    const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (newLetters.length === artist.length) {
            return;
        }
        if (key === '!') {
            return;
        }
        if (key === ' ' && newLetters[newLetters.length - 1] === ' ') {
            return;
        }
        if (key === 'DELETE' || key === 'BACKSPACE') {
            setBackspacePressed(true);
            if (newLetters.length > 0) {
                // remove first '!' from original letters if it exists
                setNewLetters(prevNewLetters => {
                    const lastLetter = prevNewLetters[prevNewLetters.length - 1];
                    if (lastLetter === ' ') {
                        setOriginalLetters([...originalLetters, lastLetter]);
                        return prevNewLetters.slice(0, -1);
                    } else {
                        const index = originalLetters.indexOf('!');
                        if (index !== -1) {
                            const newOriginalLetters = [...originalLetters];
                            newOriginalLetters.splice(index, 1, lastLetter);
                            setOriginalLetters(newOriginalLetters);
                        } else {
                            setOriginalLetters([...originalLetters, lastLetter]);
                        }
                        return prevNewLetters.slice(0, -1);
                    }
                });
            }
        } else {
            const index = originalLetters.findIndex(letter => letter === key);
            if (index !== -1) {
                const newOriginalLetters = [...originalLetters];
                if (key !== ' ') {
                    newOriginalLetters.splice(index, 1, '!');
                } else {
                    newOriginalLetters.splice(index, 1);
                }
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

    const handleNewAreaTileClick = () => {
        const event = new KeyboardEvent('keydown', { key: 'backspace' });
        document.dispatchEvent(event);
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [originalLetters, newLetters]);

    const renderTiles = (areaLetters, areaType) => {
        let tiles = [];
        let previousWasSpace = false;
        let broken = false;

        const clickHandler = areaType === 'new' ? handleNewAreaTileClick : handleClickTile;

        for (let i = 0; i < areaLetters.length; i++) {
            const answerArray = artist.split('');
            const letter = areaLetters[i];
            const nextSpaceIndex = answerArray.indexOf(' ', i);
            if (areaType === 'new') {
                if (((previousWasSpace && nextSpaceIndex > 10 && artist !== "NAUGHTY BY NATURE") && nextSpaceIndex < 14) || ((previousWasSpace && nextSpaceIndex > 9 && artist === "HOOTIE AND THE BLOWFISH") && nextSpaceIndex < 14) || (previousWasSpace && nextSpaceIndex === -1 && answerArray.length > 10)) {
                    tiles.push(<br key={`br-${nextSpaceIndex}`} />);
                    // broken = true;
                    if ((answerArray[9] === ' ') || (answerArray[10] === ' ') || (answerArray[8] === ' ') || (answerArray[7] === ' ') || (i > 5 && ((answerArray.length - i) <= 6))) {
                        if (
                            artist !== "CAPTAIN BEEFHEART"
                            && artist !== "THE VELVET UNDERGROUND"
                            // && artist !== "SUFJAN STEVENS"
                            // && artist !== "ALANIS MORISSETTE"
                            && artist !== "SUNNY DAY REAL ESTATE"
                            && artist !== "JAPANESE BREAKFAST"
                            // && artist !== "LUTHER VANDROSS"
                            // && artist !== "PHOEBE BRIDGERS"
                            // && artist !== "BROKEN SOCIAL SCENE"
                            && artist !== "HOOTIE AND THE BLOWFISH"
                            // && artist !== "AFRIKA BAMBAATAA"
                            // && artist !== "REGINA SPEKTOR"
                            && artist !== "THE TALLEST MAN ON EARTH"
                            // && artist !== "JUSTIN TIMBERLAKE"
                            // && artist !== "OLIVIA RODRIGO"
                            && artist !== "HARRY STYLES"
                            && artist !== "KENNY ROGERS"
                            // && artist !== "NAUGHTY BY NATURE"
                            && artist !== "CARRIE UNDERWOOD"
                            && artist !== "JANET JACKSON"
                            && artist !== "GARTH BROOKS"
                            && artist !== "TUPAC SHAKUR"
                            && artist !== "NIPSY HUSTLE"
                            && artist !== "ALICE COOPER"
                            // && artist !== "CHRIS STAPLETON"
                            && artist !== "AT THE DRIVE IN"
                            && artist !== "JUDAS PRIEST"
                            && artist !== "JAMES TAYLOR"
                            // && artist !== "ALICE COOPER"
                        ) {
                            tiles.pop();
                            tiles.pop();
                        }
                    }
                }
            }
            const style = letter === ' ' ?
                { opacity: areaType === 'new' ? '0' : '1', display: areaType === 'original' ? 'none' : 'inline-block' }
                : letter === '!' ? { opacity: '0', display: areaType === 'original' ? 'inline-block' : 'none' } : {};
            tiles.push(
                <img
                    className='tile'
                    key={i}
                    src={letterImages[letter]}
                    alt={letter}
                    onClick={() => clickHandler(letter)}
                    style={style}
                />
            );
            previousWasSpace = letter === ' ';
        }
        return tiles;
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

    const longestLineLength = (artistName) => {
        if (artistName.length <= 10) {
            return artistName.length;
        }
        const lastSpaceIndex = artistName.lastIndexOf(' ', 10);
        if (lastSpaceIndex === -1) {
            return 10;
        }
        const firstLine = artistName.substring(0, lastSpaceIndex);
        const secondLine = artistName.substring(lastSpaceIndex + 1);
        if (secondLine.length > 10) {
            const anotherSpaceIndex = secondLine.lastIndexOf(' ');
            const thirdLine = secondLine.substring(0, anotherSpaceIndex);
            const fourthLine = secondLine.substring(anotherSpaceIndex + 1);
            if (firstLine.length > 9) {
                return Math.max(thirdLine.length, fourthLine.length);
            }
            return Math.max(thirdLine.length, fourthLine.length, firstLine.length);
        }
        return Math.max(firstLine.length, secondLine.length);
    }

    const playMusic = () => {
        let audio = new Audio(audioPreviewUrl);
        audio.play();
    }

    return (
        <div className="App">
            {answerPool.length === 0 && (
                <h1>Loading...</h1>
            )}
            {answerPool.length > 0 && !gameStarted && (
                <button id='startButton' className='button-53' onClick={startGame}>Start Game</button>
            )}
            {gameStarted && (
                <>
                    <div id='topContainer'>
                        <img id='hintIcon' src={hintIcon} alt='hint icon' onClick={playMusic} />
                        {/* <button id='playMusicButton' onClick={playMusic}>Play Music</button> */}
                        {/* <Draggable> */}
                        <div id='gameImageDiv'>
                            <img src={imageURL} alt='quizzed artist' style={{ filter: revealed ? "none" : `blur(${blurAmount}px)` }} id='gameImage' />
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
                        </div>
                        {/* </Draggable> */}
                    </div>
                    <br></br>


                    <div id='gameArea'>
                        <div id='topTwoRows' style={{ width: `${longestLineLength(artist) * 37.6}px` }}>
                            <div className="new-area">
                                <div className="letter-tiles">
                                    {renderTiles(newLetters, 'new')}
                                </div>
                            </div>
                            <h1 id='gameBoard' onClick={handleNewAreaTileClick} dangerouslySetInnerHTML={{ __html: GameBoard(artist) }}></h1>
                        </div>
                        <div className="original-area">
                            <div className="letter-tiles">
                                {renderTiles(originalLetters, 'original')}
                            </div>
                        </div>
                    </div>
                    <div id='bottomStuff'>
                        <button style={scoreColor} className={`gameButton ${recallTilesButtonClass}`} id='guessButton' onClick={makeGuess}>{recallTilesText}</button>
                        <button className={`gameButton ${scrambleButtonClass}`} id='rescramble' onClick={scramble}>{scrambleButtonText}</button>
                        <button className={`gameButton ${advanceButtonClass}`} id='reveal' onClick={revealOrReset}>GIVE UP</button>
                        <div id='timerAndScore'>
                            <p id='timer' style={{ color: timeLeft > 10 ? 'black' : 'red' }}>{timeLeft}</p>
                            <h3>Score: {score}</h3>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MainGame;