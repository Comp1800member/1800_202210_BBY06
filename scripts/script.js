//initialize variables
let hamburgerButton = document.getElementById("hamburger-menu-button");
let hamburgerMenu = document.querySelector(".hamburger-menu");
let eventButton = document.getElementById("add-event-button");
let eventAddMenu = document.querySelector(".add-event");
let loadListButton = document.getElementById("load-events");
let pageOneButton = document.getElementById("page-one-button");
let pageTwoButton = document.getElementById("page-two-button");
let pageThreeButton = document.getElementById("page-three-button");
let contentWindows = document.getElementById("content-windows");

//event listeners for pop in menus
hamburgerButton.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    console.log("This is hamburger menu");
})

eventButton.addEventListener("click", () => {
    eventAddMenu.classList.toggle("active");
    console.log("This is add event menu");
})

//event listeners for scrolling content to the left and right
pageOneButton.addEventListener("click", () => {
    contentWindows.classList.remove("position-one");
    contentWindows.classList.remove("position-two");
})

pageTwoButton.addEventListener("click", () => {
    contentWindows.classList.add("position-one");
    contentWindows.classList.remove("position-two");
})

pageThreeButton.addEventListener("click", () => {
    contentWindows.classList.add("position-two");
})