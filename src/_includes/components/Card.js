module.exports = function Card({title, link, imageSrc, description}) {
    const imageText = `<a href="${link}">
        <img src="${imageSrc}" />
    </a>`;
    return (`<article class="w-100 mb-16 p-16">
    ${imageSrc ? imageText : ""}
    <a href="${link}">
        <h3>${title}</h3>
    </a>
    <p>${description}</p>
</article>`);
}