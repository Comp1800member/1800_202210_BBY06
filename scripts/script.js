//initialize variables
let hamburgerButton = document.getElementById("hamburger-menu-button");
let hamburgerMenu = document.querySelector(".hamburger-menu");
let eventButton = document.getElementById("add-event-button");
let eventAddMenu = document.querySelector(".add-event");
let loadListButton = document.getElementById("load-events");

//event listeners
hamburgerButton.addEventListener("click", ()=>{
    hamburgerMenu.classList.toggle("active");
    console.log("This is hamburger menu");
})

eventButton.addEventListener("click", ()=>{
    eventAddMenu.classList.toggle("active");
    console.log("This is add event menu");
})

loadListButton.addEventListener("click", ()=> {

    
    eventList = db.collection("users").doc("testUser").collection("eventList");
    eventList.get()
    .then(userDoc => {
        let template = document.getElementById("event-bar-template");
        let eventWindow = document.getElementById("event-window");
        console.log(userDoc.docs);
        console.log("length: " + userDoc.docs.length);
        console.log(userDoc.docs[1].data());
        console.log(userDoc.docs[1].data().name);

        for(i=0; i<Number(userDoc.docs.length); i++) {
            let eventData = userDoc.docs[i].data();

            console.log("eventData: " + eventData.name);
            

            let newEventBar = template.content.cloneNode(true);
            newEventBar.getElementById("event-title").innerHTML = eventData.name;
            newEventBar.getElementById("event-date").innerHTML = eventData.date;
            newEventBar.getElementById("event-time").innerHTML = eventData.time;
            newEventBar.getElementById("event-description").innerHTML = eventData.description;
            newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;

            eventWindow.appendChild(newEventBar);



        }
    })
})