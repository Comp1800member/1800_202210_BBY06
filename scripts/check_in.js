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


// =========FUNCTION DEFINITIONS=========

function hideCheckInForm() {
    checkInForm.hidden = true;
}

function showCheckInForm() {
    checkInForm.hidden = false;
    checkInSubmit.addEventListener("click", () => {
        checkIn();
    });
}

function checkIn() {

    let attendeeFirstName = document.getElementById("attendee-fname").value;
    let attendeeLastName = document.getElementById("attendee-lname").value;
    let attendeeEmail = document.getElementById("attendee-email").value;

    if (!attendeeFirstName || !attendeeLastName) {
        alert("Attendee first and last name must not be empty.");
    } else {
        currentUserAndEvent.update({
            guestlist: firebase.firestore.FieldValue.arrayUnion(attendeeFirstName + " " + attendeeLastName)
        }).then(function () {
            console.log("new attendee added to guestlist");
            hideCheckInForm();
        });
    }
}

// =========FUNCTION CALLS=========

// loads event info into .event-bar
currentUserAndEvent.get()
    .then(result => {
        console.log("The event title is", result.data().name);
        eventTitle.innerHTML = result.data().name;
        console.log("The event description is ", result.data().description);
        eventDescription.innerHTML = result.data().description;
    });

// hides check in form on first load
hideCheckInForm();

// will give the giant check in button an event listener that starts the process to check in when clicked 
checkInButton.addEventListener("click", () => {
    showCheckInForm();
});