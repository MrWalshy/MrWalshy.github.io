const navbar = document.querySelector(".navbar");
const toggle = navbar.querySelector("#toggle");
const navContent = navbar.querySelector(".nav-content");

toggle.addEventListener("click", event => {
    navContent.classList.toggle("show");
});