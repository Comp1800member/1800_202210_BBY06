let params = new URL(window.location.href);
let userId = params.searchParams.get("userId");
let eventId = params.searchParams.get("eventId");

let eventTitle = document.getElementById("event-title");
let eventDescription = document.getElementById("event-description");
let checkInButton = document.getElementById("check-in-button");
let checkInForm = document.getElementById("check-in-form");
let checkInSubmit = document.getElementById("check-in-submit-button");

let currentUserAndEvent = db.collection("users").doc(userId).collection("eventList").doc(eventId);

currentUserAndEvent.get()
    .then(result => {
        console.log("The event title is", result.data().name);
        eventTitle.innerHTML = result.data().name;
        console.log("The event description is ", result.data().description);
        eventDescription.innerHTML = result.data().description;
    })

hideCheckInForm();

checkInButton.addEventListener("click", () => {
    showCheckInForm(eventId);
});

function hideCheckInForm() {
    checkInForm.hidden = true;
}

function showCheckInForm(eId) {
    checkInForm.hidden = false;
    checkInSubmit.addEventListener("click", () => {
        checkIn(eId);
    });
}

function checkIn(docID) {

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