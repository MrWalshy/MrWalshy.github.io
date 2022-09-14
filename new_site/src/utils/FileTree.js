export default class FileTree {

    constructor(directories, files) {
        this.directories = directories;
        this.files = files;
    }
}

export async function buildFileTree(config) {
    const directories = [];
    const files = config.files;

    console.debug(`buildFileTree(${config.location}): start`);
    for (const directory of config.directories) {
        // import the config for the given directory
        let directoryConfiguration;
        try {
            if (config.location.trim().length === 0) {
                console.debug(`Importing: resources/${directory.rel}/config.json`);
                directoryConfiguration = await (await fetch(`./resources/${directory.rel}/config.json`)).json();
                console.debug(`Import success for: ./resources/${directory.rel}/config.json`);
            } else {
                // directoryConfiguration = await import(`resources/${loc}${directory.rel}/config.json`);
                console.debug(`Importing: resources/${config.location}/${directory.rel}/config.json`);
                directoryConfiguration = await (await fetch(`./resources/${config.location}/${directory.rel}/config.json`)).json();
                console.debug(`Import success for: ./resources/${config.location}/${directory.rel}/config.json`);
            }


            // if import was an ES module, it needs the data we want converting into
            // a JS object
            if (directoryConfiguration.__esModule) {
                directoryConfiguration = {
                    directories: directoryConfiguration.directories,
                    files: directoryConfiguration.files,
                    location: directory.rel
                };
            }

            // update location for recursive parsing, means we only need a location prop
            // in the root JSON file
            console.debug(directoryConfiguration)
            directoryConfiguration.location = directory.rel;

            // build a file tree from the given directory
            const directoryFileTree = await buildFileTree(directoryConfiguration);

            // set pertinent info
            if (config.location.trim().length !== 0) directoryFileTree.path = `resources/${config.location}/${directory.rel}`;
            else directoryFileTree.path = `resources/${directory.rel}`;
            directoryFileTree.name = directory.name;
            directoryFileTree.rel = directory.rel;
            directories.push(directoryFileTree);
        } catch (error) {
            console.error(error);
        }
    }
    console.debug(`buildFileTree(${config.location}): directories: ${JSON.stringify(directories, null, "  ")}`);
    console.debug(`buildFileTree(${config.location}): files: ${JSON.stringify(files, null, "  ")}`);
    console.debug(`buildFileTree(${config.location}): end`);
    return new FileTree(directories, files);
}

export function recurseDownFileTree(fileTree, indent = ">") {
    if (!fileTree || !fileTree.directories || !fileTree.files) return;
    console.log(`${indent} Directory: ${fileTree.name || "root"}`);

    indent = indent + indent;
    for (const file of fileTree.files) {
        console.log(`${indent} File: ${file.name}`);
    }

    for (const directory of fileTree.directories) {
        recurseDownFileTree(directory, indent);
    }
}


export class DirectoryMap {

    constructor(id, directory, subDirectories, files) {
        this.id = id;
        this.path = directory.path;
        this.name = directory.name;

        this.directory = directory;
        this.subDirectories = subDirectories;
        this.files = files;
    }
}

export function buildDirectoryMap(id, config) {
    if (!config.directories) {
        throw new Error("No directories property present.");
    } else if (!config.directoryFiles) {
        throw new Error("No directory files property present.")
    } else if (!id) {
        throw new Error("No id supplied.");
    }

    // iterate over directories
    // if the directory doesn't exist, throw an error
    let rootDirectory = null;
    for (let directory of config.directories) {
        if (directory.id === id) {
            rootDirectory = directory;
            break;
        }
    }
    if (!rootDirectory) throw new Error("Invalid directory id supplied.");

    // gather up its subdirectories
    // - throw an error if any don't exist
    let hadErrorFindingSubdirectory = false;
    const subDirectories = [];

    // iterate over all directories
    for (const directory of config.directories) {
        let matched = false;
        // checking if the directory is a subdirectory of the root dir
        for (const subDirectoryId of rootDirectory.subDirectories) {
            if (directory.id === subDirectoryId) {
                matched = true;
                subDirectories.push(directory);
                break;
            }
        }
    }

    // get the files
    // console.log(`Directory files: ${JSON.stringify(config.directoryFiles, null, "  ")}`)
    let files = config.directoryFiles[rootDirectory.id] || [];
    // console.log(`Found files: ${JSON.stringify(files, null, "  ")}`)

    return new DirectoryMap(id, rootDirectory, subDirectories, files);
}