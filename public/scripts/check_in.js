/*
This document contains the functions to check in attendees into an event.
This functionality is only present in check_in.html.

Checking in follows two branches of activity. The attendee info is sent to 
the event guestlist(an array specific to a single event). 
The attendee info is also sent to the organizer's Attendee List which is the 
organizer's aggregated list of all past attendees.

*/ 

//-----------------------------------------------------------Get event id and user id from URL------------------------------------------------------------------------//
// gets params from the url itself
let params = new URL(window.location.href);
let userId = params.searchParams.get("userId");
let eventId = params.searchParams.get("eventId");

// elements and buttons from check_in.html
let eventTitle = document.getElementById("event-title");
let eventDescription = document.getElementById("event-description");
let checkInButton = document.getElementById("check-in-button");
let checkInForm = document.getElementById("check-in-form");
let checkInSubmit = document.getElementById("check-in-submit-button");

// the current user (organizer) and current event the attendee is checking in for
let currentUserAndEvent = db.collection("users").doc(userId).collection("eventList").doc(eventId);
console.log("currentUserAndEvent: " + currentUserAndEvent);

//-----------------------------------------------------------Submit button Listener------------------------------------------------------------------------//
// Checkin button activates the checkin process
checkInSubmit.addEventListener("click", () => {
    checkIn();
    logGuestIntoAttendeeList();
});

//-----------------------------------------------------------Check In Attendee to guestlist------------------------------------------------------------------------//
// sends attendee information to event guestlist.
function checkIn() {

    let attendeeFirstName = document.getElementById("attendee-fname").value;
    let attendeeLastName = document.getElementById("attendee-lname").value;
    let attendeeEmail = document.getElementById("attendee-email").value;

    if (!attendeeFirstName || !attendeeLastName) {
        alert("Attendee first and last name must not be empty.");
    } else {
        console.log("currentUserAndEvent in checkIn(): " + currentUserAndEvent);
        currentUserAndEvent.update({
            guestlist: firebase.firestore.FieldValue.arrayUnion(attendeeFirstName + " " + attendeeLastName)
        }).then(function () {
            console.log("new attendee added to guestlist");
            checkInSubmit.innerHTML = "Checked In!";
            checkInSubmit.style.backgroundColor = "orange";
            
        });
    }
}

//-----------------------------------------------------------Check In Attendee to Attendee List------------------------------------------------------------------------//
// sends attendee information to the organizer's Attendee List
// this function will not add attendees with emails that already exist in the Attendee List
function logGuestIntoAttendeeList() {
    let attendeeFirstName = document.getElementById("attendee-fname").value;
    let attendeeLastName = document.getElementById("attendee-lname").value;
    let attendeeEmail = document.getElementById("attendee-email").value;

    let userAttendeeList = db.collection("users").doc(userId).collection("attendeeList");

    userAttendeeList.get()
        .then((snapshot) => {
            let isMatch = 0;
            snapshot.forEach((attendee) => {
                if (attendee.data().email === attendeeEmail) {
                    isMatch++;
                    console.log("This attendee is already in attendee list");
                }
            });
            if(isMatch === 0){
                userAttendeeList.add({
                    firstName: attendeeFirstName,
                    lastName: attendeeLastName,
                    email: attendeeEmail
                })
                .then((docRef) => {
                    console.log("Logged attendee into attendee list");
                })
                .catch((error) => {
                    console.log("Error in adding attendee into attendee list");
                })
            }
        })
        .catch(error => {
            console.log("Error in checking for attendee");
        });
}
