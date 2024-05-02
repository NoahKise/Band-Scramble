import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import appleMusicIcon from '../assets/images/appleMusicIcon.png'
import spotifyIcon from '../assets/images/spotifyIcon.png'

const Statistics = () => {
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
    const [userLongestStreak, setUserLongestStreak] = useState(0);
    const [userCurrentDailyStreak, setUserCurrentDailyStreak] = useState(0);
    const [userScore, setUserScore] = useState(0);
    const [amountCorrect, setAmountCorrect] = useState(0);
    const [amountIncorrect, setAmountIncorrect] = useState(0);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const [propData, setPropData] = useState({
        labels: [],
        datasets: [
            {
                label: "Total Score",
                data: [],
            },
        ],
    });

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
        const fetchData = async () => {
            if (userId) {
                const userDocRef = doc(db, "guessedArtists", userId);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc._document.data.value.mapValue.fields.artists.arrayValue.values;
                    setUserData(data);
                } else {
                    setNoDataAvailable(true);
                }
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        const fetchScore = async () => {
            if (userId) {
                const scoreDoc = await getDoc(doc(db, "score", userId));
                if (scoreDoc.exists()) {
                    const userData = scoreDoc.data();
                    setUserScore(userData.score);
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
                    setUserCurrentDailyStreak(userData.dailyModeStreak);
                } else {
                    console.log("daily mode streak not found")
                }
            }
        };
        fetchDailyModeStreak();
    }, [userId]);

    useEffect(() => {
        if (userData.length > 0) {
            const dataPoints = userData.map((data) => {
                const timestamp = parseInt(data.mapValue.fields.timestamp.integerValue);
                const score = parseInt(data.mapValue.fields.totalScore.integerValue);
                return { x: new Date(timestamp), y: score }; // Using lowercase 'x' and 'y'
            });
            // Sort dataPoints by timestamp
            dataPoints.sort((a, b) => a.x - b.x);
            setPropData({
                datasets: [
                    {
                        label: "Total Score",
                        data: dataPoints,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        borderWidth: .9,
                        pointRadius: 0,
                    },
                ],
            });

            const historyList = userData.map((data) => {
                const listArtist = data.mapValue.fields.artist.stringValue;
                return listArtist;
            });
            setUserHistory(historyList);

            const successArray = userData.map((data) => {
                const bool = data.mapValue.fields.correct.booleanValue;
                return bool;
            });
            const longestStreak = longestTrueStreak(successArray)
            setUserLongestStreak(longestStreak)

            const rightAnswers = userData.map((data) => {
                let counter = 0; // Initialize counter outside of map
                if (data.mapValue.fields.correct.booleanValue === true) {
                    counter++; // Increment counter for each correct answer
                }
                return counter;
            });
            const totalCorrect = rightAnswers.reduce((acc, val) => acc + val, 0);
            setAmountCorrect(totalCorrect);

            const wrongAnswers = userData.map((data) => {
                let counter = 0; // Initialize counter outside of map
                if (data.mapValue.fields.correct.booleanValue === false) {
                    counter++; // Increment counter for each correct answer
                }
                return counter;
            });
            const totalIncorrect = wrongAnswers.reduce((acc, val) => acc + val, 0);
            setAmountIncorrect(totalIncorrect);

        }
    }, [userData]);

    const longestTrueStreak = (array) => {
        let maxStreak = 0;
        let currentStreak = 0;

        for (const value of array) {
            if (value === true) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        }

        return maxStreak;
    }

    const successPercentage = (amountCorrect / (amountCorrect + amountIncorrect)) * 100;
    const roundedSuccessPercentage = Math.round((successPercentage + Number.EPSILON) * 100) / 100;

    return (
        <>
            <h1 className='header'>Statistics</h1>
            {noDataAvailable ? (
                <div id="noDataMessage">
                    <p>Please play a round before returning to this statistics page.</p>
                </div>
            ) : (
                <div id='statsFullPage'>
                    <h2>Score: {userScore}</h2>
                    <Line className='graph' data={propData} options={{
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'black'
                                }
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'hour',
                                    stepSize: 3,
                                    tooltipFormat: 'HH:mm',
                                },
                                ticks: {
                                    color: 'black',
                                    major: {
                                        enabled: true,
                                        fontStyle: 'bold',
                                        fontColor: 'red'
                                    }
                                }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: 'black',
                                }
                            }
                        }
                    }} />
                    <div id='doughnut'>
                        <h1 id='percentage'>{!isNaN(roundedSuccessPercentage) ? `${roundedSuccessPercentage}%` : ''}</h1>
                        <Doughnut className='graph'
                            data={{
                                labels: ['Correct', 'Incorrect'], // Labels for the two categories
                                datasets: [
                                    {
                                        data: [amountCorrect, amountIncorrect], // Pass the actual values here
                                        backgroundColor: [
                                            '#23d866', // Color for success
                                            '#f9435d' // Color for fail
                                        ]
                                    }
                                ]
                            }}
                        />
                    </div>
                    <h2 id='longestStreak'>Longest Winning Streak: {userLongestStreak}</h2>
                    <h2 id='currentDailyStreak'>Current Daily Streak: {userCurrentDailyStreak}</h2>
                    <div id='history'>
                        <h2>History</h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {userHistory.slice().reverse().map((artist, index) => (
                                <li key={index}>
                                    <div className='listedArtist'>
                                        <p>{artist}</p>
                                        <div className='historyIcons'>
                                            <a href={`https://music.apple.com/us/search?term=${encodeURIComponent(artist)}`} target="_blank" rel="noopener noreferrer">
                                                <img src={appleMusicIcon} alt='apple music logo' />
                                            </a>
                                            <br />
                                            <a href={`https://open.spotify.com/search/${encodeURIComponent(artist)}/artists`} target="_blank" rel="noopener noreferrer">
                                                <img src={spotifyIcon} alt='spotify logo' />
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Statistics;