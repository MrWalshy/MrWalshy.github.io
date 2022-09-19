const textarea = document.querySelector(".editor > .editor-content");
const lineNumbers = document.querySelector(".editor > .line-numbers");
const dirView = document.querySelector("#dir-view");
let lineCount = 1;

let src = "# This is the heading\n\nFollowed by some paragraph text";
textarea.innerText = src;
renderLineCount();

function renderLineCount() {
    // num of lines for a div comes from how many inner
    // divs inserted
    console.log(`Current inner text: ${textarea.innerText}`);
    const fakeLines = textarea.innerHTML.split("<div><br></div>").length - 1;
    const lineCount = textarea.innerText.split("\n").length;

    console.log(`Num of fake lines: ${fakeLines}`);
    console.log(`Num of lines: ${lineCount}`);
    lineNumbers.innerHTML = new Array(lineCount - fakeLines)
        .fill("<span></span>")
        .join("");
}

// add a new span to lineNumbers for every newline encountered
// in the textArea
textarea.addEventListener("keyup", event => {
    renderLineCount();
    event.preventDefault();
});

// tab support (not implemented yet)
textarea.addEventListener("keydown", event => {
    switch (event.key) {
        case "Tab":
            const cursorPosition = getCaretIndex(textarea);
            // const start = textarea.selectionStart;
            // const end = textarea.selectionEnd;
            // console.log(`Start: ${start}, End: ${end}`);

            // textarea.innerHTML = textarea.innerHTML.substring(0, start) +
            //     "    " + textarea.innerHTML.substring(end);

            // console.log(`Cursor at: ${cursorPosition}`);
            // console.log(textarea)
            // console.log(textarea.innerText)
            // textarea.innerText = textarea.innerText.substring(0, cursorPosition) +
            //     "    " + textarea.innerText.substring(cursorPosition);

            event.preventDefault();
            break;
        default:
            break;
    }
});

// make line numbers scroll when textarea scrolls
textarea.addEventListener("scroll", event => {
    lineNumbers.scrollTop = textarea.scrollTop;
    // lineNumbers.scrollLeft = textarea.scrollLeft;
});

// https://javascript.plainenglish.io/how-to-find-the-caret-inside-a-contenteditable-element-955a5ad9bf81
function getCaretCoordinates() {
    let x = 0,
        y = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        // get selection from window object, has 
        // info about the cursor
        const selection = window.getSelection();
        // check if a cursor is set
        if (selection.rangeCount !== 0) {
            // if cursor set, clone the selected Range
            // - each Range represents the start and end of a
            //   selection
            const range = selection.getRangeAt(0).cloneRange();
            // collapse range to start in case spanning multiple chars
            range.collapse(true);
            // get the positioning data
            const rect = range.getClientRects()[0];
            // x,y represent top left corner of the caret
            if (rect) {
                x = rect.left;
                y = rect.top;
            }
        }
    }
    return { x, y };
}
// get carets index within a contenteditable element
function getCaretIndex(element) {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = window.getSelection().getRangeAt(0);
            const preCaretRange = range.cloneRange();
            // get the selected text content
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            position = preCaretRange.toString().length;
        }
    }
    return position;
}

// DIR TREE CODE (NEEDS TO GO IN SEPARATE FILE)
function getDirTree(cb) {
    fetch("/directorytree")
        .then(response => response.json())
        .then(data => cb(data))
        .catch(error => console.error(error));
}

function deleteDirectory(tree) {
    console.log(`Deleting directory: ${tree.location}`);
    // send fetch request to express server
}

function openDirectory(tree) {
    // const dir = tree.subdirectories.find(directory => directory.alias === alias);
    console.log(`Opening '${tree.alias}', location: ${tree.location}`);
    replaceDirView(getListFromTree(tree));
}

function createDirectoryLi(tree) {
    // create li, clicking the dir alias opens the relevant directory
    const dirLi = document.createElement("li");
    const dirAliasSpan = document.createElement("span");
    dirAliasSpan.appendChild(document.createTextNode(tree.alias));
    dirAliasSpan.className = "dir-alias";
    dirAliasSpan.addEventListener("click", event => openDirectory(tree));
    dirLi.appendChild(dirAliasSpan);
    dirLi.className = "directory";

    // add the delete directory button to the li, clicking
    // triggers the deletion of the relevant directory
    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-x"
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", event => deleteDirectory(tree));
    dirLi.appendChild(deleteBtn);

    return dirLi;
}

function deleteFile(tree, file) {
    console.log(`Deleting '${file.alias}' from directory: ${tree.location}`);
    // send fetch request to express server
}

function createFileLi(tree, file) {
    const fileLi = document.createElement("li");
    const fileAliasSpan = document.createElement("span");
    fileAliasSpan.appendChild(document.createTextNode(file.alias));
    fileAliasSpan.className = "file-alias";
    fileLi.appendChild(fileAliasSpan);
    fileLi.className = "file";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-x"
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", event => deleteFile(tree, file));
    fileLi.appendChild(deleteBtn);

    return fileLi;
}

function replaceDirView(element) {
    dirView.replaceChildren(element);
}

function getListFromTree(tree) {
    const ul = document.createElement("ul");
    ul.className = "directory-list"
    const currentDir = document.createElement("li");
    currentDir.className = "directory current-dir";
    currentDir.appendChild(document.createTextNode(tree.alias));
    ul.appendChild(currentDir);

    // append dirs
    for (const dir of tree.subdirectories) {
        ul.appendChild(createDirectoryLi(dir));
    }

    // append files
    for (const file of tree.files) {
        ul.appendChild(createFileLi(tree, file));
    }
    return ul;
}

function renderDirTree() {
    // function getListFromTree(tree) {
    //     // the current tree being processed
    //     const ul = document.createElement("ul");
    //     const currentDir = document.createElement("li");
    //     currentDir.className = "directory";
    //     currentDir.appendChild(document.createTextNode(tree.alias));
    //     currentDir.appendChild(ul);

    //     // files of the current tree
    //     for (const file of tree.files) {
    //         const fileLi = document.createElement("li");
    //         fileLi.appendChild(document.createTextNode(file.alias));
    //         fileLi.className = "file";
    //         ul.appendChild(fileLi);
    //     }

    //     // subdirectories of the current tree
    //     for (const subtree of tree.subdirectories) {
    //         ul.appendChild(getListFromTree(subtree));
    //     }

    //     return currentDir;
    // }
    getDirTree(dirTree => {
        console.log(`Building list for ${JSON.stringify(dirTree, null, "  ")}`);
        const dirList = getListFromTree(dirTree);
        console.log(dirList);
        // const ul = document.createElement("ul");
        // ul.appendChild(dirList);
        replaceDirView(dirList);
    });
}

renderDirTree();
