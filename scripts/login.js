let titleCard = document.getElementById("login-title");
let buttons = document.querySelectorAll(".login-button");

buttons.forEach(
    element => {
        element.addEventListener("click", () => {
            titleCard.classList.add("lift");
        })
    }
)
