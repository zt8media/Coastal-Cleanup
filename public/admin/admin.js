// Selecting elements
const addQueButton = document.getElementById('addQue-submit');
const displayQueButton = document.querySelector('#queDisplay button');
const deleteQueButton = document.getElementById('deleteQue-submit');
const displayQueDiv = document.getElementById('queDisplay div');

// Display queue data
function displayQueueData(queueData, targetDivId) {
    // Check if the queue data array has at least one element and that it's an array of objects
    console.log(queueData);
    if (!Array.isArray(queueData) || !queueData.length) {
        console.error('Invalid queue data.');
        return;
    }

    const queueEntries = queueData; // Assuming the queue data is in the first element of the array
    let htmlContent = '<div class="queue-container">';

    // Generate HTML for each queue entry
    queueEntries.forEach(entry => {
        htmlContent += `
            <div class="queue-entry">
                <h3>Que ID: ${entry.queID}</h3>
                <p>Name: ${entry.firstname} ${entry.lastname}</p>
                <p>Email: ${entry.email}</p>
                <p>Subject: ${entry.subject}</p>
                <p>Comment: ${entry.comment}</p>
            </div>
        `;
    });

    htmlContent += '</div>';

    // Find the target div by ID and set its inner HTML to the generated content
    const targetDiv = document.getElementById(targetDivId).querySelector('div');
    if (targetDiv) {
        targetDiv.innerHTML = htmlContent;
    } else {
        console.error('Target div not found.');
    }
}


// Event listener for adding to the queue
addQueButton.addEventListener('click', function(event) {
    event.preventDefault();
    const question = document.getElementById('firstName').value;
    const answer = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const comment = document.getElementById('comment').value;
    
    // Simulated API call to add an item to the queue
    addQue({question, answer, email, subject, comment});
});

// Event listener for displaying the queue
displayQueButton.addEventListener('click', function(event) {
    event.preventDefault();
    getQue();
});

// Event listener for deleting from the queue
deleteQueButton.addEventListener('click', function(event) {
    event.preventDefault();
    const queId = document.getElementById('deleteQue-id').value;
    
    // Simulated API call to delete an item from the queue
    deleteQue(queId);
});

// API call simulations
function addQue(data) {
    console.log('Adding to queue:', data);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('/addQue', options)
    .then(response => {
        if (response.status === 500) {
            alert('Internal server error');
            return;
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            return;
        }
        console.log('Added to queue:', data);
    })
    .catch(error => console.error(error));
}

function getQue() {
    console.log('Fetching queue data');

    fetch('/getQue')
    .then(response => {
        if (response.status === 500) {
            alert('Internal server error');
            return;
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            return;
        }
        console.log('Queue data:', data);
        displayQueueData(data.message, 'queDisplay');
    })
    .catch(error => console.error(error));
}

function deleteQue(id) {
    console.log('Deleting from queue:', id);

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(`/deleteQue/${id}`, options)
    .then(response => {
        if (response.status === 500) {
            alert('Internal server error');
            return;
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            return;
        }
        console.log('Deleted from queue:', data);
    })
    .catch(error => console.error(error));
}
