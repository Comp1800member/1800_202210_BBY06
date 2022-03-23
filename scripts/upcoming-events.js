
//load event list function

let today = new Date(3 , 1, 2022);

loadListButton.addEventListener("click", () => {


    eventList = db.collection("users").doc("testUser").collection("eventList");
    eventList
        .where("dateTime", ">", today )
        .orderBy("dateTime")
        .get()
        .then(eventDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let eventWindowOne = document.getElementById("window-one");


            for (i = 0; i < Number(eventDoc.docs.length); i++) {
                let eventData = eventDoc.docs[i].data();

                console.log("eventData: " + eventData['dateTime'].toDate());

                if (i === 0) {
                    let newEventBar = upcomingEventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    newEventBar.getElementById("event-capacity").innerHTML = eventData.capacity;
                    //console.log(eventData.name);
                    //console.log(eventData.dateTime);
                    eventWindowOne.appendChild(newEventBar);

                } else {
                    let newEventBar = eventTemplate.content.cloneNode(true);
                    newEventBar.getElementById("event-title").innerHTML = eventData.name;
                    newEventBar.getElementById("event-date").innerHTML = displayDate(eventData['dateTime'].toDate());
                    newEventBar.getElementById("event-time").innerHTML = displayTime(eventData.dateTime.toDate());
                    newEventBar.getElementById("event-description").innerHTML = eventData.description;
                    eventWindowOne.appendChild(newEventBar);

                }

            }
        })
})


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