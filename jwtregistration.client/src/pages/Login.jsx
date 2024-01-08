import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const LoginPage = () => {
    const navigate = useNavigate();

    // Form fields
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Redirect to homepage if user already logged in
        if (localStorage.getItem("token")) navigate("/home");
    }, [navigate]);

    // Form validation rules
    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("User Name is required"),
        password: Yup.string().required("Password is required"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // Functions to build form returned by useForm() hook
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState,
    } = useForm(formOptions);
    const { errors: formErrors, isSubmitting: formIsSubmitting } = formState;

    const onFormSubmit = (e) => {
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
            <h2 className='card-header'>Login</h2>
            <div className='card-body'>
                <Form onSubmit={handleFormSubmit(onFormSubmit)}>
                    <FormGroup floating>
                        <Input
                            id='userName'
                            name='userName'
                            type='text'
                            value={userName}
                            onChange={handleUserNameChange}
                            placeholder='User Name'
                            {...register("userName")}
                            className={`form-control ${
                                formErrors.userName ? "is-invalid" : ""
                            }`}
                        />
                        <Label for='userName'>User Name</Label>
                        <div className='invalid-feedback'>
                            {formErrors.userName?.message}
                        </div>
                    </FormGroup>
                    <FormGroup floating>
                        <Input
                            id='password'
                            name='password'
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder='Password'
                            {...register("password")}
                            className={`form-control ${
                                formErrors.password ? "is-invalid" : ""
                            }`}
                        />
                        <Label for='password'>Password</Label>
                        <div className='invalid-feedback'>
                            {formErrors.password?.message}
                        </div>
                    </FormGroup>
                    <Button
                        color='primary'
                        onClick={() => navigate("/home")}
                        disabled={formIsSubmitting}
                        type='submit'
                    >
                        {formIsSubmitting && (
                            <span className='spinner-border spinnder-border-sm mr-1'></span>
                        )}
                        Login
                    </Button>
                    <Button
                        type='button'
                        onClick={() => navigate("/register")}
                        className='btn-link mt-3'
                    >
                        Register
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
