import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("dn8326");
    const [password, setPassword] = useState("Mypass1*");

    const handleSubmit = (e) => {
        e.preventDefault();

        const baseUrl = import.meta.env.VITE_REACT_APP_API_SERVER_HOST_URL;

        const loginPayload = {
            userName,
            password,
        };

        axios
            .post(`${baseUrl}/authorization/token`, loginPayload)
            .then((resp) => {
                const token = resp.data.authorizationToken;

                localStorage.setItem("token", token);

                if (token) {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                }

                navigate("/");
            })
            .catch((err) => console.error(err));
    };

    const handleUserNameChange = (e) => {
        setUserName({ value: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ value: e.target.value });
    };

    return (
        <div className='card'>
            <h2 className='card-header'>Login Page</h2>
            <div className='card-body'>
                <form onSubmit={handleSubmit}>
                    <div className='form-group form-floating'>
                        <input
                            type='text'
                            className='form-control'
                            id='userName'
                            value={userName}
                            onChange={handleUserNameChange}
                        />
                        <label htmlFor='userName'>User Name</label>
                    </div>
                    <div className='form-group form-floating'>
                        <input
                            type='password'
                            className='form-control'
                            id='password'
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <label htmlFor='password'>Password</label>
                    </div>
                    <button type='submit' className='btn btn-primary'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
