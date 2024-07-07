document.getElementById('button').addEventListener('click', () => {
    const input = document.getElementById("input").value;
    const apiAnswer = document.getElementById("api-answer");
    const apiKey = '07c3803b080991a46d79e512d3b37785';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const celsiusTemp = data.main.temp;
        const fahrenheitTemp = Math.round((celsiusTemp * 9) / 5 + 32);
        
        // Get the weather icon code
        const weatherIconCode = data.weather[0].icon;
        const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

        let weatherCondition = '';
        if (fahrenheitTemp >= 70 && fahrenheitTemp <= 80) {
            weatherCondition = 'It\'s the perfect time to go to the beach!';
        } else if (data.weather[0].main === 'Rain') {
            weatherCondition = 'It\'s a bad time to go to the beach (it\'s raining)!';
        } else {
            weatherCondition = 'It\'s HOT wear sunscreen and protect yourself from the HEAT!';
        }

        const weatherInfo = `
        <div class="answer-container">
            <img src="${weatherIconUrl}" alt="Weather Icon" class="api-img-answer">
            <h3 class="api-header-answer">The temperature is ${fahrenheitTemp}°F.</h3>
            <p class="api-text-answer">${weatherCondition}</p>
        </div>
        `;

        apiAnswer.innerHTML = weatherInfo;
    })
    .catch((error) => {
        console.error("Error fetching weather data:", error);
    });
});

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
