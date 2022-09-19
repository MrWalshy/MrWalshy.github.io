import { argv } from 'process';
import inquirer from 'inquirer';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

// deps for parsing markdown to HTML
import { stream } from 'unified-stream';
import { unified } from 'unified';
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkToc from 'remark-toc';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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
        if (process.argv.length === 2 || process.argv.length > 3) {
            throw new Error("Too few or too many arguments...\n\n\tUsage: node blogger.js [./config.json | -cms]")
        } else if (process.argv[2] === "-cms") {
            log("Launching CMS...");
            launchCms();
        } else {
            log(`Attempting build...`);
            build();
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

main();