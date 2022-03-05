//initialize variables
let hamburgerButton = document.getElementById("hamburger-menu-button");
let hamburgerMenu = document.querySelector(".hamburger-menu");
let eventButton = document.getElementById("add-event-button");
let eventAddMenu = document.querySelector(".add-event");
//event listeners
hamburgerButton.addEventListener("click", ()=>{
    hamburgerMenu.classList.toggle("active");
    console.log("This is hamburger menu");
})

eventButton.addEventListener("click", ()=>{
    eventAddMenu.classList.toggle("active");
    console.log("This is add event menu");
})
