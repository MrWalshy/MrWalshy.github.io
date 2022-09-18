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