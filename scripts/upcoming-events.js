//window selectors//
let eventWindowOne = document.getElementById("window-one");
let eventWindowTwo = document.getElementById("window-two");
let eventWindowThree = document.getElementById("window-three");



//load event list function

let today = new Date(3 , 1, 2022);

loadListButton.addEventListener("click", loadUpcomingEvents);

//loads upcoming events on the page//
function loadUpcomingEvents () {

    eventList = db.collection("users").doc("testUser").collection("eventList");
    eventList
        .where("dateTime", ">=", today )
        .orderBy("dateTime")
        .get()
        .then(eventDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");


            for (i = 0; i < Number(eventDoc.docs.length); i++) {
                let eventData = eventDoc.docs[i].data();

                console.log("eventData: " + eventData['dateTime'].toDate());

                if (i === 0) {
                    let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                    newEventBar.getElementById("event-time").innerHTML = eventData.dateTime.toDate().toLocaleTimeString();
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                    newEventBar.querySelector(".upcoming-event-bar").onclick = () => console.log("hello");
                    let nextEventLabel = document.createElement("h4");
                    nextEventLabel.innerHTML = "Next Event";
                    nextEventLabel.classList.add("list-divider");
                    eventWindowOne.appendChild(nextEventLabel);

                    eventWindowOne.appendChild(newEventBar);

                    let upcomingEventLabel = document.createElement("h4");
                    upcomingEventLabel.innerHTML = "Upcoming Events";
                    upcomingEventLabel.classList.add("list-divider");
                    eventWindowOne.appendChild(upcomingEventLabel);

                } else {
                    let newEventBar = eventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                    newEventBar.getElementById("event-time").innerHTML = eventData.dateTime.toDate().toLocaleTimeString();
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.querySelector(".event-bar").onclick = () => console.log("hello");
                    eventWindowOne.appendChild(newEventBar);

                }

            }

        })
    }

function loadEventDetails () {

}


function displayDate (date) {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}

function displayTime(dateTime) {
    if (dateTime.getMinutes() < 10) {
        minutes = "0" + dateTime.getMinutes();
    } else {
        minutes = dateTime.getMinutes();
    }

    if (dateTime.getHours() < 12) {
        if (dateTime.getHours() == 0) {
            return "12:" + minutes + " AM";
        } else {
            return dateTime.getHours() + ":" + minutes + " AM";
        }
    }
    if (dateTime.getHours() <= 23 && dateTime.getHours() >= 12) {
        if (dateTime.getHours() == 12) {
            return "12:" + minutes + " PM";
        } else {
            return (dateTime.getHours()-12) + ":" + minutes + " PM";
        }
    }
}