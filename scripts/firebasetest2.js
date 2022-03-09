
let uploadButton = document.getElementById("upload-button");
let downloadButton = document.getElementById("download-button");

uploadButton.addEventListener("click", ()=> {
    
    db.collection("users").doc("testUser").set({
          name: "hello this is a test",
          email: "again, a test"
          
        }).then(function(){
          console.log("new info added to firestore");
          //window.localStorage.assign("main.html");
        })
        .catch(function(error){
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
    db.collection("users").doc("testUser").collection("eventList").doc("testEvent1").set({flavor: "sweet"})
    .then(function () {
        console.log("new collection added to firestore.");
    })
    .catch(function (error) {
        console.log(error);
    })
})

downloadButton.addEventListener("click", ()=> {
    currentUser = db.collection("users").doc("testUser");
    currentUser.get()
    .then(userDoc => {
        console.log(userDoc.data());
        console.log(userDoc.data().name);
    })

    currentEvent = db.collection("users").doc("testUser").collection("eventList").doc("testEvent1");
    currentEvent.get()
    .then(eventDoc => {
        console.log(eventDoc.data());
        console.log(eventDoc.data().flavor);
    })
})