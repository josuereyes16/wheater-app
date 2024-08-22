document.addEventListener('DOMContentLoaded', function() {
    const searchImput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const weatherDisplay = document.getElementById('weatherDisplay');

    searchButton.addEventListener('click', function() {
        const city = searchInput.value;
        if (city.trim() !== ''){
            getWeather(city)
        } else {
            alert('Please enter a city')
        }
    })

    function getWeather(city) {
        const API_KEY = 'fddff08f21d58323cf28149d2d4e4947'
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data)
        })
        .catch(error => {
            console.log('Error city not found', error)
            weatherDisplay.innerHTML = 'City not found'
        })
    }

    function displayWeather(data) {
        const cityName = data.name
        const temperature = data.main.temp
        const weather = data.weather[0].description
        const humidity = data.main.humidity
        const icon = data.weather[0].icon

        weatherDisplay.innerHTML = `
            <h2>${cityName}</h2>
            <p>${temperature}°C</p>
            <p>${weather}</p>
            <p>Humidity:${humidity}%</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
        `
    }
})