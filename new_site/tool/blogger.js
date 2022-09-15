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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processor = unified()
    .use(remarkParse) // parse MD into AST
    .use(remarkToc)
    .use(remarkRehype) // parse MD AST into HTML AST I think
    .use(rehypeFormat)
    .use(rehypeStringify); // parse HTML AST to HTML

let logNumber = 1;
function log(message) {
    const date = new Date();
    let [year,month,day,hour,min,sec] = [
        date.getFullYear(), date.getMonth() + 1,
        date.getDate(), date.getHours(),
        date.getMinutes(), date.getSeconds()
    ];
    const dateString = `${year}-${month < 10 ? "0" + month : month}-${day} ${hour}:${min}:${sec}`;
    console.log(`[[${logNumber++}]:${dateString}]: ${message}`);
}

class Directory {

    constructor(dir, alias, createdAt, subdirectories, files, location) {
        this.dir = dir;
        this.alias = alias;
        this.createdAt = createdAt;
        this.subdirectories = subdirectories;
        this.files = files;
        this.location = location;
    }
}

function loadConfig(location) {
    try {
        log("Loading configuration");
        if (!fs.existsSync(location)) throw new Error(`Supplied configuration file doesn not exist: ${location}`)
        const config = fs.readFileSync(location, {
            encoding: "utf-8"
        });
        log(`Loaded configuration successfully from: ${location}`);
        return JSON.parse(config);
    } catch (error) {
        throw new Error(error.message);
    }
}

function discoverSubDirectories(config, location) {
    const subdirectories = [];
    for (const directory of config.include) {
        log(`Resolving directory ${path.resolve(location, directory)}`);
        const configPath = path.resolve(location, directory, "config.json");
        const config = loadConfig(configPath);
        subdirectories.push(executeConfiguration(config, path.dirname(configPath)));
    }
    return subdirectories;
}

function executeConfiguration(config, location) {
    config.location = location;
    log(`Executing configuration from: ${location}\n${JSON.stringify(config, null, "  ")}`);
    
    try {
        let subdirectories = discoverSubDirectories(config, location);
        let dir = new Directory(config.dir || "", config.alias, config.createdAt, subdirectories, config.files, location);
        log(`Built directory: ${dir.alias}`);
        return dir;
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

function createDirectory(location) {
    log(`Creating location: ${location}`);
    // if (fs.existsSync(location)) {
    //     log(`Location already exists, deleting before creation.`);
    //     fs.rmSync(location, { 
    //         recursive: true,
    //         force: true
    //      });
    //     log(`Removed old location.`);
    // }

    if (fs.existsSync(location)) {
        log(`Location already exists, skipping creation.`);
    } else {
        fs.mkdirSync(location, { recursive: true });
        log(`Created location successfully: ${location}`);
    }
}

function processFile(tree, location, metadata, file) {
    log(`Preparing to transfer file: ${metadata.filename}`);
    const type = metadata.filetype === "md" ? "html" : metadata.filetype;
    const fullFileName = `${metadata.filename}.${type}`;
    const originalLocation = path.resolve(tree.location, fullFileName);
    const outputLocation = path.resolve(location, fullFileName);

    try {
        if (metadata.filetype === "md") {
            log(`Processing Markdown file: ${metadata.filename}`);
            const htmlFile = processor.processSync(file.toString());
            log(`Conversion to HTML successful. Writing to file: ${outputLocation}`);
            fs.writeFileSync(outputLocation, htmlFile.value);
            log(`Wrote HTML successfully to file: ${outputLocation}`);
        } else {
            // just copy
            log(`Copying file '${fullFileName}' to '${outputLocation}'`);
            log(`Original location: ${originalLocation}`);
            fs.copyFileSync(originalLocation, outputLocation);
            log(`Copied '${fullFileName}' to '${outputLocation}'`)
        }
    } catch (error) {
        throw new Error(`Error processing: ${metadata.filename}`);
    }
}

function processFiles(tree, location) {
    // this function will do the converting from markdown to HTML
    // and copy the files to the appropriate dir in the output location
    // - the output location is location
    log(`Processing files for directory tree '${tree.alias}' for output location: ${location}`);

    for (const file of tree.files) {
        log(`Processing file: ${file.filename}.${file.filetype}`);
        log(`File alias: ${file.alias}`);

        try {
            const f = fs.readFileSync(path.resolve(tree.location, `${file.filename}.${file.filetype}`));
            log(`Retrieved '${file.filename}' successfully.`);
            processFile(tree, location, file, f);
        } catch (error) {
            console.error(error.message);
            log(`Error encountered, skipping file: ${file.filename}.${file.filetype}`);
        }
    }
    // after processing the files, update the trees location
    log(`Processed all files. Updating location of tree '${tree.alias}' from '${tree.location}' to '${location}'`);
    tree.location = location;
}

/*
    Takes the given directory tree and attempts to 
    copy and convert files to a new location, mutating the 
    tree in the process.
*/
function processDirectoryTree(tree, location) {
    log(`Received directory tree for output location: ${location}`);
    
    try {
        // output location
        createDirectory(location);

        log(`Processing subdirectories for: ${tree.alias}`);
        for (const dir of tree.subdirectories) {
            log(`Processing subdirectory: ${dir.alias} to ${path.resolve(location, dir.dir)}`);
            processDirectoryTree(dir, path.resolve(location, dir.dir));
        }
        processFiles(tree, location);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

function outputDirectoryTree(tree) {
    log(`Preparing to output directory tree to: ${tree.location}`);

    fs.writeFileSync(path.resolve(tree.location, "config.json"), JSON.stringify(tree, null, "  "));
    log(`Outputted directory tree to '${tree.location}' successfully`);
}

function main() {
    // Get main config argument, exit with error code otherwise
    try {
        if (process.argv.length === 2 || process.argv.length > 3) {
            throw new Error("Too few or too many arguments...\n\n\tUsage: node blogger.js ./config.json")
        } else {
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
                log(`Build successful!`);
            } else throw new Error(`Invalid config path supplied.`);
        }
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

main();