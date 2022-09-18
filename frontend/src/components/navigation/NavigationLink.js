import React from "react";
import { Link } from 'react-router-dom';

function NavigationLink({ to, value, toggled, target }) {

    return (
        <Link className={toggled ? "show nav-link" : "nav-link"} 
              to={to} target={target || "_self"}>
            {value}
        </Link>
    )
}

export default NavigationLink;