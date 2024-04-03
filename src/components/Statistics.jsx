import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import 'chartjs-adapter-date-fns';

const Statistics = () => {
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState([]);

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

    const [propData, setPropData] = useState({
        labels: [],
        datasets: [
            {
                label: "Score Over Time",
                data: [],
            },
        ],
    });

    // useEffect(() => {
    //     console.log("userData:", userData); // Add this line for debugging
    //     if (userData.length > 0) {
    //         const labels = userData.map((data) => {
    //             const timestamp = data.mapValue.fields.timestamp.integerValue;
    //             // const date = new Date(parseInt(timestamp, 10)); // Convert integer timestamp to Date object
    //             // return date.toLocaleString();
    //             return timestamp;
    //         });
    //         const scores = userData.map((data) => data.mapValue.fields.totalScore.integerValue);
    //         console.log(labels);
    //         console.log(scores);

    //         setPropData({
    //             labels: labels,
    //             datasets: [
    //                 {
    //                     label: "Score Over Time",
    //                     data: scores,
    //                 },
    //             ],
    //         });
    //     }
    // }, [userData]);

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
                        label: "Score Over Time",
                        data: dataPoints,
                        backgroundColor: 'red',
                        pointRadius: 0,
                    },
                ],
            });
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
        </>
    );
};

export default Statistics;