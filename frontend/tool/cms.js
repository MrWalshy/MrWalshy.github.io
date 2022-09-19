import log from "./util/logging.js";
import express from "express";

const port = process.env.PORT || 52555;
const host = process.env.HOST || "localhost";

export function launchCms() {
    const app = express();
    app.use(express.static("static"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.listen(port, host, () => log(`CMS started on: http://${host}:${port}`));
}