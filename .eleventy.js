const Card = require('./src/_includes/components/Card');

module.exports = function(eleventyConfig) {
    // add passthrough for assets folder, allows it to be copied to _site
    eleventyConfig.addPassthroughCopy("src/assets/");
    eleventyConfig.addPassthroughCopy("src/css/");
    eleventyConfig.addPassthroughCopy("src/scripts/");

    // tell eleventy to reload if change occurs here, doesn't watch css files by default
    eleventyConfig.addWatchTarget("src/css/");
    eleventyConfig.addWatchTarget("src/scripts/");

    // Adding a new shortcode {{ card "arg1", "arg2", etc... }} using the Card function
    eleventyConfig.addShortcode("Card", Card);

    // add a new collection for the blog posts, all the markdown files in it
    eleventyConfig.addCollection("posts", collectionApi => collectionApi.getFilteredByGlob("src/blog/posts/**/*.md"));

    // add a collection of all the tags in posts, used for category display on blog page
    eleventyConfig.addCollection("blogTags", collectionApi => {
        const tagsSet = new Set();
        collectionApi.getFilteredByGlob("src/blog/posts/**/*.md").forEach(post => {
            if (!post.data.tags) return;
            post.data.tags.forEach(tag => tagsSet.add(tag));
        });
        return tagsSet;
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            output: "_site",
            data: "_data"
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };
}