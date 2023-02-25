module.exports = function Card({title, link, description}) {
    return (`<div class="card">
    <a href="${link}">
        <h3>${title}</h3>
        <p>${description}</p>
    </a>
</div>`);
}