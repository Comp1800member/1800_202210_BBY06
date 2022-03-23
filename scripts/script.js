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
//let upcomingEventButton = document.getElementById("upcoming-events-button")

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
    eventList.get()
        .then(userDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let eventWindowOne = document.getElementById("window-one");
            console.log(userDoc.docs);
            console.log("length: " + userDoc.docs.length);
            console.log("userDoc.docs[1]: " + JSON.stringify(userDoc.docs[1]));
            console.log(userDoc.docs[1].id);
            console.log(userDoc.docs[1].data().name);

            for (i = 0; i < Number(userDoc.docs.length); i++) {
                let eventData = userDoc.docs[i].data();

                console.log("eventData: " + eventData);

                if (i === 0) {
                    let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = eventData.date;
                    newEventBar.getElementById("event-time").innerHTML = eventData.time;
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                    
                    eventWindowOne.appendChild(newEventBar);

                } else {
                    let newEventBar = eventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = eventData.date;
                    newEventBar.getElementById("event-time").innerHTML = eventData.time;
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;

                    eventWindowOne.appendChild(newEventBar);

                }

            }
        })
})

/*loadUpcomingEventButton.addEventListener("click", () => {


    upcomingEventList = db.collection("users").doc("testUser").collection("eventList");
    upcomingEventList.get()
        .then(userDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let eventWindowOne = document.getElementById("window-one");
            console.log(userDoc.docs);
            console.log("length: " + userDoc.docs.length);
            console.log("userDoc.docs[1]: " + JSON.stringify(userDoc.docs[1]));
            console.log(userDoc.docs[1].id);
            console.log(userDoc.docs[1].data().name);
                        for (i = 0; i < Number(userDoc.docs.length); i++) {
                let eventData = userDoc.docs[i].data();

                console.log("eventData: " + eventData);

                if (i === 0) {
                    let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = eventData.date;
                    newEventBar.getElementById("event-time").innerHTML = eventData.time;
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                    
                    eventWindowOne.appendChild(newEventBar);

                } else {
                    let newEventBar = eventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = eventData.date;
                    newEventBar.getElementById("event-time").innerHTML = eventData.time;
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;

                    eventWindowOne.appendChild(newEventBar);

                }

            }
        })
})

*/