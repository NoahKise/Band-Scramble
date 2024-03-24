import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainGame from "./MainGame";
import Account from "./Account";
import Statistics from "./Statistics";
import Home from "./Home";
import { Navbar } from "./Navbar";
import { Header } from "./Header";
import "../App.css"


function App() {
    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mainGame" element={<MainGame />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
                <Navbar />
            </Router>
        </>
    );
}
export default App