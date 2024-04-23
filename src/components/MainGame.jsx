import { technoData, rockData, hiphopData, allData, noahData, topChartData, countryData, problemData } from '../Data';
import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

import 'animate.css';
import '../App.css';

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
import playPauseIcon from '../assets/images/playPauseIcon.png'
import firstTile from '../assets/images/firstTile.png'
import advanceScreenshot from '../assets/images/advanceScreenshot.png'
import audioHintIconScreenshot from '../assets/images/audioHintIconScreenshot.png'
import firstTileHintIconScreenshot from '../assets/images/firstTileHintIconScreenshot.png'
import giveUpScreenshot from '../assets/images/giveUpScreenshot.png'
import guessScreenshot from '../assets/images/guessScreenshot.png'
import recallTilesScreenshot from '../assets/images/recallTilesScreenshot.png'
import shuffleTilesScreenshot from '../assets/images/shuffleTilesScreenshot.png'

import coinGif from '../assets/images/coin.gif'
import exampleGameplayGif from '../assets/images/exampleGameplay.gif'
import clues from '../assets/images/clues.gif'

import whoosh from '../assets/sounds/whoosh.mp3'
import twinkle from '../assets/sounds/twinkle.mp3'
import shuffle from '../assets/sounds/shuffle.mp3'
import recall from '../assets/sounds/recall.mp3'
import wrong from '../assets/sounds/wrong.mp3'
import buzzer from '../assets/sounds/buzzer.mp3'
import sparkle from '../assets/sounds/sparkle.mp3'
import levelUp from '../assets/sounds/levelUp.mp3'


// import Draggable from 'react-draggable';

const MainGame = () => {
    const [artist, setArtist] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [mixedString, setMixedString] = useState("");
    const [resetClicked, setResetClicked] = useState(false);
    const [score, setScore] = useState(0);
    const [hints, setHints] = useState(0);
    const [firstLetterHints, setFirstLetterHints] = useState(0);
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
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [amountCorrect, setAmountCorrect] = useState(false);
    const [firstLetterHintUsed, setFirstLetterHintUsed] = useState(false);
    const [dailyMode, setDailyMode] = useState(true);
    const [dailyPick, setDailyPick] = useState("");
    const [audioUnavailable, setAudioUnavailable] = useState(false);
    const [discogsId, setDiscogsId] = useState("");
    const [discogsUrl, setDiscogsUrl] = useState("");
    const [discogsBio, setDiscogsBio] = useState("");
    const [helpOpen, setHelpOpen] = useState(false);
    const [helpClicked, setHelpClicked] = useState(false);
    const [bioOpen, setBioOpen] = useState(false);
    const [bioClicked, setBioClicked] = useState(false);
    const [bioArtistName, setBioArtistName] = useState("");
    const [audioHintUsed, setAudioHintUsed] = useState(false);
    const [dailyModeStreak, setDailyModeStreak] = useState(0);


    let audio = useRef(null);

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
        const fetchDailyModeStreak = async () => {
            if (userId) {
                const dailyModeStreakDoc = await getDoc(doc(db, "dailyModeStreak", userId));
                if (dailyModeStreakDoc.exists()) {
                    const userData = dailyModeStreakDoc.data();
                    setDailyModeStreak(userData.dailyModeStreak);
                } else {
                    console.log("daily mode streak not found")
                }
            }
        };
        fetchDailyModeStreak();
    }, [userId]);

    useEffect(() => {
        const fetchDailyPick = async () => {
            try {
                const dailyPickDoc = await getDoc(doc(db, "dailyPicks", '1'));
                if (dailyPickDoc.exists()) {
                    const dailyPickData = dailyPickDoc.data();
                    const dailyPickArray = dailyPickData.name;
                    const dailyPick = dailyPickArray[dailyPickArray.length - 1];
                    setDailyPick(dailyPick);
                } else {
                    console.log("Daily pick document does not exist");
                }
            } catch (error) {
                console.error("Error fetching daily pick:", error);
            }
        };
        fetchDailyPick();
    }, [userId]);

    useEffect(() => {
        const fetchHints = async () => {
            if (userId) {
                const hintsDoc = await getDoc(doc(db, "hints", userId));
                if (hintsDoc.exists()) {
                    const userData = hintsDoc.data();
                    setHints(userData.hints);
                } else {
                    console.log("hints not found")
                }
            }
        };
        fetchHints();
    }, [userId]);

    useEffect(() => {
        const fetchFirstLetterHints = async () => {
            if (userId) {
                const firstLetterHintsDoc = await getDoc(doc(db, "firstLetterHints", userId));
                if (firstLetterHintsDoc.exists()) {
                    const userData = firstLetterHintsDoc.data();
                    setFirstLetterHints(userData.firstLetterHints);
                } else {
                    console.log("first letter hints not found")
                }
            }
        };
        fetchFirstLetterHints();
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

                        const rightAnswers = userData.map((data) => {
                            let counter = 0;
                            if (data.mapValue.fields.correct.booleanValue === true) {
                                counter++;
                            }
                            return counter;
                        });
                        const totalCorrect = rightAnswers.reduce((acc, val) => acc + val, 0);
                        setAmountCorrect(totalCorrect);

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
        const updateDailyModeStreak = async () => {
            if (userId) {
                await setDoc(doc(db, "dailyModeStreak", userId), { dailyModeStreak });
            }
        };
        updateDailyModeStreak();
    }, [dailyModeStreak]);

    useEffect(() => {
        const updateHints = async () => {
            if (userId) {
                await setDoc(doc(db, "hints", userId), { hints });
            }
        };
        updateHints();
    }, [hints]);

    useEffect(() => {
        const updateFirstLetterHints = async () => {
            if (userId) {
                await setDoc(doc(db, "firstLetterHints", userId), { firstLetterHints });
            }
        };
        updateFirstLetterHints();
    }, [firstLetterHints]);

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

    let newArtist = '';

    const RandomArtist = useCallback(async () => {
        let dailyModeTracker = true;
        if (answerPool.length > 0) {
            if (dailyMode) {
                dailyModeTracker = true;
            } else {
                dailyModeTracker = false;
            }
            if (dailyModeTracker === true) {
                let mostRecentDate = '';
                if (guessedArtists.length > 0) {
                    mostRecentDate = new Date(guessedArtists[guessedArtists.length - 1].timestamp).toLocaleDateString('en-US');
                } else {
                    mostRecentDate = new Date(1713221222714).toLocaleDateString('en-US');
                }
                let todaysDate = new Date(Date.now()).toLocaleDateString('en-us');
                if (mostRecentDate !== todaysDate) {
                    newArtist = dailyPick;
                } else {
                    setDailyMode(false);
                    dailyModeTracker = false;
                }
            }
            if (dailyModeTracker === false) {
                const remainder = allData.filter((element) => answerPool.includes(element));
                const index = Math.floor(Math.random() * remainder.length); // change data variables for different data sets
                newArtist = remainder[index]; // to test with specific string set newArtist to test value
                // newArtist = "CYPRESS HILL";

                // const index = Math.floor(Math.random() * problemData.length); // PROBLEMATIC DATASET FOR TESTING
                // newArtist = problemData[index]; // PROBLEMATIC DATASET FOR TESTING
            }
            if (musicPlaying) {
                playMusic();
            }
            const artistArray = ScrambledString(newArtist).split('');
            if (audio && audio.current) {
                audio.current = null;
            }
            setAudioHintUsed(false);
            setAudioUnavailable(false);
            setFirstLetterHintUsed(false);
            Discogs(newArtist);
            setArtist(newArtist);
            playShuffle();
            Deezer(newArtist);
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
        let timerInterval;

        if (!helpOpen) {
            timerInterval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            revealArtist();
            setResetClicked(true);
            clearInterval(timerInterval);
        } else if (revealed) {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval);
    }, [revealed, timeLeft, helpOpen]);

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
        playBuzzer();
        setScore(score - mixedString.length * 10);
        updateGuessedArtists(false);
        setNewLetters(artist.split(''));
        setOriginalLetters([]);
        setRevealed(true);
        if (dailyMode) {
            setDailyModeStreak(0);
        }
        setDailyMode(false);
    }

    const scramble = () => {
        if (!revealed) {
            playShuffle();
        }
        const placeholdersRemoved = originalLetters.filter((element) => element !== '!')
        setMixedString(ScrambledString(placeholdersRemoved.join('')));
        setOriginalLetters(ScrambledString(placeholdersRemoved.join('')).split(''))
    }

    const revealOrReset = () => {
        if (resetClicked) {
            if (bioOpen) {
                toggleBio();
            }
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
            let newTotalCorrect = amountCorrect + 1;
            setAmountCorrect(newTotalCorrect)
            if (newTotalCorrect % 10 === 0) {
                if (hints < 9) {
                    let newHintsTotal = hints + 1;
                    setHints(newHintsTotal);
                    playLevelUp();
                } else {
                    playTwinkle();
                }
            } else if (newTotalCorrect % 5 === 0 && newTotalCorrect % 10 !== 0) {
                if (firstLetterHints < 9) {
                    let newFirstLetterHintsTotal = firstLetterHints + 1;
                    setFirstLetterHints(newFirstLetterHintsTotal);
                    playLevelUp();
                } else {
                    playTwinkle();
                }
            } else {
                playTwinkle();
            }
            setRevealed(true);
            if (dailyMode) {
                let newStreak = dailyModeStreak + 1;
                setDailyModeStreak(newStreak);
            }
            setDailyMode(false);
            setResetClicked(true);
            updateGuessedArtists(true);
        } else {
            playWrong();
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
            let name = jsonifiedresponse.results[0].title;
            let artistId = jsonifiedresponse.results[0].id;
            let resourceUrl = jsonifiedresponse.results[0].resource_url;
            setBioArtistName(name);
            setDiscogsId(artistId);
            setDiscogsUrl(resourceUrl);
            setImageUrl(url);
            const bioResponse = await fetch(`https://api.discogs.com/artists/${artistId}`)
            if (!bioResponse.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            const jsonifiedBioResponse = await bioResponse.json();
            let artistBio = jsonifiedBioResponse.profile;
            const cleanText = artistBio.replace(/\[(\/?[^\/\]]+?)\]|"a=/g, '');
            setDiscogsBio(cleanText);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const Deezer = async (bandName) => {
        let index = 1;
        let url = '';
        try {
            const response = await fetch(`https://corsproxy.io/?https://api.deezer.com/search/track?q=${bandName}`);
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            const jsonifiedresponse = await response.json();
            if (jsonifiedresponse) {
                while (index < jsonifiedresponse.data.length) {
                    if (jsonifiedresponse.data[index].artist.name[0].toUpperCase() === newArtist[0]) {
                        url = jsonifiedresponse.data[index].preview;
                        setAudioPreviewUrl(url);
                        break;
                    }
                    index++;
                }
                if (!url && jsonifiedresponse.data.length > 0) {
                    url = jsonifiedresponse.data[0].preview;
                    setAudioPreviewUrl(url);
                }
            } else {
                console.log('no api response')
            }
        } catch (error) {
            console.log(error);
            // throw new Error(error.message);
            setAudioUnavailable(true);
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
                        playRecall();
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
                playTileWhoosh();
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
                            && artist !== "BUSTA RHYMES"
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
        if (!revealed) {
            if (!audio.current) {
                audio.current = new Audio(audioPreviewUrl);
            }
            if (!musicPlaying) {
                if (hints > 0 && !audioUnavailable) {
                    playSparkle();
                    // If music is not playing, start playing
                    audio.current.volume = 0;
                    audio.current.play();
                    setTimeLeft(30);
                    // setTimeout(() => {
                    //     const fadeOutInterval = setInterval(() => {
                    //         if (audio.current) {
                    //             if (audio.current.volume > 0.05) {
                    //                 audio.current.volume -= 0.05;
                    //             } else {
                    //                 clearInterval(fadeOutInterval);
                    //             }
                    //         }
                    //     }, 300);
                    // }, 24500);
                    const fadeInInterval = setInterval(() => {
                        if (audio.current) {
                            if (audio.current.volume < 0.95) {
                                audio.current.volume += 0.05;
                            } else {
                                clearInterval(fadeInInterval);
                            }
                        }
                    }, 400);
                    setMusicPlaying(true);
                    if (!audioHintUsed) {
                        let hintsRemaining = hints - 1;
                        setHints(hintsRemaining);
                        setAudioHintUsed(true);
                    }
                }

            } else {
                audio.current.pause();
                setMusicPlaying(false);
            }
        } else {
            if (audio.current) {
                audio.current.pause();
            }
            setMusicPlaying(false);
        }
    };

    const playTileWhoosh = () => {
        const audio = new Audio(whoosh);
        audio.play();
    }
    const playTwinkle = () => {
        const audio = new Audio(twinkle);
        audio.play();
    }

    const playShuffle = () => {
        const audio = new Audio(shuffle);
        audio.play();
    }

    const playRecall = () => {
        const audio = new Audio(recall);
        audio.play();
    }

    const playWrong = () => {
        const audio = new Audio(wrong);
        audio.play();
    }

    const playSparkle = () => {
        const audio = new Audio(sparkle);
        audio.play();
    }

    const playLevelUp = () => {
        const audio = new Audio(levelUp);
        audio.play();
    }

    const playBuzzer = () => {
        const audio = new Audio(buzzer)
        if (gameStarted) {
            audio.play();
        }
    }

    const applyFirstLetterHint = () => {
        if (!revealed && !firstLetterHintUsed && firstLetterHints > 0) {
            setOriginalLetters(ScrambledString(artist).split(''));
            setNewLetters([]);
            const field = document.getElementById("guess");
            field.value = '';
            playSparkle();
            setTimeLeft(30);
            setTimeout(() => {
                const letterEvent = new KeyboardEvent('keydown', { key: artist[0] });
                document.dispatchEvent(letterEvent);
            }, 100);
            let firstLetterHintsRemaining = firstLetterHints - 1;
            setFirstLetterHints(firstLetterHintsRemaining);
            setFirstLetterHintUsed(true);
        }
    }

    const toggleHelp = () => {
        setHelpClicked(true);
        if (!helpOpen) {
            setHelpOpen(true);
        } else {
            setHelpOpen(false);
        }
    }

    const toggleBio = () => {
        setBioClicked(true);
        if (!bioOpen) {
            setBioOpen(true);
        } else {
            setBioOpen(false);
            setBioClicked(false);
        }
    }

    return (
        <>
            <div className="App">
                {answerPool.length === 0 && (
                    <h1>Loading...</h1>
                )}
                {answerPool.length > 0 && !gameStarted && (
                    <>
                        <button id='startButton' className='button-53' onClick={startGame}>Start Game</button>
                        <form>
                            <div id='genreSelectList'>
                                <div className='genreSelectRow'>
                                    <p>Rock</p>
                                    <input type="checkbox" id="rock" name="rock" value="rock"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Hip-Hop</p>
                                    <input type="checkbox" id="hip-hop" name="hip-hop" value="hip-hop"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Pop</p>
                                    <input type="checkbox" id="pop" name="pop" value="pop"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>R&B</p>
                                    <input type="checkbox" id="r&b" name="r&b" value="r&b"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Indie/Alternative</p>
                                    <input type="checkbox" id="indieAlternative" name="indieAlternative" value="indieAlternative"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Dance</p>
                                    <input type="checkbox" id="dance" name="dance" value="dance"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Country</p>
                                    <input type="checkbox" id="country" name="country" value="country"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Metal</p>
                                    <input type="checkbox" id="metal" name="metal" value="metal"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Electronic</p>
                                    <input type="checkbox" id="electronic" name="electronic" value="electronic"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Jazz</p>
                                    <input type="checkbox" id="jazz" name="jazz" value="jazz"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Blues</p>
                                    <input type="checkbox" id="blues" name="blues" value="blues"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Soul/Funk</p>
                                    <input type="checkbox" id="soulFunk" name="soulFunk" value="soulFunk"></input>
                                </div>
                                <div className='genreSelectRow'>
                                    <p>Classic Rock</p>
                                    <input type="checkbox" id="classicRock" name="classicRock" value="classicRock"></input>
                                </div>
                            </div>
                        </form>
                    </>
                )}
                {gameStarted && (
                    <>
                        <div id='topContainer'>
                            <p id='timer' style={{ color: timeLeft > 10 ? 'black' : 'red' }}>{timeLeft}</p>
                            <p id='help' onClick={toggleHelp}>?</p>
                            <div id='gameImageDiv'>
                                <p id='bioButton'
                                    onClick={toggleBio} style={{ display: revealed ? '' : 'none' }}
                                    className={'animate__animated animate__heartBeat'}>i</p>
                                <img src={imageURL} alt='quizzed artist' style={{ filter: revealed ? "none" : `blur(${blurAmount}px)` }} id='gameImage' />
                                <input
                                    type='text'
                                    id='guess'
                                    autoComplete='off'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && revealed === true) {
                                            revealOrReset();
                                        } else if (e.shiftKey) {
                                            scramble();
                                        } else if (e.key === 'Enter') {
                                            makeGuess();
                                        }
                                    }}
                                >
                                </input>
                            </div>
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
                            <button style={scoreColor} className={`gameButton ${recallTilesButtonClass}`} id='guessButton' onClick={!helpOpen ? makeGuess : undefined}>{recallTilesText}</button>
                            <button className={`gameButton ${scrambleButtonClass}`} id='rescramble' onClick={!helpOpen ? scramble : undefined}>{scrambleButtonText}</button>
                            <button
                                className={`gameButton ${advanceButtonClass}`}
                                id='reveal'
                                onClick={helpOpen ? undefined : revealOrReset}
                            >
                                GIVE UP
                            </button>
                            <div id='timerAndScore'>
                                <div id='musicHints'>
                                    <img id='hintIcon' src={playPauseIcon} alt='audio hint icon' onClick={!helpOpen ? playMusic : undefined} />
                                    <p id='musicHintsNumber' style={{ display: hints > 0 ? '' : 'none' }} >{hints}</p>
                                </div>
                                <div id='firstLetterHints'>
                                    <img id='firstLetterIcon' src={firstTile} alt='first letter hint icon' onClick={!helpOpen ? applyFirstLetterHint : undefined} />
                                    <p id='firstLetterHintsNumber' style={{ display: firstLetterHints > 0 ? '' : 'none' }} >{firstLetterHints}</p>
                                </div>
                                <div id='coins'>
                                    <img id='coinGif' src={coinGif} alt='spinning coin' />
                                    <h3 id='score'>{score}</h3>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div
                className={`animate__animated ${helpOpen ? 'animate__fadeInDown' : 'animate__fadeOutUp'}`}
                id='helpDiv'
                style={{ display: helpClicked ? '' : 'none' }}
            >
                <button id='helpCloseButton' onClick={toggleHelp}>X</button>
                <div id='helpContent'>
                    <h1>How To Play</h1>
                    <h3>Objective:</h3>
                    <p>Given a set of scrambled letter tiles, your job is to unscramble them to determine the musical artist before the clock runs out.</p>
                    <h3>Controls:</h3>
                    <div className='instructionRow'>
                        <p>Clicking a tile will move it to the solution area. On desktop, you may alternatively type letters on the keyboard to move tiles. Spaces are inserted automatically.</p>
                        <img src={exampleGameplayGif} alt='gameplay example' />
                    </div>
                    <div className='instructionRow'>
                        <img className='instructionImg' src={recallTilesScreenshot} alt='recall tiles icon' />
                        <p className='instructionText'>Recall all tiles from the solution area to the tile bank. On desktop, you may alternatively press the enter/return key.</p>
                    </div>
                    <div className='instructionRow'>
                        <img className='instructionImg' src={shuffleTilesScreenshot} alt='shuffle tiles icon' />
                        <p className='instructionText'>Shuffle tiles in the tile bank. On desktop, you may alternatively press the shift key.</p>
                    </div>
                    <div className='instructionRow'>
                        <img className='instructionImg' src={guessScreenshot} alt='make guess button' />
                        <p className='instructionText'>Make a guess. If your tiles are in the right position, you'll win the round! If not, your tiles will be recalled to the tile bank for you to try again. On desktop, you may alternatively press the enter/return key.</p>
                    </div>
                    <div className='instructionRow'>
                        <img className='instructionImg' src={giveUpScreenshot} alt='give up button' />
                        <p className='instructionText'>Give up, and forfeit the round.</p>
                    </div>
                    <div className='instructionRow'>
                        <img className='instructionImg' src={advanceScreenshot} alt='advance to next round button' />
                        <p className='instructionText'>Advance to the next puzzle. On desktop, you may alternatively press the enter/return key.</p>
                    </div>
                    <p></p>
                    <h3>Clues:</h3>
                    <div className='instructionRow'>
                        <p>Look to the structure of the dashes to determine where spaces go. In this example, the artist name is a 7 letter word followed by a 4 letter word. Try looking at the blurred image of the artist. It will gradually reveal itself as the timer ticks closer to zero.</p>
                        <img id='clues' src={clues} alt='gameplay example' />
                    </div>
                    <h3>Scoring:</h3>
                    <p>When you successfully complete a round by guessing the correct artist name, you will receive points based on the difficulty of the puzzle and the speed at which you solved it.</p>
                    <p>If the time runs out before you solve the puzzle, you will lose points based on the difficulty of the puzzle.</p>
                    <p>Head to the home page to check out the leaderboard!</p>
                    <p>Check out your stats by clicking the statistics icon in the bottom navigation bar!</p>
                    <h3>Hints:</h3>
                    <p>As you rack up points, you will periodically earn hints, which can be used when you are stuck on a puzzle to help determine the solution. The number available of a given hint will appear in a red circle atop its icon. Keep in mind you can't bank more than 9 of any given hint</p>
                    <div className='hintInstructionRow'>
                        <img className='instructionImg' src={audioHintIconScreenshot} alt='audio hint icon' />
                        <p className='instructionText'>Clicking the play/pause icon will play a 30 second sample of one of the artist's songs (and set the timer to 30 seconds remaining). Click again to pause.</p>
                    </div>
                    <div className='hintInstructionRow'>
                        <img className='instructionImg' src={firstTileHintIconScreenshot} alt='first tile hint icon' />
                        <p className='instructionText'>Clicking the 1st tile icon will reveal the correct first letter of the artist's name (and set the timer to 30 seconds remaining).</p>
                    </div>
                </div>
            </div>
            <div id='moreArtistInfo'
                className={`animate__animated ${bioOpen ? 'animate__zoomIn' : 'animate__zoomOut'}`}
                style={{ display: bioClicked ? '' : 'none' }}>
                <button id='bioCloseButton' onClick={toggleBio}>X</button>
                <h1>{bioArtistName}</h1>
                <p id='artistBio'>{discogsBio}</p>
            </div>
        </>
    );
}

export default MainGame;