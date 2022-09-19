import { argv } from 'process';
import inquirer from 'inquirer';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

import { launchCms } from './cms.js';
import log from './util/logging.js';
import { executeConfiguration, loadConfig, outputDirectoryTree, outputIdMap, processDirectoryTree } from './util/dir_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function build() {
    const configPath = path.resolve(process.argv[2]);

    if (!path.extname(configPath) === ".json") throw new Error(`Invalid file type supplied. Must be a JSON file.`);

    if (fs.existsSync(configPath)) {
        log("Seemingly valid config supplied.");
        const config = loadConfig(configPath);
        const tree = executeConfiguration(config, path.dirname(configPath));
        log(`Built directory tree:\n${JSON.stringify(tree, null, "  ")}`);
        const outputLocation = path.resolve(path.dirname(configPath), config.outputLocation);
        log(`Preparing to output build to: ${outputLocation}`);
        processDirectoryTree(tree, outputLocation);
        log(`Processed directory tree: \n${JSON.stringify(tree, null, "  ")}`);
        outputDirectoryTree(tree);
        outputIdMap(tree);
        log(`Build successful!`);
    } else throw new Error(`Invalid config path supplied.`);
}

function main() {
    // Get main config argument, exit with error code otherwise
    try {
        if (process.argv.length === 2 || process.argv.length > 4) {
            throw new Error("Too few or too many arguments...\n\n\tUsage: node blogger.js [./config.json | -cms ./config.json]")
        } else if (process.argv[2] === "-cms" && process.argv[3]) {
            const configPath = path.resolve(process.argv[3]);
            if (!path.extname(configPath) === ".json") throw new Error(`Invalid file type supplied. Must be a JSON file.`);
            log("Launching CMS...");
            launchCms(configPath);
        } else if (process.argv[2] !== "-cms") {
            log(`Attempting build...`);
            build();
        } else throw new Error("Invalid arguments supplied...\n\n\tUsage: node blogger.js [./config.json | -cms ./config.json]")
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

main();