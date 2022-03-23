
//load event list function

let today = new Date(3 , 1, 2022);

loadListButton.addEventListener("click", () => {


    eventList = db.collection("users").doc("testUser").collection("eventList");
    eventList
        .where("dateTime", ">", today )
        .orderBy("dateTime")
        .get()
        .then(userDoc => {
            let upcomingEventTemplate = document.getElementById("upcoming-event-bar-template");
            let eventTemplate = document.getElementById("event-bar-template");
            let eventWindowOne = document.getElementById("window-one");


            for (i = 0; i < Number(userDoc.docs.length); i++) {
                let eventData = userDoc.docs[i].data();

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
                    newEventBar.getElementById("event-time").innerHTML = eventData.time;
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