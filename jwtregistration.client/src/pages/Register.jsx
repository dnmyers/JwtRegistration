import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Col,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router";

const RegisterPage = () => {
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState();
    const [confirmedPassword, setConfirmedPassword] = useState();

    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_REACT_APP_API_SERVER_HOST_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmedPassword) {
            const registerPayload = {
                userName,
                email,
                phoneNumber,
                password,
            };

            axios
                .post(`${baseUrl}/register`, registerPayload)
                .then((resp) => {
                    const token = resp.data.authorizationToken;
                    const user = resp.data;

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", user);

                    if (token) {
                        axios.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${token}`;
                    }

                    navigate("/");
                })
                .catch((err) => console.error(err));
        } else {
            alert("Passwords do not match");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case "userName":
                setUserName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "phoneNumber":
                setPhoneNumber(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmedPassword":
                setConfirmedPassword(value);
                break;
            default:
                break;
        }
    };

    return (
        <Container className='mt-5'>
            <Row>
                <Col
                    sm={{
                        offset: 3,
                        size: 6,
                    }}
                >
                    <Card>
                        <CardHeader tag='h2' className='text-center'>
                            Register
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup floating>
                                    <Input
                                        id='userName'
                                        name='userName'
                                        type='text'
                                        value={userName}
                                        onChange={handleChange}
                                    />
                                    <Label for='userName'>User Name</Label>
                                </FormGroup>
                                <FormGroup floating>
                                    <Input
                                        id='email'
                                        name='email'
                                        type='email'
                                        value={email}
                                        onChange={handleChange}
                                    />
                                    <Label for='email'>Email</Label>
                                </FormGroup>
                                <FormGroup floating>
                                    <Input
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        type='text'
                                        value={phoneNumber}
                                        onChange={handleChange}
                                    />
                                    <Label for='phoneNumber'>
                                        Phone Number
                                    </Label>
                                </FormGroup>
                                <FormGroup floating>
                                    <Input
                                        id='password'
                                        name='password'
                                        type='password'
                                        value={password}
                                        onChange={handleChange}
                                    />
                                    <Label for='password'>Password</Label>
                                </FormGroup>
                                <FormGroup floating>
                                    <Input
                                        id='confirmedPassword'
                                        name='confirmedPassword'
                                        type='password'
                                        value={confirmedPassword}
                                        onChange={handleChange}
                                    />
                                    <Label for='confirmedPassword'>
                                        Confirm Password
                                    </Label>
                                </FormGroup>
                                <Button type='submit' color='primary'>
                                    Register
                                </Button>
                                <Button
                                    type='button'
                                    className='btn-link my-3'
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
