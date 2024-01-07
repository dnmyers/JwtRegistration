import axios from "axios";
import { useState, useEffect } from "react";

const HomePage = () => {
    const [data, setData] = useState("default");

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_REACT_APP_API_SERVER_HOST_URL;
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        if (data == "default") {
            axios
                .get(`${baseUrl}/api/resources`)
                .then((resp) => {
                    const data = resp.data;

                    setData(data);
                })
                .catch((err) => console.error(err));
        }
    });

    return <div>Home Page {data}</div>;
};

export default HomePage;
