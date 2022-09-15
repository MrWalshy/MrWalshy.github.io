import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BlogBoard() {

    const { dirId } = useParams();

    const { isLoaded, loadDirectoryMap, getAllTopics } = useOutletContext();

    const [blogDirMap, setBlogDirMap] = useState(null);

    // load config and root dir map
    useEffect(() => {
        if (isLoaded) setBlogDirMap(loadDirectoryMap(dirId));
    }, [isLoaded]);

    console.log(`Directory id was: ${dirId}`);
    return (
        <div className="container col" style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>
                <h3>Blog board for {dirId}</h3>
                <Link to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>
            </div>
            {/* Display a carousel of recent posts for this topic */}
            {/* <div className="carousel" style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>
                <h3>New posts....</h3>
                <Link to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>
            </div> */}

            {/* Display all subtopics */}
            <div>
                <h3 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Subtopics</h3>
                <section className="tiles">
                    {/* this is gross and needs extracting */}
                    {blogDirMap && dirId === blogDirMap.id && getAllTopics(blogDirMap).map(topic => <Link key={topic.id + Date.now()} to={`/blog/${topic.id}`} className="tile">
                        <p>{topic.name}</p>
                    </Link>)}
                </section>
            </div>
        </div>
    );
}