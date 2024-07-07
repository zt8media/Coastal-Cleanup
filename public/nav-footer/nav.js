

//NAV BAR START 


// Handles navbar responsiveness
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open'); // Toggle the side menu
    });
});



// Sets the active link based on the current page
document.addEventListener("DOMContentLoaded", function() {
    const currentLocation = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links .nav-item');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
});


//NAV BAR END 



// log in information 
document.addEventListener("DOMContentLoaded", function() {
    var loginBtn = document.getElementById('login-btn');
    var loginModal = document.getElementById('loginModal');
    var closeModalBtn = document.querySelector('.close-btn');
    var switchToSignUpBtn = document.getElementById('signUp');
    var switchToLoginBtn = document.getElementById('login');
    var loginForm = document.getElementById('login-form');
    var signUpForm = document.getElementById('signUp-form');
    var navLinks = document.querySelector('.nav-links');

    // Cookie object
    const cookie = {
        exists: function(name) {
            if (document.cookie.split(';').find(e => e.includes(name)))
                return true;
            else
                return false
        },
        check: function() {
            if (this.exists('token')) {
                loginBtn.innerHTML = 'Signout';
            }
            else {
                loginBtn.innerHTML = 'Login';
            }
        }
    }
    
    cookie.check();

    // Show modal
    loginBtn.addEventListener('click', function() {
        if (cookie.exists('token')) {
            fetch('/api/logout')
                .then(response => {
                    if (response.status === 200) {
                        cookie.check();                      
                    }
                    else {
                        alert('Error logging out');
                    }
                })
        }
        else {
            loginModal.style.display = "block";
            cookie.check();
        }
    });

    // Close modal
    closeModalBtn.addEventListener('click', function() {
        loginModal.style.display = "none";
    });

    // Close modal if click outside of modal content
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
        }
    });
    
    // // Switch to Sign Up form
    switchToSignUpBtn.addEventListener('click', function() {
        loginForm.classList.add('hide');
        signUpForm.classList.remove('hide');
    });

    // // Switch to Login form
    switchToLoginBtn.addEventListener('click', function() {
        signUpForm.classList.add('hide');
        loginForm.classList.remove('hide');
    });

    // Close the hamburger menu and show the login modal
    loginBtn.addEventListener('click', () => {
        navLinks.classList.remove('open'); // Close the side menu
        loginModal.style.display = "block";
    });
    
    // Form elements and validation functions
    const login_username = document.getElementById('login-username');
    const signUp_username = document.getElementById('signUp-username');
    const login_password = document.getElementById('login-password');
    const signUp_password = document.getElementById('signUp-password');
    const signUp_email = document.getElementById('signUp-email');

    loginForm.addEventListener('submit', (event) => event.preventDefault());
    signUpForm.addEventListener('submit', (event) => event.preventDefault());

    // Form validation functions
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

    // Form submission event listeners
    document.getElementById('login-submit').addEventListener('click', (event) => {
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
        fetch(`/api/login`, options)
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
                loginModal.style.display = "none";
                cookie.check();
            })
            .catch(error => console.error(error));
    });
    document.getElementById('signUp-submit').addEventListener('click', (event) => {
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
        fetch(`/api/signup`, options)
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
                loginModal.style.display = "none";
                cookie.check();
            })
            .catch(error => console.error(error));
    });
});

//END of form javascript