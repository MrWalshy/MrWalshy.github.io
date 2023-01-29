import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import launchCms from './cms.js';

// markdown processor
const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype) // MD AST -> HTML AST
    .use(rehypeKatex) // math symbols, similar to latex
    .use(rehypeFormat)
    .use(rehypeStringify); // HTML AST to HTML text

const { argv } = process;

function build() {
    // check for config location
    const configurationLocation = path.resolve(argv[2]);
    if (!path.extname(configurationLocation) === ".json") throw new Error("Config must be a JSON file.");
    const config = getConfigurationFrom(configurationLocation);

    config.then(configData => {
        console.log(`Configuration successfully loaded from: ${configurationLocation}`);
        processConfiguration(JSON.parse(configData), path.dirname(configurationLocation));
    });
}

export function getConfigurationFrom(location) {
    console.log("Attempting to load configuration from filesystem...");

    return fs.readFile(location, {
        encoding: "utf-8"
    });
}

function outputConfigFile(configuration) {
    fs.writeFile(path.resolve(configuration.location, "config.json"), JSON.stringify(configuration, null, "  "));
}

function processConfiguration(configuration, configurationLocation) {
    console.log(`Processing configuration.`);
    console.log(configurationLocation);
    configuration.srcLocation = configurationLocation;
    createOutputLocation(configurationLocation, configuration)
        .then(() => createOutputDirectories(configuration)) // (root output location is put on the configuration object by createOutputLocation)
        .then(() => processFiles(configuration)) // output locations are created, files can be processed asynchronously
        .then(() => {
            console.log("All files processed and output.");
            configuration.location = configuration.outputLocation;
            delete configuration.outputLocation;
            delete configuration.srcLocation;
            configuration.files.forEach(file => delete file.processor);

            outputConfigFile(configuration);
        })
        .catch(error => {
            throw new Error(error.message);
        });
}

const pathExists = (path) => new Promise(resolve => fsSync.access(path, fsSync.constants.F_OK, error => resolve(!error)));

const createOutputLocation = (configurationLocation, configuration) => new Promise((resolve, reject) => {
    console.log("Creating output location...");

    if (path.isAbsolute(configuration.outputLocation)) {
        console.log("Absolute output location supplied");
    } else {
        console.log("Relative path specified. Building system specific output location.");
        configuration.outputLocation = path.resolve(configurationLocation, configuration.outputLocation);
        console.log(`Built output path: ${configuration.outputLocation}`);
    }

    pathExists(configuration.outputLocation)
        .then(outputLocationExists => handleCreation(outputLocationExists, configuration))
        .then(() => resolve())
        .catch((error) => reject(error.message));
});


const handleCreation = (outputLocationExists, configuration) => new Promise((resolve, reject) => {
    if (outputLocationExists) {
        console.log(`Output location exists already... \nDropping ${configuration.outputLocation} blog contents`);
        for (const directory of configuration.directories) {
            if (directory.location.split("/").length === 1) {
                fsSync.rmSync(path.resolve(configuration.outputLocation, directory.location), {
                    recursive: true,
                    force: true
                });
            }
        }
        console.log(`Old build removed.`);
    }

    // create the output dir
    pathExists(configuration.outputLocation)
        .then(locationExists => {
            if (!locationExists) {
                fs.mkdir(configuration.outputLocation)
                    .then(() => {
                        console.log("Created output locations successfully.");
                        resolve();
                    })
                    .catch((error) => reject("Something went wrong creating the output location..."));
            }
        })
});

function createOutputDirectories(configuration) {
    console.log(`Creating output directories.`);

    return new Promise((resolve) => {
        for (const directory of configuration.directories) {
            const directoryOutputLocation = path.resolve(configuration.outputLocation, directory.location);
            console.log(`Creating directory '${directory.alias}', real path is '${directoryOutputLocation}'`);

            fsSync.mkdirSync(directoryOutputLocation, {
                recursive: true
            });
        }
        resolve();
    });
}

function processFiles(configuration) {
    console.log("Processing directory files.");
    return Promise.all(configuration.files.map(file => processFile(configuration, file)));
}

const processFile = (configuration, file) => new Promise((resolve, reject) => {
    console.log(`Processing file '${file.filename}.${file.filetype}`);

    if (file.filetype === "md" && file.processor === "html") {
        processMarkdownFile(configuration, file)
            .then(() => resolve())
            .catch(() => reject("Something went wrong processing the markdown to HTML"));
    } else {
        // copy and paste essentially
        const parentDirectory = configuration.directories.find(directory => {
            return directory.files.includes(file.id);
        });

        const fullFileName = `${file.filename}.${file.filetype}`;
        const originalLocation = path.resolve(configuration.srcLocation, parentDirectory.location, fullFileName);
        const outputLocation = path.resolve(configuration.outputLocation, parentDirectory.location);
        console.log(`Filename: ${fullFileName}\nOriginal location: ${originalLocation}\nOutput location: ${outputLocation}`);

        console.log(`Copying ${fullFileName} to ${outputLocation}`);
        fs.copyFile(originalLocation, path.resolve(outputLocation, fullFileName))
            .then(() => {
                console.log(`Copied ${fullFileName} to ${outputLocation}`);
                resolve();
            })
            .catch(() => reject("Something went wrong copying the file."));
    }
});

const processMarkdownFile = (configuration, file) => new Promise((resolve, reject) => {
    console.log("Processing markdown file with HTML converter applied.");

    const parentDirectory = configuration.directories.find(directory => {
        return directory.files.includes(file.id);
    });

    const fullFileName = `${file.filename}.${file.filetype}`;
    const originalLocation = path.resolve(configuration.srcLocation, parentDirectory.location, fullFileName);
    const outputLocation = path.resolve(configuration.outputLocation, parentDirectory.location);
    console.log(`Filename: ${fullFileName}\nOriginal location: ${originalLocation}\nOutput location: ${outputLocation}`);

    fs.readFile(originalLocation)
        .then(buffer => convertMdToHtml(buffer))
        .then(htmlString => createFile(path.resolve(outputLocation, `${file.filename}.html`), htmlString))
        .then(() => {
            file.filetype = "html";
            resolve();
        })
        .catch(error => reject(error.message));
});

const convertMdToHtml = (md) => new Promise((resolve, reject) => {
    processor.process(md)
        .then(vfile => resolve(vfile.value))
        .catch(error => reject(error.message));
});

const createFile = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, data)
        .then(() => {
            console.log(`Wrote processed HTML file successfully to: ${path}`);
            resolve();
        })
        .catch(error => reject(error.message));
});

try {
    if (argv.length == 2 || argv.length > 4) throw new Error("Invalid amount of command-line arguments.\n\n\tUsage: node app.js <[config.json] | -cms [config.json]>");
    if (argv.length == 3) build();
    else {
        if (argv[2] !== "-cms") throw new Error("Invalid command arg specified.");
        launchCms();
    }
} catch (error) {
    console.error(error);
    process.exit(1);
}