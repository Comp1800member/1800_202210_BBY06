let eventDescription = document.getElementById("event-title");
db.collection("users")
    .doc("testUser")
    .collection("eventList")
    .doc("Swim Practice")
    .get()
    .then(result => {
        console.log("The event title is", result.data().Name);
        eventDescription.innerHTML = result.data().Name;
    });
