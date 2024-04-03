import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

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

    useEffect(() => {
        console.log("userData:", userData); // Add this line for debugging
        if (userData.length > 0) {
            const labels = userData.map((data) => {
                const timestamp = data.mapValue.fields.timestamp.integerValue;
                const date = new Date(parseInt(timestamp, 10)); // Convert integer timestamp to Date object
                return date.toLocaleString();
            });
            const scores = userData.map((data) => data.mapValue.fields.totalScore.integerValue);
            console.log(labels);
            console.log(scores);

            setPropData({
                labels: labels,
                datasets: [
                    {
                        label: "Score Over Time",
                        data: scores,
                    },
                ],
            });
        }
    }, [userData]);

    return (
        <>
            <h1 className='header'>Statistics</h1>
            <Line data={propData} />
        </>
    );
};

export default Statistics;