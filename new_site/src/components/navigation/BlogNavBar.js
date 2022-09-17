import React from "react";

export default function BlogNavBar(props) {

    return (
        <nav className="centre" style={{
            paddingBottom: "52px",
            borderBottom: "solid 1px black"
        }}>
            <ul className="menu">
                <li className="submenu menu-btn"><button>Programming &#9759;</button>
                    <ul>
                        <li className="menu-btn"><a href="/blog">Java</a></li>
                        <li className="menu-btn"><a href="/blog">JavaScript</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}