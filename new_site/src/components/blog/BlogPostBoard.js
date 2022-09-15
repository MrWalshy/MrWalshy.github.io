import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";

export default function BlogPostBoard() {

    const { dirId } = useParams();

    const { isLoaded, loadDirectoryMap, getAllTopics } = useOutletContext();

    const [blogDirMap, setBlogDirMap] = useState(null);

    useEffect(() => {
        if (isLoaded) setBlogDirMap(loadDirectoryMap(dirId));
    }, [isLoaded, loadDirectoryMap, dirId]);

    function mapIsLoaded() {
        console.log(`Blog dir map [post board]: ${JSON.stringify(blogDirMap, null, "  ")}`)
        if (blogDirMap) return true;
    }

    function displayFiles() {
        console.log(`Display files for: ` + JSON.stringify(blogDirMap, null, "  "))
        return blogDirMap.files.filter(file => file.filetype === "md")
            .map(file => <Link key={file.id + Date.now()} to={`/blog/${dirId}/${file.id}`} className="tile">
                <p>{file.alias}</p>
            </Link>);
    }

    return (
        <div>
            <h1 style={{ padding: "8px", paddingLeft: "16px", margin: 0, marginTop: "8px" }}>Posts related to {dirId}</h1>

            {/* Tiles with the post names on
                - poss short descriptions in the future
                - only direct children of the topic, i.e., files of the dir
            */}
            <section className="tiles">
                {/* {mapIsLoaded() && blogDirMap.files
                           .filter(file => file.fileType === "md")
                           .map(file => <Link key={file.id + Date.now()} to={`/blog/${dirId}/${file.id}`} className="tile">
                    {file.alias}
                </Link>)} */}
                {mapIsLoaded() && displayFiles()}
            </section>
        </div>
    );
}