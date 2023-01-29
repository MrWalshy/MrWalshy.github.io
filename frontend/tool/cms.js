import express from "express";
import path from 'path';
import { getConfigurationFrom } from "./app.js";
import { argv } from "process";

let configuration;
const port = process.env.PORT || 52555;
const host = process.env.HOST || "localhost";
const app = express();

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default function launchCms() {
    console.log("Launching CMS");

    main();
}

function main() {
    const configurationLocation = path.resolve(argv[3]);
    if (!path.extname(configurationLocation) === ".json") throw new Error("Config must be a JSON file.");
    getConfigurationFrom(configurationLocation)
        .then(config => {
            configuration = JSON.parse(config);
            configuration.srcLocation = path.dirname(configurationLocation);
            prepareRoutes();
            app.listen(port, host, () => console.log(`CMS started on: http://${host}:${port}`));
        });
}

function prepareRoutes() {
    console.log("Preparing routes for CMS");

    // get the config JSON
    app.get("/config", (request, response) => {
        if (configuration) {
            return response.status(200).json(configuration);
        } else {
            return response.status(500).send("Something went wrong retrieving the directory tree on the server...");
        }
    });

    // create a directory

    // create a file
}