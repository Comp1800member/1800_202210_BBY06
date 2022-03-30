let eventTitle = document.getElementById("event-title");
let eventDescription = document.getElementById("event-description");
db.collection("users")
    .doc("testUser")
    .collection("eventList")
    .doc("Swim Practice")
    .get()
    .then(result => {
        console.log("The event title is", result.data().Name);
        eventTitle.innerHTML = result.data().Name;
        console.log("The event description is " , result.data().Description);
        eventDescription.innerHTML = result.data().Description;
    })