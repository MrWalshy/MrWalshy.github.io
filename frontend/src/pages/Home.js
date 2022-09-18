import React, { useEffect, useState } from "react";
import PageHeader from "../components/header/PageHeader";
import Highlights from "../components/Highlights";

export default function Home() {

    const [idMap, setIdMap] = useState(null);
    const [idMapLoaded, setIdMapLoaded] = useState(false);
    const [errorLoadingIdMap, setErrorLoadingIdMap] = useState(false);

    const headerGreeting = "Welcome traveller of the net...";
    const lead = `Welcome to my website!
        Please feel free to peruse at your leisure. You will also find 
        some highlights from the site below, this is just the most recently 
        posted blog articles or projects.`;

    useEffect(() => {
        fetch("/id_map.json").then(response => response.json())
            .then(idMapData => {
                const filteredDirectories = {};
                // filter images out
                Object.keys(idMapData.directories).forEach(key => {
                    if (idMapData.directories[key].dir && idMapData.directories[key].dir !== "" && idMapData.directories[key].dir !== "img") {
                        filteredDirectories[key] = idMapData.directories[key];
                    }
                });
                // idMapData.directories = idMapData.directories.filter(dir => dir.dir !== "" && dir.dir !== "img");
                // idMapData.files = idMapData.files.filter(file => )
                idMapData.directories = filteredDirectories;
                setIdMap(idMapData);
                setIdMapLoaded(true);
            })
            .catch(error => {
                console.error(error);
                setErrorLoadingIdMap(true);
            });
    }, []);

    function getRecentlyCreatedPosts(count = 10) {
        if (idMap) {
            const files = [];

            for (const key of Object.keys(idMap.files)) {
                if (idMap.files[key].filetype === "html") {
                    files.push(idMap.files[key]);
                }
            }
            // order files by date descending
            files.sort((left, right) => {
                const leftDate = new Date(left.createdAt);
                const rightDate = new Date(right.createdAt);
                return rightDate - leftDate;
            });
            return files.slice(0, count);
        }
        return [];
    }

    return (
        <main>
            <PageHeader value={headerGreeting} lead={lead} />
            {/* {!idMapLoaded && <h2 className="centre">Loading highlights...</h2>} */}
            <Highlights posts={getRecentlyCreatedPosts(3)} />
            <div style={{padding: "32px"}}></div>
        </main>
    );
}