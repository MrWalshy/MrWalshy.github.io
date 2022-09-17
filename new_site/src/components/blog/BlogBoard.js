import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BlogBoard() {

    const { 
        config, idMap,
        configLoaded, idMapLoaded,
        errorLoadingConfig, errorLoadingIdMap,
        getDirFromConfig, getRecentlyCreatedPosts
     } = useOutletContext();
    const { dirId } = useParams();

    function displaySubtopics() {
        const dir = getDirFromConfig(dirId);
        console.log(JSON.stringify(dir, null, "  "))
        return <>
            {dir.subdirectories.map(dir => (
                <Link key={dir.id + "subtopic"}
                      to={`/blog/board/${dir.id}`}
                      className="tile"
                ><p>{dir.alias}</p></Link>
            ))}
        </>;
    }

    return (
        <>
            {idMapLoaded && <div style={{ 
                backgroundColor: "whitesmoke", 
                height: "240px", display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingBottom: "32px"
            }}>
                <h1 style={{ 
                    // padding: "8px", paddingLeft: "16px", 
                    margin: "0 auto", //marginTop: "8px",
                    // marginLeft: "auto", marginRight: "auto",
                    padding: "0",
                    width: "80%",
                    color: "black"
                }}>{idMap.directories[dirId].alias}</h1>
                <p style={{
                        margin: "0 auto",
                        padding: "0",
                        width: "80%"
                    }}>
                    <Link style={{color: "black"}} to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>
                </p>
            </div>}
            {/* Display a carousel of recent posts for this topic */}
            {/* <div className="carousel" style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>
                <h3>New posts....</h3>
                <Link to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>
            </div> */}

            {/* Display all subtopics */}
            {configLoaded && idMapLoaded && <div style={{
                padding: "0",
                width: "80%",
                margin: "0 auto"
            }}>
                <h3 style={{ padding: "0", margin: 0 }}>Subtopics</h3>
                <section style={{ padding: "0", margin: 0 }} className="tiles">
                    {displaySubtopics()}
                </section>
            </div>}
        </>
    );
}