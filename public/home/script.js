

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

    // Show modal
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = "block";
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
    // switchToSignUpBtn.addEventListener('click', function() {
    //     loginForm.classList.add('hide');
    //     signUpForm.classList.remove('hide');
    // });

    // // Switch to Login form
    // switchToLoginBtn.addEventListener('click', function() {
    //     signUpForm.classList.add('hide');
    //     loginForm.classList.remove('hide');
    // });

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

    function loginValidation() {
        const username = login_username;
        const password = login_password;
        let passed = true;
        username.classList.remove('red-border');
        password.classList.remove('red-border');
        if (username.value === '' || !/^[a-zA-Z0-9]{4,}$/.test(username.value)) {
            username.classList.add('red-border');
            passed = false;
        }
        if (password.value === '' || !/^[a-zA-Z0-9]{4,}$/.test(password.value)) {
            password.classList.add('red-border');
            passed = false;
        }
        return passed;
    }

    function signValidation() {
        const email = signUp_email;
        const username = signUp_username;
        const password = signUp_password;
        let passed = true;
        email.classList.remove('red-border');
        username.classList.remove('red-border');
        password.classList.remove('red-border');
        if (email.value === '' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
            email.classList.add('red-border');
            passed = false;
        }
        if (username.value === '' || !/^[a-zA-Z0-9]{4,}$/.test(username.value)) {
            username.classList.add('red-border');
            passed = false;
        }
        if (password.value === '' || !/^[a-zA-Z0-9]{4,}$/.test(password.value)) {
            password.classList.add('red-border');
            passed = false;
        }
        return passed;
    }

    // Form submission event listeners
    document.getElementById('login-submit').addEventListener('click', (event) => {
        event.preventDefault();
        if (!loginValidation()) {
            return;
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
        fetch('/login', options)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                    return;
                }
                document.cookie = `token=${data.token}; path=/;`;
                window.location = data.admin ? '/admin' : '/home';
            })
            .catch(error => console.error(error));
    });

    document.getElementById('signUp-submit').addEventListener('click', (event) => {
        event.preventDefault();
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
        fetch('/signup', options)
            .then(response => response.json())
            .then(data => {
                if (response.status === 409) {
                    alert('Username already exists');
                    return;
                }
                if (response.status === 500) {
                    alert('Internal server error');
                    return;
                }
                window.location = data.admin ? '/admin' : '/home';
            })
            .catch(error => console.error(error));
    });

    // Form switch event listeners
    document.getElementById('signUp').addEventListener('click', () => {
        loginForm.classList.add('hide');
        signUpForm.classList.remove('hide');
    });

    document.getElementById('login').addEventListener('click', () => {
        signUpForm.classList.add('hide');
        loginForm.classList.remove('hide');
    });
});

