var currentUser;
var eventList;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //currentUser = db.collection("users").doc(user.uid); //global
        currentUser = db.collection("users").doc("testUser");
        console.log("user " + user.uid + " is logged in");

        eventList = currentUser.collection("eventList");
        addEventSubmitButton.addEventListener("click", addEvent);
        loadUpcomingEvents();
        hideEventForm();
        
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});

//window selectors//
let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");
let eventButton = document.getElementById("add-event-button");
let addEventForm = document.getElementById("add-event-form");


//load event list function
let today = new Date('2022-03-01');

//loads upcoming events on the page//
function loadUpcomingEvents() {
    eventList
        .where("dateTime", ">=", today)
        .orderBy("dateTime")
        .onSnapshot(
            eventDoc => {

                while (eventWindowOne.firstChild) {
                    eventWindowOne.removeChild(eventWindowOne.firstChild);
                }
                let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
                let eventTemplate = document.getElementById("event-bar-template");
                let i = 0;

                eventDoc.forEach(doc => {
                    eventData = doc.data();

                    if (i === 0) {
                        let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                        newEventBar.getElementById("event-title").innerHTML = eventData.name;
                        newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                        newEventBar.getElementById("event-time").innerHTML = eventData.dateTime.toDate().toLocaleTimeString();
                        newEventBar.getElementById("event-description").innerHTML = eventData.description;
                        //newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                        newEventBar.querySelector(".upcoming-event-bar").onclick = () => loadEventDetails(doc.id);
                        let nextEventLabel = document.createElement("h4");
                        nextEventLabel.innerHTML = "Next Event";
                        nextEventLabel.classList.add("list-divider");
                        eventWindowOne.appendChild(nextEventLabel);

                        eventWindowOne.appendChild(newEventBar);

                        let upcomingEventLabel = document.createElement("h4");
                        upcomingEventLabel.innerHTML = "Upcoming Events";
                        upcomingEventLabel.classList.add("list-divider");
                        eventWindowOne.appendChild(upcomingEventLabel);

                    } else {
                        let newEventBar = eventTemplate.content.cloneNode(true);
                        newEventBar.getElementById("event-title").innerHTML = eventData.name;
                        newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                        newEventBar.getElementById("event-time").innerHTML = eventData.dateTime.toDate().toLocaleTimeString();
                        newEventBar.getElementById("event-description").innerHTML = eventData.description;
                        newEventBar.querySelector(".event-bar").onclick = () => loadEventDetails(doc.id);
                        eventWindowOne.appendChild(newEventBar);

                    }
                    i++;
                })
                //append an add-event button to the bottom of window one//
                let newAddEventButton = document.createElement("div");
                newAddEventButton.classList.add("plus-sign-button");
                newAddEventButton.onclick = () => showEventForm();
                eventWindowOne.appendChild(newAddEventButton);


            })
}

//generates event details information in the second window//
function loadEventDetails(eventDoc) {
    while (eventWindowTwo.firstChild) {
        eventWindowTwo.removeChild(eventWindowTwo.firstChild);
    }

    eventList.doc(eventDoc)
        .get()
        .then(userDoc => {

            let windowTwoHeader = document.createElement("h4");
            windowTwoHeader.innerHTML = "Event Details";
            windowTwoHeader.classList.add("list-divider");
            eventWindowTwo.appendChild(windowTwoHeader);


            let eventDetailsTemplate = document.getElementById("event-details-template");
            let attendeeBarTemplate = document.getElementById("basic-bar-template");

            let newEventDetails = eventDetailsTemplate.content.cloneNode(true);

            newEventDetails.getElementById("event-detail-name").innerHTML = userDoc.data().name;
            newEventDetails.getElementById("event-detail-date").innerHTML = displayDate(userDoc.data().dateTime.toDate());
            newEventDetails.getElementById("event-detail-time").innerHTML = userDoc.data().dateTime.toDate().toLocaleTimeString();
            newEventDetails.getElementById("event-detail-capacity").innerHTML = userDoc.data().capacity;
            newEventDetails.getElementById("event-detail-description").innerHTML = userDoc.data().description;

            eventWindowTwo.appendChild(newEventDetails);

            while (eventWindowThree.firstChild) {
                eventWindowThree.removeChild(eventWindowThree.firstChild);
            }

            //creates a header for window 3//
            let windowThreeHeader = document.createElement("h4");
            windowThreeHeader.innerHTML = "Attendee List";
            windowThreeHeader.classList.add("list-divider");
            eventWindowThree.appendChild(windowThreeHeader);

            if (userDoc.data().guestlist.length == 0) {
                let newAttendeeBar = attendeeBarTemplate.content.cloneNode(true);
                newAttendeeBar.getElementById("bar-title").innerHTML = "No attendees have checked in.";
                eventWindowThree.appendChild(newAttendeeBar);
            } else {
                userDoc.data().guestlist.forEach(attendee => {
                    console.log("in the forEach: " + attendee);
                    let newAttendeeBar = attendeeBarTemplate.content.cloneNode(true);
                    newAttendeeBar.getElementById("bar-title").innerHTML = attendee;
                    eventWindowThree.appendChild(newAttendeeBar);
                })
            }
        })

    //generateQRCode();
    windowPositionTwo();
}

function generateQRCode() {

}


function displayDate(date) {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
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
            return (dateTime.getHours() - 12) + ":" + minutes + " PM";
        }
    }
}


function hideEventForm() {
    addEventForm.hidden = true;
}
function showEventForm() {
    addEventForm.hidden = false;
}