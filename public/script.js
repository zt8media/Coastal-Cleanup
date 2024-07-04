document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var map;
    var geocoder;
    var autocomplete;
    var markers = []; // Array to store markers

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });
        geocoder = new google.maps.Geocoder();

        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('location'), { types: ['geocode'] });
        
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (place.geometry) {
                map.setCenter(place.geometry.location);
                addMarker(place.geometry.location, null);
            }
        });
    }

    function addMarker(location, event) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        markers.push({ marker: marker, event: event }); // Store marker and event

        if (event) {
            var infoWindow = new google.maps.InfoWindow({
                content: `<div>
                            <strong>${event.title}</strong><br>
                            ${event.description || ''}<br>
                            ${event.start}<br>
                            ${event.end}
                          </div>`
            });

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        }

        map.setCenter(location);
    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            right: 'prev,next',
            center: 'title',
            left: 'dayGridMonth,dayGridWeek', // user can switch between the two
          },
        editable: true,
        selectable: true,
        events: '/events', // Fetch events from server
        select: function(info) {
            var title = prompt('Enter Event Title:');
            if (title) {
                var eventData = {
                    title: title,
                    start: info.startStr,
                    end: info.endStr,
                    description: prompt('Enter Event Description:')
                };
                calendar.addEvent(eventData); // Add the event to the calendar
                saveEvent(eventData); // Save the event to the server
            }
            calendar.unselect();
        },
        eventClick: function(info) {
            if (confirm(`Are you sure you want to delete the event '${info.event.title}'?`)) {
                deleteEvent(info.event.id).then(() => {
                    info.event.remove(); // Remove the event from the calendar
                }).catch(error => {
                    alert('Failed to delete event. Please try again.');
                    console.error('Error deleting event:', error);
                });
            }
        },
        eventDidMount: function(info) {
            console.log('Event mounted:', info.event); // Debug log for event rendering

            // Geocode the event location and add a marker
            geocoder.geocode({ 'address': info.event.extendedProps.location }, function(results, status) {
                if (status === 'OK') {
                    addMarker(results[0].geometry.location, info.event);
                } else {
                    console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    });

    calendar.render();
    initMap();

    async function saveEvent(eventData) {
        try {
            console.log('Sending event data to server:', eventData); // Debug log
            const response = await fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error saving event:', errorData); // Log error details
                alert(`Error saving event: ${errorData.message}`);
            } else {
                const newEvent = await response.json();
                console.log('Event saved successfully:', newEvent); // Log success

                // Geocode the new event location and add a marker
                geocoder.geocode({ 'address': eventData.location }, function(results, status) {
                    if (status === 'OK') {
                        addMarker(results[0].geometry.location, newEvent);
                    } else {
                        console.error('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }
        } catch (error) {
            console.error('Request failed', error);
            alert('Error saving event. Please try again.');
        }
    }

    async function deleteEvent(eventId) {
        try {
            const response = await fetch(`/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting event:', errorData); // Log error details
                alert(`Error deleting event: ${errorData.message}`);
            } else {
                console.log('Event deleted successfully');
            }
        } catch (error) {
            console.error('Request failed', error);
            alert('Error deleting event. Please try again.');
        }
    }

    document.getElementById('eventForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            start: document.getElementById('start').value,
            end: document.getElementById('end').value,
            description: document.getElementById('description').value,
            location: document.getElementById('location').value
        };

        try {
            console.log('Submitting form data:', formData); // Debug log
            const response = await fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newEvent = await response.json();
                console.log('New event added:', newEvent); // Debug log
                calendar.addEvent(newEvent); // Add the new event to the calendar
                alert('Event added successfully!');
                document.getElementById('eventForm').reset();

                geocoder.geocode({ 'address': formData.location }, function(results, status) {
                    if (status === 'OK') {
                        addMarker(results[0].geometry.location, newEvent);
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            } else {
                const errorData = await response.json();
                console.error('Error adding event:', errorData); // Log error details
                alert(`Error adding event: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Request failed', error);
            alert('Error adding event. Please try again.');
        }
    });
});


