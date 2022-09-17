import React from "react";
import { Link } from "react-router-dom";
import Grid, { LinkCard, CardImageHeader, CardTextBody } from "./Grid";

export default function Highlights({ posts }) {

    const cardLead = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    let shortLead = cardLead.substring(0, 127);
    shortLead = shortLead.substring(0, shortLead.lastIndexOf(".") + 1);

    return (
        <section id="highlights" className="centre">
            <header>
                <h2>Highlights</h2>
            </header>

            <Grid>
                {posts && posts.map(post => <LinkCard to={`/blog/post/${post.id}`}>
                    <CardImageHeader src="https://via.placeholder.com/500x300" alt="" text={post.alias} />
                    <CardTextBody text={shortLead} />
                </LinkCard>
                )}
            </Grid>
        </section>
    );
}