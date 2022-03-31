

//--------------------------------Add Event Function------------------------//
function addEvent() {

  let inputEventName = document.getElementById("event-form-input-name").value;
  let inputEventDate = document.getElementById("event-form-input-date").value;
  let inputEventTime = document.getElementById("event-form-input-time").value;
  let inputEventDescription = document.getElementById("event-form-input-description").value;
  let inputEventCapacity = document.getElementById("event-form-input-capacity").value;

  if (!inputEventName || !inputEventDate || !inputEventDescription || !inputEventTime) {
    alert("Event name, date, time, and description, must not be empty.");
    
  } else {
    let dateTimeString = inputEventDate + "T" + inputEventTime + ":00";
    currentUser.collection("eventList").doc().set({
      name: inputEventName,
      dateTime: firebase.firestore.Timestamp.fromDate(new Date(dateTimeString)),
      capacity: inputEventCapacity,
      description: inputEventDescription,
      guestlist: []
    }).then(function () {
      console.log("new info added to firestore");
      hideEventForm();
    })
      .catch(function (error) {
        console.log(error);
      })
  }
}

//--------------------------------Delete Event Function------------------------//
function deleteEvent(docID) {

  currentUser.collection("eventList").doc(docID).delete({
  }).then(function () {
    console.log("event deleted from firestore");
  })
    .catch(function (error) {
      console.log(error);
    })
}

//--------------------------------Add Present Attendees Function------------------------//
function addAttendee(docID) {

  let attendeeFirstName = document.getElementById("attendee-fname").value;
  let attendeeLastName = document.getElementById("attendee-lname").value;
  let attendeeEmail = document.getElementById("attendee-email").value;

  if (!attendeeFirstName || !attendeeLastName) {
    alert("Attendee first and last name must not be empty.");
  } else {
    currentUser.collection("eventList").doc(docID).update({
      guestlist: firebase.firestore.FieldValue.arrayUnion(attendeeFirstName + " " + attendeeLastName)
    }).then(function () {
      console.log("new attendee added to guestlist");
      hideAttendeeForm();
    });
  }

}