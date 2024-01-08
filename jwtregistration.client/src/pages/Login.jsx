import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    Row,
    Col,
} from "reactstrap";

const LoginPage = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("dn8326");
    const [password, setPassword] = useState("Mypass1*");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginPayload = {
            userName,
            password,
        };

        axios
            .post("https://localhost:7171/authorization/token", loginPayload)
            .then((response) => {
                const token = response.data.authorizationToken;

                localStorage.setItem("token", token);

                if (token) {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                }

                navigate("/");
            })
            .catch((err) => console.log(err));
    };

    const handleUserNameChange = (e) => {
        setUserName({ value: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ value: e.target.value });
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
                            Login
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup floating>
                                    <Input
                                        id='userName'
                                        name='userName'
                                        type='text'
                                        value={userName}
                                        onChange={handleUserNameChange}
                                        placeholder='User Name'
                                    />
                                    <Label for='userName'>User Name</Label>
                                </FormGroup>
                                <FormGroup floating>
                                    <Input
                                        id='password'
                                        name='password'
                                        type='password'
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder='Password'
                                    />
                                    <Label for='password'>Password</Label>
                                </FormGroup>
                                <Button
                                    color='primary'
                                    onClick={() => navigate("/home")}
                                    type='submit'
                                >
                                    Login
                                </Button>
                                <Button
                                    type='button'
                                    onClick={() => navigate("/register")}
                                    className='btn-link my-3'
                                >
                                    Register
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
