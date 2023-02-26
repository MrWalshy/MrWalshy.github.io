import { Block, BlockType, ContentProcessor, deepLog, EmddSiteGenerator, loadSiteConfiguration } from 'emdd';
import path from 'path';

class CategorySelectorContentProcessor extends ContentProcessor {
    _projectDirectory;

    constructor(projectDirectory) {
        super("categorySelector");
        this._projectDirectory = projectDirectory;
    }

    transform(blocks) {
        let output = [];
        blocks.forEach(block => {
            if (block.identifier === "categorySelector") output.push(new Block(block.type, block.identifier, block.parameters, block.value, this.processBlock(block)));
            else output.push(block);
        });
        return output;
    }

    processBlock(block) {
        const value = block.value.value;
        let lines = value.split("\n").map(line => line.replace("\r", "", "\c", ""));
        const contentMap = {};
        lines.forEach(line => {
            const splitLine = line.split("->");
            const pathFromProjectRoot = splitLine[0].trim();
            const linkName = splitLine[1].trim();
            contentMap[pathFromProjectRoot] = linkName;
        });
        return this.produceSelector(contentMap);
    }

    produceSelector(content) {
        const pre = `<div class="p-16 row"><div id="category-selector" class="col-4 col-sm-12"><h2>Category selector</h2><ul class="p-0 w-80 w-sm-100" style="list-style-type: none;">`;
        const post = `</ul></div><div id="category-display" class="col-8 col-sm-12"><h2>Notes</h2><div></div></div></div>`;        
        const listItems = [];
        for (const key in content) {
            listItems.push(`<li class="mb-8"><button id="${key}" data-target="${key}" class="btn fg-light bg-dark w-100">${content[key]}</button></li>`);
        }
        return `${pre}${listItems.join("")}${post}`;
    }
}

const config = loadSiteConfiguration("./frontend/site_config.json");
const proc = new CategorySelectorContentProcessor(path.dirname(config.configLocation));
const siteGenerator = new EmddSiteGenerator([proc]);
siteGenerator.generateFromConfig(config);

