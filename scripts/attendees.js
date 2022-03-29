let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");


window.addEventListener("load", loadGroups);

//Loads the groups of attendees in window one.//
function loadGroups() {

  db.collection("users").doc("testUser").collection("groups").get().then(
    groupList => {

      let listTemplate = document.getElementById("attendee-bar-template");

      let windowOneHeader = document.createElement("h4");
      windowOneHeader.innerHTML = "Groups";
      windowOneHeader.classList.add("list-divider");
      eventWindowOne.appendChild(windowOneHeader);

      let allButton = listTemplate.content.cloneNode(true);
      allButton.getElementById("attendee-name").innerHTML = "All Attendees";
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

  let windowTwoHeader = document.createElement("h4");
  windowTwoHeader.innerHTML = "All Attendees";
  windowTwoHeader.classList.add("list-divider");
  eventWindowTwo.appendChild(windowTwoHeader);

  db.collection("users").doc("testUser").collection("attendeeList").orderBy("lastName").get().then(
    userAttendees => {
      let attendeeListTemplate = document.getElementById("attendee-bar-template");


      for (i = 0; i < Number(userAttendees.docs.length); i++) {
        let attendeeInfo = userAttendees.docs[i].data();
        let newAttendeeList = attendeeListTemplate.content.cloneNode(true);

        newAttendeeList.getElementById("attendee-name").innerHTML = attendeeInfo.firstName + " " + attendeeInfo.lastName;
        newAttendeeList.querySelector(".attendee-bar").onclick = () => loadAllAttendeeDetails();
        eventWindowTwo.appendChild(newAttendeeList);
      }
    }
  );
  windowPositionTwo();
};

// Loads all the attendees belonging to a group in window two. //
function loadGroupAttendees(groupID) {
  while (eventWindowTwo.firstChild) {
    eventWindowTwo.removeChild(eventWindowTwo.firstChild);
  }

  db.collection("users").doc("testUser").collection("attendeeList").where("group", "array-contains", groupID).get().then(
    groupAttendees => {
      let attendeeListTemplate = document.getElementById("attendee-bar-template");

      let windowTwoHeader = document.createElement("h4");
      windowTwoHeader.innerHTML = groupID + " Attendees";
      windowTwoHeader.classList.add("list-divider");
      eventWindowTwo.appendChild(windowTwoHeader);

      groupAttendees.forEach(attendee => {
        let newAttendeeList = attendeeListTemplate.content.cloneNode(true);
        newAttendeeList.getElementById("attendee-name").innerHTML = attendee.data().firstName + " " + attendee.data().lastName;
        newAttendeeList.querySelector(".attendee-bar").onclick = () => loadGroupAttendeeDetails(groupID);
        eventWindowTwo.appendChild(newAttendeeList);
      }

      )
    }
  )
  windowPositionTwo();
}



// Loads all the attendee details on the third window.
function loadGroupAttendeeDetails(groupID) {
  while (eventWindowThree.firstChild) {
    eventWindowThree.removeChild(eventWindowThree.firstChild);
  }
  db.collection("users").doc("testUser").collection("eventList").where("group", "==", groupID).get().then(
    groupEvents => {

      let listTemplate = document.getElementById("attendee-bar-template");

      let windowThreeHeader = document.createElement("h4");
      windowThreeHeader.innerHTML = "Events";
      windowThreeHeader.classList.add("list-divider");
      eventWindowThree.appendChild(windowThreeHeader);

      groupEvents.forEach(event => {
        let newEventList = listTemplate.content.cloneNode(true);
        let newEventDate = event.data().dateTime.toDate();
        newEventList.getElementById("attendee-name").innerHTML = event.data().name + " " + displayDate(newEventDate);
        eventWindowThree.appendChild(newEventList);
      })

    }
  )



}

function displayDate (date) {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}


// Adding new attendee from Add Attendee form page
let addAttendeeButton = document.getElementById("add-attendee-button");

addAttendeeButton.addEventListener("click", () => {
  let first = document.getElementById("firstname").value;
  let last = document.getElementById("lastname").value;
  let emailAddress = document.getElementById("email").value;

  if (first == "" || last == "") {
    alert("First name and last name must not be empty!");
  } else {
    attendeesList.add({
      firstName: first,
      lastName: last,
      email: emailAddress
    }).then(function () {
      console.log("New Attendee added!");
      document.getElementById("firstname").value = "";
      document.getElementById("lastname").value = "";
      document.getElementById("email").value = "";
    })
      .catch(function (error) {
        console.log(error);
      })
  }
});

