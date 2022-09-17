import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";

export default function BlogPostBoard() {

    const { 
        config, idMap,
        configLoaded, idMapLoaded,
        errorLoadingConfig, errorLoadingIdMap,
        getDirFromConfig
     } = useOutletContext();
    const { dirId } = useParams();


    function displayFiles() {
        // console.log(`Display files for: ` + JSON.stringify(blogDirMap, null, "  "))
        // return blogDirMap.files.filter(file => file.filetype === "md")
        //     .map(file => <Link key={file.id + Date.now()} to={`/blog/${dirId}/${file.id}`} className="tile">
        //         <p>{file.alias}</p>
        //     </Link>);
        const dir = getDirFromConfig(dirId);
        console.log(dir);
        return dir.files.map(file => {
            return <p className="tile" key={file.id + Date.now()}
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                        <Link style={{ textDecoration: "none" }} to={`/blog/post/${file.id}`}>
                            {file.alias}
                        </Link>
                    </p>;
        });
    }

    return (
        <>
            {/* {idMapLoaded && <h1 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>
                {idMap.directories[dirId].alias}
            </h1>} */}
            {idMapLoaded && <div style={{ 
                backgroundColor: "whitesmoke", 
                height: "240px", display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingBottom: "32px"
            }}> 
                <h1 style={{ 
                    margin: "0 auto",
                    padding: "0",
                    width: "80%",
                    color: "black"
                }}>{idMap.directories[dirId].alias}</h1>
                <p style={{
                    margin: "0 auto",
                    padding: "0",
                    width: "80%",
                    color: "black"
                }}>
                    All posts...
                </p>
            </div>}

            {/* Tiles with the post names on
                - poss short descriptions in the future
                - only direct children of the topic, i.e., files of the dir
            */}
            {configLoaded && idMapLoaded && <div style={{
                padding: "0",
                width: "80%",
                margin: "0 auto"
            }}>
                <section className="tiles" style={{ padding: "0", margin: 0 }}>
                {/* {mapIsLoaded() && blogDirMap.files
                           .filter(file => file.fileType === "md")
                           .map(file => <Link key={file.id + Date.now()} to={`/blog/${dirId}/${file.id}`} className="tile">
                    {file.alias}
                </Link>)} */}
                    {idMapLoaded && displayFiles()}
                </section>
            </div>}
        </>
    );
}