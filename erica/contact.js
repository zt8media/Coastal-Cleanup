const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("emailAddress");
const subject = document.getElementById("subject");
const comment = document.getElementById("message");
function errorMsg(input, msg) {
    const formc = input.parentElement;
    formc.classList.add("error");
    let errorTag = formc.querySelector("p");
    // message
    // small.style.error = "visible";
    if(errorTag){
        errorTag.style.visibility = "visible"

        errorTag.textContent = msg;

    }    

    input.classList.add("error-input");
};
function removeErrorMsg(input) {
    const form = input.parentElement;
    form.classList.remove("error");
    let errorTag = form.querySelector("p");

    errorTag.style.visibility = "hidden"

    input.classList.remove("error-input");

    // e.preventDefault();
};
form.addEventListener("submit", function(e) {
    e.preventDefault();
    let pass = true;
    if (firstName.value.length < 1 || firstName.value.length >= 20) {
        if(firstName.value.length < 1 ){
            errorMsg(firstName, "First name is required");
        } else {
            errorMsg(firstName, "First name too long");
        }
    }
    else {
        removeErrorMsg(firstName);
        pass = false;
    }
    if (lastName.value.length < 1 || lastName.value.length >= 20) {
        if(lastName.value.length < 1 ){
            errorMsg(lastName, "Last name is required");
        } else {
            errorMsg(lastName, "Last name too long");
        }
    }
    else {
        removeErrorMsg(lastName);
        pass = false;
    }
    if (emailAddress.value === "" || !/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(emailAddress.value) >= 255) {
        errorMsg(emailAddress, "Email is required");
    } else {
        removeErrorMsg(email);
        pass = false;
    }
    if (subject.value === "" || subject.value.length >= 50) {
        errorMsg(subject, "Subject is required");
    } else {
        removeErrorMsg(subject);
        pass = false;
    }
    if (comment.value === "" || comment.value.length >= 500) {
        errorMsg(comment, "Message is required");
    } else {
        removeErrorMsg(comment);
        pass = false;
    }
   
    if (pass === true ) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                subject: subject.value,
                comment: comment.value
            })
        };
        fetch(`/addQue`, options)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(data.message)
    })
    .catch(error => console.error(error));
    }

});
