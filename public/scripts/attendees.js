/* This document contains the functions to load content on Attendees.html. */

//------------------------------------------------------------------Firebase Authentication-----------------------------------------------------------------//
//Checks to make sure the user is logged in//
firebase.auth().onAuthStateChanged(user => {
  if (user) {
      currentUser = db.collection("users").doc(user.uid);
      //currentUser = db.collection("users").doc("testUser"); For testing using testuser
      console.log("user " + user.uid + " is logged in");

      loadGroups();
  } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "index.html";
  }
});

//On-page element selectors//
let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");

//----------------------------------------------------------------Load Attendee Groups-------------------------------------------------------------------//
//Reads the collection "groups" and loads all groups in window one.//
function loadGroups() {

  currentUser.collection("groups").get().then(
    groupList => {
      let listTemplate = document.getElementById("attendee-bar-template");

      let windowOneHeader = document.createElement("h4");
      windowOneHeader.innerHTML = "Event Groups";
      windowOneHeader.classList.add("list-divider");
      eventWindowOne.appendChild(windowOneHeader);

      let allButton = listTemplate.content.cloneNode(true);
      allButton.getElementById("attendee-name").innerHTML = "Show All Attendees";
      allButton.querySelector(".attendee-bar").onclick = () => loadAllAttendees();
      eventWindowOne.appendChild(allButton);

      groupList.forEach(group => {
        let newGroup = listTemplate.content.cloneNode(true);
        newGroup.getElementById("attendee-name").innerHTML = group.id;
        newGroup.querySelector(".attendee-bar").onclick = () => loadGroupAttendees(group.id);
        eventWindowOne.appendChild(newGroup);
      })
    }
  )
}

//--------------------------------------------------------------Load All Attendees---------------------------------------------------------------------//
//reads firebase collection "attendeeList", and outputs all results into window two//
function loadAllAttendees() {

  while (eventWindowTwo.firstChild) {
    eventWindowTwo.removeChild(eventWindowTwo.firstChild);
  }
  while (eventWindowThree.firstChild) {
    eventWindowThree.removeChild(eventWindowThree.firstChild);
  }

  let windowTwoHeader = document.createElement("h4");
  windowTwoHeader.innerHTML = "All Attendees";
  windowTwoHeader.classList.add("list-divider");
  eventWindowTwo.appendChild(windowTwoHeader);

  currentUser.collection("attendeeList").orderBy("lastName").get().then(
    userAttendees => {
      let attendeeListTemplate = document.getElementById("attendee-bar-template");

      userAttendees.forEach(attendee => {
        let newAttendeeList = attendeeListTemplate.content.cloneNode(true);
        let firstName = attendee.data().firstName;
        let lastName = attendee.data().lastName;
        newAttendeeList.getElementById("attendee-name").innerHTML = firstName + " " + lastName;
        newAttendeeList.querySelector(".attendee-bar").onclick = () => loadAllAttendeeDetails(firstName, lastName);
        eventWindowTwo.appendChild(newAttendeeList);
      })
    }
  );
  windowPositionTwo();
};

//------------------------------------------------------------------Load Grouped Attendees-----------------------------------------------------------------//
// Loads all the attendees belonging to a group in window two. //
//reads firebase collection "attendeeList", and outputs all results that have a specific group attribute (groupID)//
//input parameter: groupID//
function loadGroupAttendees(groupID) {
  while (eventWindowTwo.firstChild) {
    eventWindowTwo.removeChild(eventWindowTwo.firstChild);
  }

  currentUser.collection("attendeeList").where("group", "array-contains", groupID).get().then(
    groupAttendees => {
      let attendeeListTemplate = document.getElementById("attendee-bar-template");

      let windowTwoHeader = document.createElement("h4");
      windowTwoHeader.innerHTML = groupID + " Attendees";
      windowTwoHeader.classList.add("list-divider");
      eventWindowTwo.appendChild(windowTwoHeader);

      groupAttendees.forEach(attendee => {
        let newAttendeeList = attendeeListTemplate.content.cloneNode(true);
        let attendeeName = attendee.data().firstName + " " + attendee.data().lastName
        newAttendeeList.getElementById("attendee-name").innerHTML = attendeeName;
        newAttendeeList.querySelector(".attendee-bar").onclick = () => loadGroupAttendeeDetails(groupID, attendeeName);
        eventWindowTwo.appendChild(newAttendeeList);
      }

      )
    }
  )
  windowPositionTwo();
}
//--------------------------------------------------------------Load Attendee Details---------------------------------------------------------------------//
// Loads all the events that a specified attendee has been present in regardless of group attribute into window three.//
//reads firebase collection "eventList", and outputs all results where the event guestlist array contains a name matching the input//
//input parameters: firstName, lastName//
function loadAllAttendeeDetails(firstName, lastName) {

  while (eventWindowThree.firstChild) {
    eventWindowThree.removeChild(eventWindowThree.firstChild);
  }

  let windowThreeHeader = document.createElement("h4");
      windowThreeHeader.innerHTML = "Events Attended";
      windowThreeHeader.classList.add("list-divider");
      eventWindowThree.appendChild(windowThreeHeader);

      currentUser.collection("eventList").where("guestlist", "array-contains", firstName + " " + lastName).get().then(
    eventlist => {
      let attendeeListTemplate = document.getElementById("attendee-bar-template");
      if (eventlist.size === 0) {
        let newEventList = attendeeListTemplate.content.cloneNode(true);
        newEventList.getElementById("attendee-name").innerHTML = "This person has not attended any events.";
        eventWindowThree.appendChild(newEventList);
      } else {
        eventlist.forEach(event => {
          let newEventList = attendeeListTemplate.content.cloneNode(true);
          let newEventDate = event.data().dateTime.toDate();
          newEventList.getElementById("attendee-name").innerHTML = event.data().name + "</br>" + displayDate(newEventDate);
          eventWindowThree.appendChild(newEventList);
        })
      }
    }
  )
  windowPositionThree();
}

//-----------------------------------------------------------------Load Grouped Attendee Details------------------------------------------------------------------//
// This funnction pertains to a specific attendee.//
// It will read all past events with a specific group attribute into window three. The function will check each resulting event guestlist to see if the specific attendee was present in each. //
// if the attendee was present in that event, that event will be noted as attended. If the attendee was not present, that event will be noted as Absesnt. //
// results are output in window three. //
// input parameters: groupID, name //

function loadGroupAttendeeDetails(groupID, name) {
  while (eventWindowThree.firstChild) {
    eventWindowThree.removeChild(eventWindowThree.firstChild);
  }
  currentUser.collection("eventList").where("group", "==", groupID).get().then(
    groupEvents => {

      let listTemplate = document.getElementById("attendee-bar-template");

      let windowThreeHeader = document.createElement("h4");
      windowThreeHeader.innerHTML = groupID + " Events";
      windowThreeHeader.classList.add("list-divider");
      eventWindowThree.appendChild(windowThreeHeader);

      groupEvents.forEach(event => {
        let newEventList = listTemplate.content.cloneNode(true);
        let newEventDate = event.data().dateTime.toDate();
        let isPresent = event.data().guestlist.includes(name);
        console.log("isPresent: " + isPresent);
        if(isPresent){
          newEventList.getElementById("attendee-name").innerHTML = event.data().name + "</br>" + displayDate(newEventDate) + "</br>Attended";
        } else {
          newEventList.getElementById("attendee-name").innerHTML = event.data().name + "</br>" + displayDate(newEventDate)  + "</br>Absent";
        }
        eventWindowThree.appendChild(newEventList);
      })

    }
  )
  windowPositionThree();
}

//-----------------------------------------------------------Display Date------------------------------------------------------------------------//
// Formats the date object into a DD MMM YYYY format//
// input parameter: date //
function displayDate(date) {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}


