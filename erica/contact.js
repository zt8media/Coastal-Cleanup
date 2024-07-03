const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("emailAddress");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
function errorMsg(input, msg) {
    const formc = input.parentElement;
    formc.classList.add("error");
    const small = formc.querySelector("small");
message
    small.style.visibility = "visible";
    if (!small) {
        const small = document.createElement("small");
        small.innerText = msg;
        formc.appendChild(small);
    } else {
        small.innerText = msg;
    }
    input.classList.add("error-input");
};
function removeErrorMsg(input) {
    const form = input.parentElement;
    form.classList.remove("error");
    const small = form.querySelector("small");
    if (small === "") {
        small.remove();
    }
    input.classList.remove("error-input");

    e.preventDefault();
};
form.addEventListener("submit", function(e) {
    e.preventDefault();
    //let pass = true;
        if (firstName.value === "") {
         errorMsg(firstName, "First name is required");
    }
    else {
        removeErrorMsg(firstName);
        //pass = false
    }
        if (lastName.value === "") {
         errorMsg(lastName, "Last name is required");
    }
    else {
        removeErrorMsg(lastName);
    }
    e.preventDefault();
    if (emailAddress.value === "") {
        errorMsg(email, "Email is required");
    } else {
        removeErrorMsg(email);
    }
    e.preventDefault();
    if (subject.value === "") {
        errorMsg(subject, "Subject is required");
    } else {
        removeErrorMsg(subject);
    }
    e.preventDefault();
    if (message.value === "") {
        errorMsg(message, "Message is required");
    } else {
        removeErrorMsg(message);
    }
    //var if everything pass
    //if
});
