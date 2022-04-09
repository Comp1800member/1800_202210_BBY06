/* This document contains the functions to load content on upcoming-events.html. */

//-----------------------------------------------------------Page Initialization------------------------------------------------------------------------//

//on-page element selectors//
let addAttendeeForm = document.getElementById("add-attendee-form");
let addEventSubmitButton = document.getElementById("add-event-submit-button");
let addAttendeeSubmitButton = document.getElementById("add-attendee-submit-button");
let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");
let eventButton = document.getElementById("add-event-button");
let addEventForm = document.getElementById("add-event-form");

//date setting//
let today = new Date('2022-04-05');

//functions to be excecuted when the page loads//
hideEventForm();
hideAttendeeForm();

//-----------------------------------------------------------Firebase Authentication------------------------------------------------------------------------//
//checks if the user is logged in//
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //use this line for the actual app
        //currentUser = db.collection("users").doc("testUser"); //use this line for testing
        console.log("user " + user.uid + " is logged in");
        console.log("currentUser.id: " + currentUser.id);
        eventList = currentUser.collection("eventList");
        addEventSubmitButton.addEventListener("click", addEvent);

        loadUpcomingEvents();

    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "index.html";
    }
});

//-----------------------------------------------------------Load Upcoming Events------------------------------------------------------------------------//
//Reads Firebase Collection "eventList" and outputs all results where the date is the curent date or later.//
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
                        newEventBar.getElementById("present-number").innerHTML = eventData.guestlist.length;
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

//-----------------------------------------------------------Load Event Details------------------------------------------------------------------------//
//generates html template and enters in information about a specific event identified by eventDoc. Outputs results in window two//
//reads firebase event guestlist array using .onSnapshot() and reads all the names listed in the array. Outputs list in window three.//
//input parameter: eventDoc //

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
                newEventDetails.getElementById("delete-event-button").onclick = () => deleteEvent(userDoc.id);
                newEventDetails.getElementById("event-detail-generate-code-button").onclick = () => generateQRCode(userDoc.id);
                
                
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
                        let newAttendeeBar = attendeeBarTemplate.content.cloneNode(true);
                        newAttendeeBar.getElementById("bar-title").innerHTML = attendee;
                        eventWindowThree.appendChild(newAttendeeBar);
                    })
                }
                //append an add-attendee button to window three//
                let newAddAttendeeButton = document.createElement("div");
                newAddAttendeeButton.classList.add("plus-sign-button");
                newAddAttendeeButton.onclick = () => showAttendeeForm(userDoc.id);
                eventWindowThree.appendChild(newAddAttendeeButton);
            })
    windowPositionTwo();
}

//-----------------------------------------------------------Generate QR Code------------------------------------------------------------------------//
//generates a qr code with a link to the checkin page.//
//input parameter: eventID //
function generateQRCode(eventID) {
    let largeCodeBox = document.createElement("div");
    largeCodeBox.classList.add("qr-code-large");
    largeCodeBox.onclick = () => {largeCodeBox.hidden = true};
    contentWindows.appendChild(largeCodeBox);
    largeCodeBox.hidden = true;

    let codeBox = document.getElementById("event-detail-qr-code");
    while (codeBox.firstChild) {
        codeBox.removeChild(codeBox.firstChild);
    }

    let codeSmall = new QRCode(document.getElementById("event-detail-qr-code"));    
    let codeLarge = new QRCode(largeCodeBox); 
    let currentUrl = window.location.href;
    let checkinUrl = currentUrl.replace("upcoming-events.html", "check_in.html?userId=" + currentUser.id + "&eventId=" + eventID);
    codeSmall.makeCode(checkinUrl);
    codeLarge.makeCode(checkinUrl);
    document.getElementById("event-detail-qr-link").setAttribute('href', checkinUrl);

    //create a button to expand the code on a new window//    
    codeBox.addEventListener("click", () => {
        largeCodeBox.hidden = false;
    });
    
    codeBox.appendChild(largeWindowButton);
    
}

//-----------------------------------------------------------Date and Time------------------------------------------------------------------------//
//formats the date//
function displayDate(date) {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}

//formats the time//
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

//-----------------------------------------------------------Input Form Visibiliity------------------------------------------------------------------------//
//hide and show pop-in forms for adding or removing events/attendees//
function hideEventForm() {
    addEventForm.hidden = true;
}
function showEventForm() {
    addEventForm.hidden = false;
}

function hideAttendeeForm() {
    addAttendeeForm.hidden = true;

}
function showAttendeeForm(docID) {
    addAttendeeForm.hidden = false;
    addAttendeeSubmitButton.addEventListener("click", () => {
        addAttendee(docID);
    });
}
