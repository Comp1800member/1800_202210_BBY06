//window selectors//
let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");
let eventButton = document.getElementById("add-event-button");
let addEventForm = document.getElementById("add-event-form");
let eventList = db.collection("users").doc("testUser").collection("eventList");
hideEventForm();
//load event list function

let today = new Date(3 , 1, 2022);

window.addEventListener("load", loadUpcomingEvents);

//loads upcoming events on the page//
function loadUpcomingEvents () {

    eventList
        .where("dateTime", ">=", today )
        .orderBy("dateTime")
        .get()
        .then(eventDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let i = 0;

            eventDoc.forEach( doc => {
                console.log(doc.id);
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
function loadEventDetails (eventDoc) {
    while(eventWindowTwo.firstChild) {
        eventWindowTwo.removeChild(eventWindowTwo.firstChild);
    }
    console.log("eventDoc: " + eventDoc);

    eventList.doc(eventDoc)
        .get()
        .then( userDoc => {

            let windowTwoHeader = document.createElement("h4");
            windowTwoHeader.innerHTML = "Event Details";
            windowTwoHeader.classList.add("list-divider");
            eventWindowTwo.appendChild(windowTwoHeader);

            console.log("userDoc.id: " + userDoc.id);
            console.log("userDoc.data() : " + userDoc.data());

            let eventDetailsTemplate = document.getElementById("event-details-template");
            let newEventDetails = eventDetailsTemplate.content.cloneNode(true);

            newEventDetails.getElementById("event-detail-name").innerHTML = userDoc.data().name;
            newEventDetails.getElementById("event-detail-date").innerHTML = displayDate(userDoc.data().dateTime.toDate());
            newEventDetails.getElementById("event-detail-time").innerHTML = userDoc.data().dateTime.toDate().toLocaleTimeString();
            newEventDetails.getElementById("event-detail-capacity").innerHTML = userDoc.data().capacity;
            newEventDetails.getElementById("event-detail-description").innerHTML = userDoc.data().description;

            eventWindowTwo.appendChild(newEventDetails);
        })

    eventList.doc(eventDoc).collection("guestlist")
        .get()
        .then( userDoc => {
            while(eventWindowThree.firstChild) {
                eventWindowThree.removeChild(eventWindowThree.firstChild);
            }

            //creates a header for window 3//
            let windowThreeHeader = document.createElement("h4");
            windowThreeHeader.innerHTML = "Attendee List";
            windowThreeHeader.classList.add("list-divider");
            eventWindowThree.appendChild(windowThreeHeader);

            let attendeeBarTemplate = document.getElementById("basic-bar-template");
            console.log("userDoc.size: " + userDoc.size );

            //if there are no attendees, the third window will let the user know. If there are attendees, window 3 will list the checked in attendees//
            if(userDoc.size == 0) {
                let newAttendeeBar = attendeeBarTemplate.content.cloneNode(true);
                newAttendeeBar.getElementById("bar-title").innerHTML = "No attendees have checked in.";

                eventWindowThree.appendChild(newAttendeeBar);
            } else {
                userDoc.forEach( attendee => {
                    let newAttendeeBar = attendeeBarTemplate.content.cloneNode(true);
                    newAttendeeBar.getElementById("bar-title").innerHTML = attendee.data().firstname + " " + attendee.data().lastname;
    
                    eventWindowThree.appendChild(newAttendeeBar);
                })
            }

            let newAddEventButton = document.createElement("div");
            newAddEventButton.classList.add("plus-sign-button");
            newAddEventButton.onclick = () => showAttendeeForm();
            eventWindowThree.appendChild(newAddEventButton);
            
        })

//generateQRCode();
windowPositionTwo();

}

function generateQRCode () {

}


function displayDate (date) {
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
            return (dateTime.getHours()-12) + ":" + minutes + " PM";
        }
    }
}


function hideEventForm() {
    addEventForm.hidden = true;
}
function showEventForm() {
    addEventForm.hidden = false;
}