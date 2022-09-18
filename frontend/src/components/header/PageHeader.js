import React from "react";

export default function PageHeader({value, lead}) {
    return (
        <header id="page-header">
            <h2>{value}</h2>
            {lead && <p>{lead}</p>}
        </header>
    );
}