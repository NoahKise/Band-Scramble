import { Data } from './Data';
import { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
    const [artist, setArtist] = useState("");
    const [revealed, setRevealed] = useState(false);
    const [mixedString, setMixedString] = useState("");
    const [resetClicked, setResetClicked] = useState(false); // State to track if reset button is clicked

    const RandomArtist = useCallback(() => {
        const index = Math.floor(Math.random() * Data.length);
        const newArtist = Data[index];
        setArtist(newArtist);
        setRevealed(false);
        setMixedString(ScrambledString(newArtist)); // Update mixedString with the scrambled string of the new artist
        setResetClicked(false);
    }, []);

    useEffect(() => {
        RandomArtist();
    }, [RandomArtist]);

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
        setResetClicked(!resetClicked); // Toggle the resetClicked state
    }

    const buttonLabel = revealed ? "Reset" : "Reveal";

    return (
        <div className="App">
            <h1>{GameBoard(artist)}</h1>
            <h1>{revealed ? artist : mixedString || ScrambledString(artist)}</h1>
            <button id='reveal' onClick={revealOrReset}>{buttonLabel}</button>
            <button id='rescramble' onClick={scramble}>Scramble</button>
        </div>
    );
}

export default App;