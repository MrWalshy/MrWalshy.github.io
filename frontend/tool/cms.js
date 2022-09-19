import express from "express";
import path from 'path';

import log from "./util/logging.js";
import { executeConfiguration, loadConfig } from "./util/dir_utils.js";

const port = process.env.PORT || 52555;
const host = process.env.HOST || "localhost";
const app = express();
let dirTree;

export function launchCms(configPath) {
    dirTree = prepareDirectoryTree(configPath);
    app.use(express.static("static"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    prepareRoutes();

    app.listen(port, host, () => log(`CMS started on: http://${host}:${port}`));
}

function prepareDirectoryTree(configPath) {
    const config = loadConfig(configPath);
    const tree = executeConfiguration(config, path.dirname(configPath));
    log(`Built directory tree:\n${JSON.stringify(tree, null, "  ")}`);
    return tree;
}

function prepareRoutes() {
    log("Preparing routes.");
    app.get("/directorytree", (request, response) => {
        if (dirTree) {
            return response.status(200).json(dirTree);
        } else {
            return response.status(500).send("Something went wrong retrieving the directory tree on the server...");
        }
    });
}