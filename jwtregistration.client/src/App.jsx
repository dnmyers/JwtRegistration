import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import NavBar from "./components/NavBar/NavBar";

import "./App.css";

// pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";

export default function App() {
    return (
        <>
            <NavBar />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
