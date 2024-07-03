const form = document.getElementById('login-form');
const username = document.getElementById('username');
const password = document.getElementById('password');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    };

    fetch(`/login`, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('token', data.token);
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