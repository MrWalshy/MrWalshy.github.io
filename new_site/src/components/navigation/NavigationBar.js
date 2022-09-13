import React, { useState } from "react";
import { Link } from 'react-router-dom';
import NavigationLink from "./NavigationLink";

function NavigationBar(props) {

    const [toggled, setToggled] = useState(false);

    function toggleMenu(event) {
        setToggled(previousState => {
            return !previousState;
        });
    }

    return (
        <nav id="navbar">
            <Link id='toggle' to="#" onClick={toggleMenu}>MENU</Link>
            <NavigationLink to="/" value="Home" toggled={toggled} />
            <NavigationLink to="/blog" value="Blog" toggled={toggled} />
        </nav>
    )
}

export default NavigationBar;