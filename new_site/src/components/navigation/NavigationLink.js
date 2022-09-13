import React from "react";
import { Link } from 'react-router-dom';

function NavigationLink({ to, value, toggled }) {

    return (
        <Link className={toggled ? "show nav-link" : "nav-link"} 
              to={to}>
            {value}
        </Link>
    )
}

export default NavigationLink;