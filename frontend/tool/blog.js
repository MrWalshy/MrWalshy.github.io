/*
    blog

    Use for:
    - creating a directory
    - creating a post
    - moving a post to a different location
    - deleting a post
*/
const readline = require('readline');
let sc;
let exitCode = 0;

class Scanner {

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async question(q) {
        const oldPrompt = this.rl.getPrompt();
        this.rl.setPrompt(q);
        this.rl.prompt();
        this.rl.setPrompt(oldPrompt);
        return await new Promise((resolve, reject) => {
            this.rl.on('line', (input) => resolve(input));
        });
    }

    async prompt() {
        this.rl.prompt();
        return await new Promise((resolve, reject) => {
            this.rl.on('line', (input) => resolve(input));
        });
    }

    close() {
        this.rl.close();
    }
}

function isValidArgument(arg) {
    switch (arg) {
        case '-c':
            return true;
        case '-d':
            return true;
        default:
            return false;
    }
}

async function createPost() {

}

async function createDir() {
    const id = await sc.question("Directory id: ");
    const path = await sc.question("Path: ");
    const name = await sc.question("Name: ");

    // const subDirectories 
}

async function createBlog() {
    const option = await sc.question("Create a [post | dir]: ");
    
    if (option === "post") await createPost();
    else if (option === "dir") await createDir();
    else {
        exitCode = 1;
        console.log("Invalid option supplied");
    }
}

async function executeCommand(arg) {
    switch (arg) {
        case '-c':
            await createBlog();
            break;
        case '-d':
            break;
        default:
            exitCode = 1;
    }
}

async function main() {
    const args = process.argv;

    // check for args
    if (args.length === 2) {
        console.error("Expected at least one argument.");
        exitCode = 1;
    } else {
        if (args[2] && isValidArgument(args[2])) {
            await executeCommand(args[2]);
        } else {
            console.error(`Invalid argument supplied: ${args[2]}`);
            exitCode = 1;
        }
    }
    if (exitCode === 0) console.log("Operation success!");
    process.exit(exitCode);
}

sc = new Scanner()
main();