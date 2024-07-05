const login_form = document.getElementById('login-form');
const signup_form = document.getElementById('signUp-form');

const login_form_submit = document.getElementById('login-submit');
const signup_form_submit = document.getElementById('signUp-submit');

const signup = document.getElementById('signUp');
const login = document.getElementById('login');

const login_username = document.getElementById('login-username');
const signUp_username = document.getElementById('signUp-username');
const login_password = document.getElementById('login-password');
const signUp_password = document.getElementById('signUp-password');

const signUp_email = document.getElementById('signUp-email');

function loginValidation() {
    const username = login_username;
    const password = login_password;
    let passed = true;

    username.classList.remove('red-border');
    password.classList.remove('red-border');

    if (username === '' || !/^[a-zA-Z0-9]{4,}$/.test(username.value) || username.value.length > 20){
        username.classList.add('red-border');
        passed = false;
    }
    if (password === '' || !/^[a-zA-Z0-9]{4,}$/.test(password.value || password.value.length > 20)){
        password.classList.add('red-border');
        passed = false;
    }

    if (passed) {
        username.classList.remove('red-border');
        password.classList.remove('red-border');
        return true;
    }
    return false;
}

function signValidation() {
    const email = signUp_email;
    const username = signUp_username;
    const password = signUp_password;
    let passed = true;

    email.classList.remove('red-border');
    username.classList.remove('red-border');
    password.classList.remove('red-border');

    if (email === '' || !/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email.value)){
        email.classList.add('red-border');
        passed = false;
    }
    if (email.value.length > 255) {
        email.classList.add('red-border');
        passed = false;
        alert('Email must be less than 255 characters');
    }

    if (username === '' || !/^[a-zA-Z0-9]{4,}$/.test(username.value)){
        username.classList.add('red-border');
        passed = false;
    } else if (username.value.length > 20 && !password.value.length > 20) {
        username.classList.add('red-border');
        passed = false;
        alert('Username must be less than 20 characters');
    }

    if (password === '' || !/^[a-zA-Z0-9]{4,}$/.test(password.value)){
        password.classList.add('red-border');
        passed = false;
    } else if (password.value.length > 20 && !username.value.length > 20) {
        password.classList.add('red-border');
        passed = false;
        alert('Password must be less than 20 characters');
    }

    if (username.value.length > 20 && password.value.length > 20) {
        username.classList.add('red-border');
        password.classList.add('red-border');
        passed = false;
        alert('Username and password must be less than 20 characters');
    }

    if (passed) {
        email.classList.remove('red-border');
        username.classList.remove('red-border');
        password.classList.remove('red-border');
        return true;
    }
    return false;
}

login_form_submit.addEventListener('click', (event) => {

    if (!loginValidation()) {
        return
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: login_username.value,
            password: login_password.value
        })
    };

    fetch(`/login`, options)
        .then(response => {
            if (response.status === 401) {
                alert('Invalid username or password');
                return;
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                return;
            }

            if (data.message) {
                alert(data.message);
                return;
            }

            document.cookie = `token=${data.token}; path=/`;
            if (data.admin) {
                window.location = '/admin';
            }
            else {
                window.location = '/home';
            }
        })
        .catch(error => console.error(error));
});

signup_form_submit.addEventListener('click', (event) => {

    if (!signValidation()) {
        return;
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: signUp_email.value,
            username: signUp_username.value,
            password: signUp_password.value
        })
    };

    fetch(`/signup`, options)
        .then(response => {
            if (response.status === 409) {
                alert('Username already exists');
                return;
            }
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

            if (data.admin) {
                window.location = '/admin';
            }
            else {
                window.location = '/home';
            }
        })
        .catch(error => console.error(error));
});

signup.addEventListener('click', (event) => {
    console.log('signup clicked');
    login_form.classList.add('hide')
    signup_form.classList.remove('hide')
});

login.addEventListener('click', (event) => {
    signup_form.classList.add('hide')
    login_form.classList.remove('hide')
});

