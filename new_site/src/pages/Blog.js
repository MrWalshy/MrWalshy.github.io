import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { buildDirectoryMap } from "../utils/DirectoryMap";

export default function Blog(props) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [config, setConfig] = useState(null);

    function loadDirectoryMap(id) {
        if (!config) throw new Error("Configuration not loaded.");
        const dirMap = buildDirectoryMap(id, config);
        console.log(dirMap);
        return dirMap;
    }

    async function getFile(dirId, fileId) {
        const dir = loadDirectoryMap(dirId);
        if (!dir) throw new Error("Invalid directory id supplied.");
        const file = dir.files.find(file => file.id === fileId);
        if (!file) throw new Error("Invalid file id supplied.");

        console.log(`Fetching file: ./resources${dir.path}/${file.filename}`);
        const res = await fetch(`/resources${dir.path}/${file.filename}`);
        const data = await res.text();
        file.data = data;
        console.log(`Retrieved file: ${JSON.stringify(data, null, "  ")}`)
        return file;
    }

    function getAllTopics(rootMap) {
        // blog has subDirectories, each subDirectory is a topic
        // - each subDirectory of those subdirectories is also a topic, i.e, recursively find them all
        function getSubTopics(dirMap) {
            let subDirs = [];
        
            for (const subDirectory of dirMap.subDirectories) {
                // push the subDir into the array
                subDirs.push(subDirectory);

                // merge the old subDirs with the result of calling getSubTopics on the sub directories dirMap
                subDirs = [...subDirs, ...getSubTopics(loadDirectoryMap(subDirectory.id))];
            }
            return subDirs;
        }

        if (!rootMap) return [];
        const subTopics = getSubTopics(rootMap);
        console.log(`Subtopics of ${rootMap.id}: ${JSON.stringify(subTopics, null, "  ")}`);
        return subTopics;
    }

    // load config and root dir map
    useEffect(() => {
        fetch("/resources/blog_config.json")
            .then(response => response.json())
            .then(data => {
                setConfig(data);
                setIsLoaded(true);
            })
            .catch(error => console.error(error));
    }, []);

    return <>
        <Outlet context={{
            isLoaded, setIsLoaded,
            config, setConfig,
            loadDirectoryMap,
            getAllTopics,
            getFile
        }} />
    </>;
}