import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import 'chartjs-adapter-date-fns';

const Statistics = () => {
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState([]);
    const [userHistory, setUserHistory] = useState([]);
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
                const data = userDoc._document.data.value.mapValue.fields.artists.arrayValue.values;
                console.log(data);
                setUserData(data);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        console.log("userData:", userData);
        if (userData.length > 0) {
            const dataPoints = userData.map((data) => {
                const timestamp = parseInt(data.mapValue.fields.timestamp.integerValue);
                const score = parseInt(data.mapValue.fields.totalScore.integerValue);
                return { x: new Date(timestamp), y: score }; // Using lowercase 'x' and 'y'
            });

            // Sort dataPoints by timestamp
            dataPoints.sort((a, b) => a.x - b.x);

            console.log(dataPoints);

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
            console.log(historyList);
            setUserHistory(historyList);
        }
    }, [userData]);

    return (
        <>
            <h1 className='header'>Statistics</h1>
            <Line data={propData} options={{
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
            <div>
                <h2>History</h2>
                <ul>
                    {userHistory.slice().reverse().map((artist, index) => ( // Use slice() to create a copy of the array before reversing
                        <li key={index}>
                            <a href={`https://music.apple.com/us/search?term=${encodeURIComponent(artist)}`} target="_blank" rel="noopener noreferrer">
                                {artist}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Statistics;