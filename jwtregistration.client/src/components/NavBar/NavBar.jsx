import { useState, useEffect } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button,
} from "reactstrap";

import { history } from "../../helpers/history";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        history.navigate("/");

        window.location.reload();
    };

    return (
        <Navbar color='dark' dark className='my-2'>
            <NavbarBrand href='/'>JwtRegistration</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className='mr-auto' navbar>
                    <NavItem>
                        <NavLink href='/login'>Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href='/register'>Register</NavLink>
                    </NavItem>
                    {localStorage.getItem("token") && (
                        <NavItem>
                            <Button
                                type='button'
                                onClick={logout}
                                className='btn-link'
                            >
                                Logout
                            </Button>
                        </NavItem>
                    )}
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default NavBar;
