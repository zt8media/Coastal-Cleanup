function handleFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const subject = document.getElementById('subject').value;
    const comments = document.getElementById('comments').value;
}

 document.getElementById("first-name").addEventListener("click", function (event) {
        event.preventDefault();
        const firstName = document.getElementById("first-name").value;
    });

    document.getElementById("last-name").addEventListener("click", function (event) {
        event.preventDefault();
        const lastName = document.getElementById("last-name").value;
    });
    document.getElementById("subject").addEventListener("click", function (event) {
        event.preventDefault();
        const subject = document.getElementById("subejct").value;
    });
    document.getElementById("comments").addEventListener("click", function (event) {
        event.preventDefault();
        const comments = document.getElementById("comments").value;
    });

const form = document.querySelector('form');
form.addEventListener('submit'), function(event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!emailIsValid(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // If validation passes, submit the form
    form.submit();
});
