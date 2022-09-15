import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { buildDirectoryMap, buildFileTree } from "../../utils/DirectoryMap";

export default function BlogHome(props) {

    const { isLoaded, loadDirectoryMap, getAllTopics } = useOutletContext();

    const [blogDirMap, setBlogDirMap] = useState(null);

    // load config and root dir map
    useEffect(() => {
        if (isLoaded) setBlogDirMap(loadDirectoryMap("blog"));
    }, [isLoaded]);

    return <div>
        {/* Page grid
            - Row 1: New...
            - Row 2: Recently updated...
            - Row 3: Grid of topics
        */}
        <div className="container col" style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <div>
                <h1 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Main blog board</h1>
            </div>
            {/* TODO: New and recently updated posts carousels */}
            {/* <div className="carousel">
                <h3 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>New posts....</h3>
            </div>
            <div className="carousel">
                <h3 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Recently updated....</h3>
            </div> */}

            {/* Grid of topics */}
            <div>
                <h3 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Topics</h3>
                <section className="tiles">
                    {getAllTopics(blogDirMap).map(topic => <Link key={topic.id + Date.now()} to={`/blog/${topic.id}`} className="tile">
                        <p>{topic.name}</p>
                    </Link>)}
                </section>
            </div>
        </div>
    </div>;
}