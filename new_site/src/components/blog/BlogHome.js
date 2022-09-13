import React, { useState, useEffect } from "react";
import { buildFileTree } from "../../utils/FileTree";

export default function BlogHome(props) {

    const [fileTree, setFileTree] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetch("./resources/config.json")
            .then(res => res.json())
            .then(data => {
                console.log("Building file tree:");
                buildFileTree(data).then(ft => {
                    setFileTree(ft);
                    setIsLoaded(true);
                });
            })
            .catch(error => console.log(error));
    }, []);

    const buildTree = (ft) => {
        return <div>
            <h3>{"[DIR] " + (ft.name || "root")}</h3>
            <ul>
                {ft.directories.map(dir => <li key={dir.rel}>{buildTree(dir)}</li>)}
                {ft.files.map(file => <li key={file.rel}>{"[FILE] " + file.name}</li>)}
            </ul>
        </div>;
    }

    const BlogLink = ({ name, path }) => {
        return <a href={path}><h3>{name}</h3></a>;
    }

    // gets the names of all file trees within the file tree,
    // recursively
    function getFileTreeDirectories() {
        const dirs = [];

        function recurse(ft) {
            dirs.push({
                name: ft.name,
                path: ft.path
            });
            for (const dir of ft.directories) recurse(dir);
        }
        recurse(fileTree);
        return dirs;
    }

    const blogTopicDisplay = () => (
        <div>
            {getFileTreeDirectories().map(dir => <BlogLink key={dir.path} name={dir.name} path={`/blog?location=${dir.path}`} />)}
        </div>
    );

    return <div>
        {isLoaded && blogTopicDisplay()}
    </div>;
}