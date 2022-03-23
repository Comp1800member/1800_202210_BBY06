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

//load event list function

loadListButton.addEventListener("click", () => {
    eventList = db.collection("users").doc("testUser").collection("eventList");

    eventList.orderBy("dateTime").get()
        .then(eventDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let eventWindowOne = document.getElementById("window-one");
            console.log(eventDoc.docs);
            console.log("length: " + eventDoc.docs.length);
            console.log("eventDoc.docs[1]: " + JSON.stringify(eventDoc.docs[1]));
            console.log(eventDoc.docs[1].id);
            console.log(eventDoc.docs[1].data().name);

            for (i = 0; i < Number(eventDoc.docs.length); i++) {
                let eventData = eventDoc.docs[i].data();

                console.log("eventData: " + eventData);

                if (i === 0) {
                    let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData.dateTime.toDate());
                    newEventBar.getElementById("event-time").innerHTML = displayTime(eventData.dateTime.toDate());
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;

                    eventWindowOne.appendChild(newEventBar);

                } else {
                    let newEventBar = eventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData.dateTime.toDate());
                    newEventBar.getElementById("event-time").innerHTML = displayTime(eventData.dateTime.toDate());
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;

                    eventWindowOne.appendChild(newEventBar);

                }
            }
        })
})

function displayDate(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    month = months[date.getMonth()];

    return month + " " + date.getDate() + " " + date.getFullYear();
}

function displayTime(dateTime) {
    if (dateTime.getMinutes() < 10) {
        minutes = "0" + dateTime.getMinutes();
    } else {
        minutes = dateTime.getMinutes();
    }

    if (dateTime.getHours() < 12) {
        if (dateTime.getHours() == 0) {
            return "12:" + minutes + " AM";
        } else {
            return dateTime.getHours() + ":" + minutes + " AM";
        }
    }
    if (dateTime.getHours() <= 23 && dateTime.getHours() >= 12) {
        if (dateTime.getHours() == 12) {
            return "12:" + minutes + " PM";
        } else {
            return (dateTime.getHours()-12) + ":" + minutes + " PM";
        }
    }
}