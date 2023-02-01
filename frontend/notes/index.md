@docArgs()
```
"title": "Notes | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/category_selector.js", "/scripts/common.js"]
```

@weave(name="page_header" title="Notes" lead="Please select a category below to see relevant notes.");

<div class="p-16 row">
    <div id="category-selector" class="col-4 col-sm-12">
        <h2>Category selector</h2>
        <ul class="p-0 w-80 w-sm-100" style="list-style-type: none;">
            <li class="mb-8"><button id="java" data-target="java" class="btn fg-light bg-dark w-100">Java</button></li>
            <li class="mb-8"><button id="express" data-target="javascript/expressjs4" class="btn fg-light bg-dark w-100">ExpressJS V4</button></li>
            <li class="mb-8"><button id="networking" data-target="networking" class="btn fg-light bg-dark w-100">Networking</button></li>
            <li class="mb-8"><button id="docker" data-target="docker" class="btn fg-light bg-dark w-100">Docker</button></li>
        </ul>
    </div>
    <div id="category-display" class="col-8 col-sm-12">
        <h2>Notes</h2>
        <div></div>
    </div>
</div>