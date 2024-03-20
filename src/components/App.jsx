import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainGame from "./MainGame";
import Account from "./Account";
import Shop from "./Shop";
import Home from "./Home";
import { Navbar } from "./Navbar";
import "../App.css"


function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mainGame" element={<MainGame />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/shop" element={<Shop />} />
                </Routes>
                <Navbar />
            </Router>
        </>
    );
}
export default App