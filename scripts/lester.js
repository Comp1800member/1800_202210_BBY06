//Loading attendee list in attendees.html

let attendeesList = db.collection("users").doc("testUser").collection("attendeeList");

attendeesList.orderBy("name").get().then(
  userAttendees => {
    let attendeeListTemplate = document.getElementById("attendee-bar-template");
    let eventWindowOne = document.getElementById("window-one");

    console.log(userAttendees.docs);
    console.log("length: " + userAttendees.docs.length);

    for (i = 0; i < Number(userAttendees.docs.length); i++) {
      let attendeeInfo = userAttendees.docs[i].data();
      let newAttendeeList = attendeeListTemplate.content.cloneNode(true);

      newAttendeeList.getElementById("attendee-name").innerHTML = attendeeInfo.name;

      eventWindowOne.appendChild(newAttendeeList);
    }
  })

// Adding new attendee from Add Attendee form page

let addAttendeeButton = document.getElementById("add-attendee-button");

addAttendeeButton.addEventListener("click", () => {
  let firstName = document.getElementById("firstname").value;
  let lastName = document.getElementById("lastname").value;
  let email = document.getElementById("email").value;

  attendeesList.add({
      name: firstName + " " + lastName,
      email: email
    }).then(function () {
      console.log("New Attendee added!");
    })
    .catch(function (error) {
      console.log(error);
    })
})