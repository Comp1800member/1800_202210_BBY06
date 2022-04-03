firebase.auth().onAuthStateChanged(user => {
  if (user) {
      //currentUser = db.collection("users").doc(user.uid); //global
      currentUser = db.collection("users").doc("testUser");
      console.log("user " + user.uid + " is logged in");

      loadGroups();
  } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "index.html";
  }
});

let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");

//Loads the groups of attendees in window one.//
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

//Loads all attendees belonging to the user onto window two//
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

// Loads all the attendees belonging to a group in window two. //
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

// Loads all the events that a specified attendee has been present in regardless of grouping//
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

// Loads the attendee details about a specified group of events on the third window.
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

// Formats the date object into a DD MMM YYYY format//
function displayDate(date) {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}


