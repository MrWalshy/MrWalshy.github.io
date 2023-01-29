const categorySelector = document.getElementById("category-selector");
const categoryDisplay = document.getElementById("category-display").querySelector("div");
const categoryButtons = categorySelector.querySelectorAll("button");

const manifests = {};

async function fetchManifest(target) {
    try {
        const data = await (await fetch(`/notes/${target}/manifest.json`)).json();
        manifests[target] = data;
    } catch (error) {
        throw new Error("Invalid manifest target");
    }
}

function displayCategory(target) {
    const manifest = manifests[target];
    while (categoryDisplay.firstChild) categoryDisplay.removeChild(categoryDisplay.lastChild);
    manifest.forEach(doc => {
        const card = document.createElement("div");
        const cardButton = document.createElement("button");
        const cardLink = document.createElement("a");
        cardLink.innerText = doc.name;
        cardLink.setAttribute("href", `/notes/${target}/${doc.file}`);
        cardButton.appendChild(cardLink);
        card.appendChild(cardButton);
        card.classList.add("category-card", "mb-8");
        cardButton.classList.add("btn", "fg-light", "bg-primary", "w-100", "p-0");
        cardLink.classList.add(...("fg-light d-block w-100 h-100 pt-8 pb-8 pl-16 pr-16".split(" ")));
        categoryDisplay.appendChild(card);
    });
}

categoryButtons.forEach(button => button.addEventListener("click", async event => {
    const target = event.target.getAttribute("data-target");
    if (!manifests[target]) await fetchManifest(target);
    displayCategory(target);
}));

// by default, display the first buttons category
(async function main() {
    const category = categoryButtons[0].getAttribute("data-target");
    await fetchManifest(category)
    displayCategory(category);
}());