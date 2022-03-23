//currently no button exists, when html is produced we will create an id for it and link it to this.
//function is not working, can't figure out why, console logs work, should be accessing proper db
//adds event listener
//created input field and button in main.html

//delete event button
let addEventName = document.getElementById("add-event-button");//linked to add-event-button in main
let eventDeletion = document.getElementById("delete-event-button");//linked to newly created delete-event-button

function deleteEvent (eventDeletion) {
    //get input parameters and use those as the string for the event to delete.
    //do the same thing for the add event button
    //let userName = document.getElementById("name-input").value

    console.log("Testing event deletion function");
  
    db.collection("users").doc("testUser").collection("eventList").doc("Buck").delete()
    // console.log("after delete");
}

eventDeletion.addEventListener("click", () => {
    console.log("This is delete button");
    deleteEvent("dummyEvent2");
})

function addEvent (addEventName) {
  db.collection("users").doc("testUser").collection("eventList").doc("Buck").set({/* Will eventually need to link addEventName(above) to
  input fields in the add Event form and also add details into the document fields with the input form*/
        
  }).then(function(){
    console.log("new info added to firestore");
    //window.localStorage.assign("main.html");
  })
  .catch(function(error){
    console.log(error);
  })
}

addEventName.addEventListener("click", () => {//event listener for add-event-button
  console.log("This is add event button");
  addEvent(addEventName);
})

//create event button

