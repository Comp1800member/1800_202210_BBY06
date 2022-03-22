//Loading attendee list in attendees.html

let attendeesList = db.collection("users").doc("testUser").collection("attendeeList");

attendeesList.orderBy("lastName").get().then(
  userAttendees => {
    let attendeeListTemplate = document.getElementById("attendee-bar-template");
    let eventWindowOne = document.getElementById("window-one");

    console.log(userAttendees.docs);
    console.log("length: " + userAttendees.docs.length);

    for (i = 0; i < Number(userAttendees.docs.length); i++) {
      let attendeeInfo = userAttendees.docs[i].data();
      let newAttendeeList = attendeeListTemplate.content.cloneNode(true);

      newAttendeeList.getElementById("attendee-name").innerHTML = attendeeInfo.firstName + " " + attendeeInfo.lastName;

      eventWindowOne.appendChild(newAttendeeList);
    }
  })

// Adding new attendee from Add Attendee form page

let addAttendeeButton = document.getElementById("add-attendee-button");

addAttendeeButton.addEventListener("click", () => {
  let first = document.getElementById("firstname").value;
  let last = document.getElementById("lastname").value;
  let emailAddress = document.getElementById("email").value;

  attendeesList.add({
      firstName: first,
      lastName: last,
      email: emailAddress
    }).then(function () {
      console.log("New Attendee added!");
    })
    .catch(function (error) {
      console.log(error);
    })
})