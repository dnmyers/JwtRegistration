import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    useLocation,
    Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Components
import NavBar from "./components/NavBar/NavBar";

// pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// helpers
import { history } from "./helpers/history";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const NavigationWrapper = () => {
    // Init custom history object to allow navigation from
    // anywhere in the react app (in/outside of components)
    history.navigate = useNavigate();
    history.location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Verify if the token is expired
        if (token) {
            const tokenExpiration = jwtDecode(token).exp;
            const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds

            // If the token is expired, remove it and user(if exists) from localStorage
            if (tokenExpiration < currentTimestamp) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }

        if (localStorage.getItem("user") === undefined) {
            localStorage.removeItem("user");
        }
    }, []);

    return (
        <div className='app'>
            <NavBar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='*' element={<Navigate to='/' />} />
            </Routes>
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <NavigationWrapper />
        </BrowserRouter>
    );
}
