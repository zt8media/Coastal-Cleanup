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

        let weatherCondition = '';
        if (fahrenheitTemp >= 70 && fahrenheitTemp <= 80) {
            weatherCondition = 'Is the perfect time to go to the beach!';
        } else if (data.weather[0].main === 'Rain') {
            weatherCondition = '    Is a bad time to go to the beach (it\'s raining)!';
        } else {
            weatherCondition = 'Is not the perfect weather to go to the beach.';
        }

        const weatherInfo = `
        <div class="answer-container">
            <h1 class="api-header-answer">The temperature is ${fahrenheitTemp}°F. ${weatherCondition}</h1>
        </div>
        `;

        apiAnswer.innerHTML = weatherInfo;
    })
    .catch((error) => {
        console.error("Error fetching weather data:", error);
    });
});
