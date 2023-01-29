const editor = document.querySelector("#editor");
const content = editor.querySelector("#content");
const display = editor.querySelector("#display");
const incrementFontSizeBtn = document.querySelector("#increment-font-size");
const decrementFontSizeBtn = document.querySelector("#decrement-font-size");
const clearDisplayBtn = document.querySelector("#clear-display");
const newBtn = document.querySelector("#new-btn");
const openBtn = document.querySelector("#open-btn");
const saveBtn = document.querySelector("#save-btn");
const saveAsBtn = document.querySelector("#save-as-btn");
const closeBtn = document.querySelector("#close-btn");

// let file = {
//     fileText: "Hello world\n\nThis is my document text"
// };
let file;
let caretPosition = -1;

// util functions
function setDisplayContents(str) {
    display.innerText = str;
}

function getCaretPosition(node) {
    // https://stackoverflow.com/questions/4767848/get-caret-cursor-position-in-contenteditable-area-containing-html-content
    let range = window.getSelection().getRangeAt(0),
        preCaretRange = range.cloneRange(),
        caretPosition,
        tmp = document.createElement("div");

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    tmp.appendChild(preCaretRange.cloneContents());
    caretPosition = tmp.innerHTML.length;
    return caretPosition;
}

function updateFileText(htmlSrc) {
    file.fileText = htmlSrc.replaceAll("&nbsp;", " ")
        .replaceAll("<div><br>", "\n")
        .replaceAll("<br>", "\n")
        .replaceAll("<div>", "\n")
        .replaceAll("</div>", "");
}

// app code //
// set the initial display
if (file) {
    setDisplayContents(file.fileText);
} else display.removeAttribute("contenteditable");

display.addEventListener("keyup", event => {
    if (file) {
        caretPosition = getCaretPosition(display);
        updateFileText(display.innerHTML); // update the file text stored in memory
    }
});

display.addEventListener("click", event => {
    if (file) {
        caretPosition = getCaretPosition(display);
        console.log(caretPosition);
    }
});

// font behaviours
incrementFontSizeBtn.addEventListener("click", event => {
    if (file) {
        event.preventDefault();
        const fontSize = parseFloat(window.getComputedStyle(display, null).getPropertyValue("font-size") || "16px");
        display.style.fontSize = (fontSize + 1) + "px";
    }
});

decrementFontSizeBtn.addEventListener("click", event => {
    if (file) {
        event.preventDefault();
        const fontSize = parseFloat(window.getComputedStyle(display, null).getPropertyValue("font-size") || "16px");
        display.style.fontSize = (fontSize - 1) + "px";
    }
});

// clear display button
clearDisplayBtn.addEventListener("click", event => {
    if (file) {
        event.preventDefault();
        file.fileText = "";
        setDisplayContents(file.fileText);
    }
});

function createFileFormFields() {
    const dirId = document.createElement("input");
    dirId.type = "hidden";
    dirId.id = "dirId";
    dirId.setAttribute("name", "dirId");
    // dirId.style.display = "hidden";

    const fileIdLabel = document.createElement("label");
    fileIdLabel.setAttribute("for", "file-id");
    const fileId = document.createElement("input");
    fileId.type = "text";
    fileId.id = "file-id";
    fileId.setAttribute("name", "fileId");
    fileIdLabel.append(document.createTextNode("ID:"), fileId);

    const filenameLabel = document.createElement("label");
    filenameLabel.setAttribute("for", "filename");
    const filename = document.createElement("input");
    filename.type = "text";
    filename.id = "filename";
    filename.setAttribute("name", "filename");
    filenameLabel.append(document.createTextNode("Filename:"), filename);

    const aliasLabel = document.createElement("label");
    aliasLabel.setAttribute("for", "alias");
    const alias = document.createElement("input");
    alias.type = "text";
    alias.id = "alias";
    alias.setAttribute("name", "alias");
    aliasLabel.append(document.createTextNode("Alias:"), alias);

    const filetypeLabel = document.createElement("label");
    filetypeLabel.setAttribute("for", "filetype");
    const filetype = document.createElement("input");
    filetype.type = "text";
    filetype.id = "filetype";
    filetype.setAttribute("name", "fileType")
    filetypeLabel.append(document.createTextNode("Filetype:"), filetype);

    return [dirId, fileIdLabel, filenameLabel, aliasLabel, filetypeLabel];
}

function handleCreateFile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries()); // get flat object
    console.log(formDataObject);
    formDataObject.fileText = "";
    file = formDataObject;

    display.setAttribute("contenteditable", "true");
    setDisplayContents(file.fileText);

    editor.removeChild(event.target);
}

function openCreateFileModal() {
    const container = document.createElement("form");
    container.id = "modal";
    container.addEventListener("submit", handleCreateFile);

    // form fields: dirId (hidden), id, filename, alias, filetype
    const formFields = createFileFormFields();
    const formFieldGroup = document.createElement("fieldset");
    formFieldGroup.append(...formFields);
    container.appendChild(formFieldGroup);

    // create and close without create buttons
    const createBtn = document.createElement("button");
    createBtn.setAttribute("type", "submit");
    createBtn.innerText = "Create";

    const closeBtn = document.createElement("button");
    closeBtn.setAttribute("type", "button");
    closeBtn.innerText = "Close";

    // close button should remove the modal from the DOM without doing anything
    closeBtn.addEventListener("click", event => editor.removeChild(container));

    // attach buttons to bottom bar, then to container
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "modal-button-bar";
    buttonContainer.append(createBtn, closeBtn);
    container.appendChild(buttonContainer);

    // attach to editor
    editor.appendChild(container);
}

// create a new file
newBtn.addEventListener("click", event => {
    event.preventDefault();
    console.log("Creating new file"); 

    // open popup modal for gathering info
    openCreateFileModal();
});



//////////////////////////////////////////////////
// DIR TREE CODE (NEEDS TO GO IN SEPARATE FILE) //
//////////////////////////////////////////////////
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