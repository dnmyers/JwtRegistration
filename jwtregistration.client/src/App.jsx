import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import NavBar from "./components/NavBar/NavBar";

// pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
    return (
        <div className='app'>
            <NavBar />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
