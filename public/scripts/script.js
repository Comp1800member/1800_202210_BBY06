/* This document contains functions for page elements that are in all pages in the application.
This includes:
-three-window positioning
-Hamburger menu positioning
-logout button actions
*/

//-----------------------------------------------------------Page Initialization------------------------------------------------------------------------//
//initialize variables//
let hamburgerButton = document.getElementById("hamburger-menu-button");
let hamburgerMenu = document.querySelector(".hamburger-menu");
let contentWindows = document.getElementById("content-windows");
let backWindowButton = document.getElementById("back-window-button");
let logOutButton = document.querySelectorAll(".log-out-button");
let windowPosition;

window.addEventListener("load", () => {
    backWindowButton.hidden = true;
    windowPositionOne();
})

//-----------------------------------------------------------hamburger Menu Positioning------------------------------------------------------------------------//

//event listeners for slide in hamburger menu//
hamburgerButton.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    console.log("This is hamburger menu");
})

//-----------------------------------------------------------Three-Window Positioning------------------------------------------------------------------------//
//sliding window positions in mobile view//
function windowPositionOne () {
    contentWindows.classList.remove("position-one");
    contentWindows.classList.remove("position-two");
    backWindowButton.hidden = true;
    windowPosition = 1;
}

function windowPositionTwo () {
    contentWindows.classList.add("position-one");
    contentWindows.classList.remove("position-two");
    backWindowButton.hidden = false;
    windowPosition = 2;
}

function windowPositionThree () {
    contentWindows.classList.add("position-two");
    backWindowButton.hidden = false;
    windowPosition = 3;
}

backWindowButton.addEventListener("click", () => {
    switch(windowPosition) {
        case 2: windowPositionOne();
        break;
        case 3: windowPositionTwo();
        break;
        default:
            break;
    }
});

//-----------------------------------------------------------Logout Button Functionality------------------------------------------------------------------------//
logOutButton.forEach( button => button.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log("Sign out unsuccessful");
    })
}));