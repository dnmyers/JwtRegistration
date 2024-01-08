import { useState } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

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
                </Nav>
            </Collapse>
        </Navbar>
    );
};

export default NavBar;
