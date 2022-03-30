var currentUser;
var eventList;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //global
        console.log("user " + user.uid + " is logged in");

        eventList = currentUser.collection("eventList");
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
let today = new Date('2022-03-20');

//loads upcoming events on the page//
function loadUpcomingEvents() {
    console.log("Loading past events...");
    eventList
        .where("dateTime", "<", today)
        .orderBy("dateTime", "desc")
        .get()
        .then(eventDoc => {
            let eventTemplate = document.getElementById("event-bar-template");
            let nextEventLabel = document.createElement("h4");
                nextEventLabel.innerHTML = "All Past Events";
                nextEventLabel.classList.add("list-divider");
                eventWindowOne.appendChild(nextEventLabel);

            eventDoc.forEach(doc => {
                eventData = doc.data();

                let newEventBar = eventTemplate.content.cloneNode(true);
                newEventBar.getElementById("event-title").innerHTML = eventData.name;
                newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                newEventBar.getElementById("event-time").innerHTML = eventData.dateTime.toDate().toLocaleTimeString();
                newEventBar.getElementById("event-description").innerHTML = eventData.description;
                //newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                newEventBar.querySelector(".event-bar").onclick = () => loadEventDetails(doc.id);

                eventWindowOne.appendChild(newEventBar);
            })
        })
}

//generates event details information in the second window//
function loadEventDetails(eventDoc) {


    eventList.doc(eventDoc)
        .onSnapshot(
            userDoc => {

                while (eventWindowTwo.firstChild) {
                    eventWindowTwo.removeChild(eventWindowTwo.firstChild);
                }

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