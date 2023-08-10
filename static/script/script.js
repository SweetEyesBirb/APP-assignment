
/**
* main() is a function that uses AJAX to GET a request from the API @app.route("/events") in main.py
* It parses the response while storing it in a variable called "parsedEventsList"
* It contains all the other functions of the file.
*
* @param none
* @return void
*/

function main() {

    let xhr = new XMLHttpRequest();

    xhr.open("GET", "/events", true); // gets the response from the API @app.route("/events") in main.py

    xhr.responseType = 'json'; // new feature that automatically parses a JSON response

    // AJAX IF ELSE STATEMENT STARTS HERE

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            /* _____________________________________________________________________ */

            // RENDER EVENTS BLOCK STARTS HERE

            // parses the JSON object from the response text
            // let parsedEventsList = JSON.parse(this.responseText); // Fron-end convert data from JSON format

            let parsedEventsList = xhr.response; // Stores the above parsed JSON response into a variable. New way of using JSON.parse(this.responseText) together with xhr.responseType = 'json';

            // Accesses the Object array called eventsList from the parsed JSON file
            let events = parsedEventsList.eventsList;

            // selects the ul with all the elements
            const eventsElement = document.querySelector(".events");

            /**
            * a forEach loop is called on the "events" variable which holds the
            * parsed JSON objects and renders the events list dinamically using
            * Template Literals by appending an HTML block in the eventsElement.
            *
            * @param callback function @param variable that loops through the events object
            * @return void
            */
            function displayEventCards() { // Listing of data with details
                events.forEach(function (event) {
                    eventsElement.innerHTML += `
                   <li class="event-card" id="${event.id}">
                   <div class="venue-card">
                       <span class="dates">${event.date}</span>
                       <span class="venue">${event.venue}</span>
                       <span class="location">${event.location}</span>
                       <span class="price">£ ${event.price}</span>
                       <div class="add-to-basket-div">                                                                
                           <span>Add To Basket</span>                                                     
                       </div>
                   </div>
               </li>
               `
                });
            }

            displayEventCards();

            // RENDER EVENTS BLOCK ENDS HERE

            /* _____________________________________________________________________ */


            // SEARCH FILTER CODE BLOCK STARTS HERE

            // Get search input
            const searchInput = document.getElementById("myInput");

            /** 
            This function filters the events by venue
            *
            * @param none
            * @return void
            */
            function filterEvents() { // Extra feature + selection of data item and display its details

                // Get value of search input
                const filterValue = searchInput.value.toUpperCase();

                // Get all event cards
                const eventCards = document.querySelectorAll(".event-card");

                // Loop through cards
                eventCards.forEach(eventCard => {
                    // Get venue of current card
                    const venue = eventCard.querySelector(".venue").innerHTML.toUpperCase();

                    // Check if the venue of the current card matches the search input
                    if (venue.indexOf(filterValue) > -1) {
                        eventCard.style.display = "";
                    } else {
                        eventCard.style.display = "none";
                    }
                });
            };

            // Event listener for the search input
            searchInput.addEventListener("keyup", filterEvents);

            // SEARCH FILTER CODE BLOCK ENDS HERE

            /* _____________________________________________________________________ */


            // DELETE CARD CODE BLOCK STARTS HERE

            const btnDelete = document.getElementById("delete-event")

            /**
             * deleteEventCard() removes the last event card from the DOM
             *
             * @param none
             * @return void
             */
            function deleteEventCard() { // deletion of data item
                const eventCards = document.querySelectorAll(".event-card");
                const lastEventCard = eventCards[eventCards.length - 1]; // returns the element at [last index] of the eventCards array
                lastEventCard.remove();
            }

            btnDelete.addEventListener("click", deleteEventCard);

            // DELETE CARD CODE BLOCK ENDS HERE

            /* _____________________________________________________________________ */


            // EVENT FORM BLOCK STARTS HERE

            const formEventID = document.getElementById("event-id");
            const formLocation = document.getElementById("location");
            const formVenue = document.getElementById("venue");
            const formPrice = document.getElementById("price");
            const formAvailable = document.getElementById("available");
            const formDate = document.getElementById("date");
            const formBtnSubmit = document.getElementById("submit");


            /** 
            * This function saves and sends the "newEvent" object as JSON file to the API located in main.py called "update_events_list()"
            * 
            * @param none
            * @return void
            */
            function saveNewEvent() {

                // convert data to JSON format and save it in an object
                let newEvent = JSON.stringify({
                    id: formEventID.value,
                    location: formLocation.value,
                    venue: formVenue.value,
                    price: formPrice.value,
                    available: formAvailable.value,
                    date: formDate.value
                });


                // PUT request to send data to the API
                xhr.open("PUT", "/events", true);

                xhr.setRequestHeader("Content-type", "application/json");

                // sends the stringified object to the API using the PUT request. The API will then push the object in the JSON file at "data/database.json"
                xhr.send(newEvent);

                // save list in local storage
                localStorage.setItem("newEvent", newEvent);
            }

            // EVENT FORM BLOCK ENDS HERE

            /* _____________________________________________________________________ */


            // FORM VALIDATOR BLOCK STARTS HERE

            /**
               * This function validates the form.
               * If the ID is not an integer less than 20, or the location is empty, or the venue is
               * empty, or the price is not an integer less than 100, or the available is not an integer
               * less than 100000, or the date is not of format YYYY-MM-DD, then the function alerts the user
               * of the error. Otherwise, enables the submit button, while changing the submit button inner text for 3
               * seconds.
               *
               * @param none
               * @return void
               */
            function validateForm() {
                if (isNaN(parseInt(formEventID.value)) || parseInt(formEventID.value) >= 20) {
                    formBtnSubmit.disabled;
                    alert("ID must be an Integer less than 20");
                } else if (!formLocation.value) {
                    formBtnSubmit.disabled;
                    alert("Location must not be empty");
                } else if (!formVenue.value) {
                    formBtnSubmit.disabled;
                    alert("Venue must not be empty");
                } else if (isNaN(parseInt(formPrice.value)) || parseInt(formPrice.value) >= 100) {
                    formBtnSubmit.disabled;
                    alert("Price must be an Integer less than 100");
                } else if (isNaN(parseInt(formAvailable.value)) || parseInt(formAvailable.value) > 100000) {
                    formBtnSubmit.disabled;
                    alert("Available must be an Integer less than 100000");
                } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formDate.value)) { // The test() method executes a search for a match between a regular expression and a specified string. Returns true if there is a match; false otherwise. MDN official docs.
                    formBtnSubmit.disabled;
                    alert("Date must be of format 2023-12-31");
                } else {
                    !formBtnSubmit.disabled;
                    formBtnSubmit.innerText = "Form Sent";
                    setTimeout(function () {
                        formBtnSubmit.innerText = "Submit";
                        document.location.reload(); // Reloads the page to show newly added card
                    }, 1500); // 1.5 sec delay
                    saveNewEvent(); // Call to the function that saves the new event in an object and sends it to the Flask API.
                }
            }

            formBtnSubmit.addEventListener("click", validateForm, false);

            // FORM VALIDATOR BLOCK ENDS HERE

            /* _____________________________________________________________________ */


            // POPULATE FORM STARTS HERE

            /**
             * The function populates a form with data retrieved from local
             * storage or sets empty strings if no data is found.
             */
            function populateForm() {

                const data = JSON.parse(localStorage.getItem("newEvent")) || [];

                formEventID.value = data.id || "";
                formLocation.value = data.location || "";
                formVenue.value = data.venue || "";
                formPrice.value = data.price || "";
                formAvailable.value = data.available || "";
                formDate.value = data.date || "";
            }

            populateForm();

            // POPULATE FORM ENDS HERE
        }
        // AJAX IF STATEMENT ENDS HERE
    }
    xhr.send();
    // XHR onreadystatechange ANONYM FUNCTION ENDS HERE
}

main();
