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

// =========FUNCTION DEFINITIONS=========

checkInSubmit.addEventListener("click", () => {
    checkIn();
    logGuestIntoAttendeeList();
    
});

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

// =========FUNCTION CALLS=========

// loads event info into .event-bar
// currentUserAndEvent.get()
//     .then(result => {
//         console.log("The event title is", result.data().name);
//         eventTitle.innerHTML = result.data().name;
//         console.log("The event description is ", result.data().description);
//         eventDescription.innerHTML = result.data().description;
//     });