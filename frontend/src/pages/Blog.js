import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Blog(props) {

    const [config, setConfig] = useState(null);
    const [idMap, setIdMap] = useState(null);
    const [configLoaded, setConfigLoaded] = useState(false);
    const [idMapLoaded, setIdMapLoaded] = useState(false);
    const [errorLoadingConfig, setErrorLoadingConfig] = useState(false);
    const [errorLoadingIdMap, setErrorLoadingIdMap] = useState(false);

    useEffect(() => {
        // fetch config
        fetch("/config.json").then(response => response.json())
                             .then(configData => {
                                setConfig(configData);
                                setConfigLoaded(true);
                             })
                             .catch(error => {
                                console.error(error);
                                setErrorLoadingConfig(true);
                             });
        
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

    function getDirFromConfig(id) {
        function traverse(conf) {
            if (conf.id === id) return conf;

            for (const subdirectory of conf.subdirectories) {
                const c = traverse(subdirectory);
                if (c) return c;
            }
            return null;
        }
        return traverse(config);
    }

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

    class Category {
        constructor(id, name, description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    function getCategories() {
        if (idMap) {
            const categories = Object.keys(idMap.directories).map(key => new Category(
                key, idMap.directories[key].alias, idMap.directories[key].description || ""
            ));
            return categories;
        }
        return [];
    }

    return <>
        <Outlet context={{
            config, idMap,
            configLoaded, idMapLoaded,
            errorLoadingConfig, errorLoadingIdMap,
            getDirFromConfig, getRecentlyCreatedPosts,
            getCategories
        }} />
    </>;
}