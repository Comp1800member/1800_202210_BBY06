let uploadButton = document.getElementById("upload-button");
let downloadButton = document.getElementById("download-button");
let addEventButton = document.getElementById("add-event-button");

uploadButton.addEventListener("click", () => {

    db.collection("users").doc("testUser").set({
            name: "hello this is a test",
            email: "again, a test"

        }).then(function () {
            console.log("new info added to firestore");
            //window.localStorage.assign("main.html");
        })
        .catch(function (error) {
            console.log(error);
        })

    //adds a test attendee in the attendeeList in the testUser collection
    db.collection("users").doc("testUser").collection("attendeeList").doc("testAttendee1").set({})
        .then(function () {
            console.log("new collection added to firestore.");
        })
        .catch(function (error) {
            console.log(error);
        })

    //adds a test event in the eventList in the testUser collection
    db.collection("users").doc("testUser").collection("eventList").doc("testEvent1").set({})
        .then(function () {
            console.log("new collection added to firestore.");
        })
        .catch(function (error) {
            console.log(error);
        })
})

downloadButton.addEventListener("click", () => {

})

addEventButton.addEventListener("click", () => {
    db.collection("users").doc("testUser").collection("eventList").doc("newEvent").set({
        capacity: 20,
        date: "march 3 2022",
        description: "description",
        name: "event name",
        time: "5 pm"
    }).then (function (){
        console.log("New Event added!")
    })
    .catch(function (error) {
        console.log(error);
    })
})