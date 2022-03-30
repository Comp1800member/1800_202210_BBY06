//currently no button exists, when html is produced we will create an id for it and link it to this.
//function is not working, can't figure out why, console logs work, should be accessing proper db
//adds event listener
//created input field and button in main.html

//delete event button
let addEventSubmitButton = document.getElementById("add-event-submit-button"); //linked to add-event-button in main
let eventToDelete;
let deleteEventButton = document.getElementById("delete-event-button"); //linked to newly created delete-event-button
let inputEventName;
let inputEventDate;
let inputEventTime;
let inputEventCapacity;
let inputEventDescription;
let inputEventGroup;

//sets the event to delete variable
function deleteSetter() {
  if (document.getElementById("delete-event-input") != null) {
    eventToDelete = document.getElementById("delete-event-input").value;
  } else {
    console.log("Name of event to delete must not be null");
  }
}


// sets all of the input fields to a variable if they are inputted
function setter() {
  if (document.getElementById("event-form-input-name") != null) {
    inputEventName = document.getElementById("event-form-input-name").value;
  } else {
    console.log("Event name input must not be null");
  }

  if (document.getElementById("event-form-input-date") != null) {
    inputEventDate = document.getElementById("event-form-input-date").value;
  } else {
    console.log("Event date input must not be null");
  }

  if (document.getElementById("event-form-input-time") != null) {
    inputEventTime = document.getElementById("event-form-input-time").value;
  } else {
    console.log("Event time input must not be null");
  }

  if (document.getElementById("event-form-input-capacity") != null) {
    inputEventCapacity = document.getElementById("event-form-input-capacity").value;
  } else {
    console.log("Event capacity input must not be null");
  }

  if (document.getElementById("event-form-input-description") != null) {
    inputEventDescription = document.getElementById("event-form-input-description").value;
  } else {
    console.log("Event description input must not be null");
    alert("description must not be empty");
  }

  if (document.getElementById("event-form-input-group") != null) {
    inputEventGroup = document.getElementById("event-form-input-group").value;
  }
}

function addEvent() {
  db.collection("users").doc("testUser").collection("eventList").doc().set({
      /* Will eventually need to link addEventName(above) to
       input fields in the add Event form and also add details into the document fields with the input form*/
      Name: inputEventName,
      Date: inputEventDate,
      Time: inputEventTime,
      Capacity: inputEventCapacity,
      Description: inputEventDescription,
      Group: inputEventGroup
    }).then(function () {
      console.log("new info added to firestore");
      //window.localStorage.assign("main.html");
    })
    .catch(function (error) {
      console.log(error);
    })
}

addEventSubmitButton.addEventListener("click", () => {
  console.log("This is add-event button");
  setter();
  if (inputEventName == "" || inputEventDate == "" || inputEventCapacity == "" || inputEventDescription == ""
  || inputEventTime == "") {
    alert("Event name, date, capacity, description, time, and group must not be empty!");
  }
  addEvent();
})
//create event button

//delete event stuff down here
//need to link
function deleteEvent(eventToDelete) {
  //get input parameters and use those as the string for the event to delete.
  //do the same thing for the add event button
  //let userName = document.getElementById("name-input").value

  console.log("Testing event deletion function");
  eventToDelete.toString();
  db.collection("users").doc("testUser").collection("eventList").doc(eventToDelete).delete({
    /* Will eventually need to link addEventName(above) to
     input fields in the add Event form and also add details into the document fields with the input form*/
  }).then(function () {
    console.log("event deleted from firestore");
    //window.localStorage.assign("main.html");
  })
  .catch(function (error) {
    console.log(error);
  })
  // console.log("after delete");
}

deleteEventButton.addEventListener("click", () => {
  console.log("This is delete button");
  deleteSetter();
  if (eventToDelete == ""){
    alert("The name of the event that you want to delete must not be empty");
  }
  deleteEvent(eventToDelete);
})


let eventTitle = db.collection("users").doc("testUser").collection("eventList").doc("SwimPractice").get("Name");
console.log("The event title is" + eventTitle);