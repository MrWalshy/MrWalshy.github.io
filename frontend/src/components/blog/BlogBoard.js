import React from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import Grid, { CardTextBody, CardTextHeader, LinkCard } from "../Grid";
import PageHeader from "../header/PageHeader";

export default function BlogBoard() {

    const { 
        idMap, idMapLoaded,
        getDirFromConfig
     } = useOutletContext();
    const { dirId } = useParams();

    return (
        <main>
            <PageHeader value={idMapLoaded && idMap.directories[dirId].alias}
                        lead={<Link style={{color: "black", textDecoration: "none"}} to={`/blog/${dirId}/posts`}>{">"} View all posts for this topic...</Link>} />
            {/* Display a carousel of recent posts for this topic */}
            {/* <div className="carousel" style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>
                <h3>New posts....</h3>
                <Link to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>
            </div> */}

            {/* Display all subtopics */}
            <div className="centre">
                <h2>Categories...</h2>
                <Grid>
                    {idMapLoaded && getDirFromConfig(dirId).subdirectories.map(dir => (
                        <LinkCard key={dir.id}
                                  to={`/blog/board/${dir.id}`}>
                            <CardTextHeader text={dir.alias} />
                            <CardTextBody text={dir.description} />
                        </LinkCard>
                    ))}
                </Grid>
            </div>
        </main>
    );
}