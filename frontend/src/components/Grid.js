import React from "react";
import { Link } from "react-router-dom";

export default function Grid({ children }) {
    return <div className="grid">{children}</div>;
}

export function LinkCard({ children, to }) {
    return <article className="link-card">
        <Link to={to}>
            {children}
        </Link>
    </article>;
};

export function CardTextHeader({ text }) {
    return <header className="card-header">
        <h5>{text}</h5>
    </header>;
}

export function CardImageHeader({ text, src, alt = ""}) {
    return <header className="card-image-header">
        <img src={src}
            alt={alt}
            className="thumbnail" />
        <h5>{text}</h5>
    </header>;
};

export function CardTextBody({ text }) {
    return <div className="card-content">
        <p>{text}</p>
    </div>;
};

// exports.Grid = Grid;
// exports.LinkCard = LinkCard;