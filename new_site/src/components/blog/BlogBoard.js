import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { buildFileTree } from "../../utils/FileTree";
import { Link } from "react-router-dom";

export default function BlogBoard() {

    const { dirId } = useParams();

    const { isLoaded, loadDirectoryMap, getAllTopics } = useOutletContext();

    const [blogDirMap, setBlogDirMap] = useState(null);

    // load config and root dir map
    useEffect(() => {
        if (isLoaded) setBlogDirMap(loadDirectoryMap(dirId));
    }, [isLoaded, loadDirectoryMap, dirId]);

    console.log(`Directory id was: ${dirId}`);
    return (
        <div className="container col" style={{
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Display a carousel of recent posts for this topic */}
            <div className="carousel" style={{backgroundColor: "lightslategray"}}>
                <h3>New posts....</h3>
            </div>
            <Link to={`/blog/${dirId}/posts`}>View all posts for this topic...</Link>

            {/* Display all subtopics */}
            <div style={{backgroundColor: "lightslategray"}}>
                <h3 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Subtopics</h3>
                <section className="tiles">
                    {getAllTopics(blogDirMap).map(topic => <Link key={topic.id + Date.now()} to={`/blog/${topic.id}`} className="tile">
                        <p>{topic.name}</p>
                    </Link>)}
                </section>
            </div>
        </div>
    );
}