//initialize variables
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

//event listeners for pop in menus
hamburgerButton.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    console.log("This is hamburger menu");
})


//event listeners for scrolling the content windows to the left and right
pageOneButton.addEventListener("click", windowPositionOne);
pageTwoButton.addEventListener("click", windowPositionTwo);
pageThreeButton.addEventListener("click", windowPositionThree);

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



logOutButton.forEach( button => button.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log("Sign out unsuccessful");
    })
}));