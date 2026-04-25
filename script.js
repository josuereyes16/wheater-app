/* =============================================
   Weather App — Script with i18n support
   by Josue Reyes
   ============================================= */

const translations = {
    es: {
        title: 'Weather App',
        subtitle: 'Descubre el clima en cualquier ciudad',
        placeholder: 'Ingresa una ciudad...',
        search: 'Buscar',
        humidity: 'Humedad',
        wind: 'Viento',
        feelsLike: 'Sensación',
        portfolio: 'Portafolio',
        errorIcon: '🌫️',
        errorMsg: 'Ciudad no encontrada. Intenta de nuevo.',
    },
    en: {
        title: 'Weather App',
        subtitle: 'Discover the weather in any city',
        placeholder: 'Enter a city...',
        search: 'Search',
        humidity: 'Humidity',
        wind: 'Wind',
        feelsLike: 'Feels Like',
        portfolio: 'Portfolio',
        errorIcon: '🌫️',
        errorMsg: 'City not found. Please try again.',
    }
};

let currentLang = 'es';
// Guardamos el último dato de la API para poder re-renderizar al cambiar idioma
let lastWeatherData = null;

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function setLang(lang) {
    currentLang = lang;
    document.getElementById('btn-es').classList.toggle('active', lang === 'es');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    const t = translations[lang];

    // Actualizar textos estáticos de la UI
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    document.documentElement.lang = lang;

    // Si ya hay una ciudad cargada, volver a buscarla con el nuevo idioma
    // para que la descripción del clima también cambie (viene de la API)
    if (lastWeatherData) {
        const cityName = lastWeatherData.name;
        getWeather(cityName, /* silencioso = */ true);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput    = document.getElementById('searchInput');
    const searchButton   = document.getElementById('searchButton');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const loadingSpinner = document.getElementById('loadingSpinner');

    searchButton.addEventListener('click', function () {
        const city = searchInput.value.trim();
        if (city !== '') {
            getWeather(city);
        } else {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') searchButton.click();
    });

    function showLoading() {
        weatherDisplay.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    // silent=true → no muestra spinner (para el re-render por cambio de idioma)
    window.getWeather = function getWeather(city, silent = false) {
        const API_KEY = 'fddff08f21d58323cf28149d2d4e4947';
        const lang    = currentLang === 'es' ? 'es' : 'en';
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;

        if (!silent) showLoading();

        fetch(API_URL)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => {
                hideLoading();
                lastWeatherData = data;   // ← guardamos para re-render futuro
                displayWeather(data);
            })
            .catch(() => {
                hideLoading();
                if (!silent) displayError();
            });
    }

    function displayWeather(data) {
        const t           = translations[currentLang];
        const cityName    = data.name;
        const country     = data.sys.country;
        const temperature = Math.round(data.main.temp);
        const feelsLike   = Math.round(data.main.feels_like);
        const description = capitalize(data.weather[0].description);
        const humidity    = data.main.humidity;
        const windSpeed   = Math.round(data.wind.speed * 3.6);
        const icon        = data.weather[0].icon;

        weatherDisplay.innerHTML = `
            <div class="weather-top">
                <div class="weather-top-left">
                    <span class="city-name">${cityName}, ${country}</span>
                    <span class="temp-main">${temperature}°</span>
                    <span class="weather-desc">${description}</span>
                </div>
                <img
                    class="weather-icon-large"
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="${description}"
                >
            </div>
            <div class="stats-row">
                <div class="stat-card">
                    <span class="stat-icon">💧</span>
                    <div>
                        <div class="stat-label">${t.humidity}</div>
                        <div class="stat-value">${humidity}%</div>
                    </div>
                </div>
                <div class="stat-card">
                    <span class="stat-icon">💨</span>
                    <div>
                        <div class="stat-label">${t.wind}</div>
                        <div class="stat-value">${windSpeed} km/h</div>
                    </div>
                </div>
                <div class="stat-card" style="grid-column: span 2;">
                    <span class="stat-icon">🌡️</span>
                    <div>
                        <div class="stat-label">${t.feelsLike}</div>
                        <div class="stat-value">${feelsLike}°C</div>
                    </div>
                </div>
            </div>
        `;

        weatherDisplay.classList.remove('hidden');
    }

    function displayError() {
        const t = translations[currentLang];
        weatherDisplay.innerHTML = `
            <div class="error-msg">
                <span class="error-icon">${t.errorIcon}</span>
                <p>${t.errorMsg}</p>
            </div>
        `;
        weatherDisplay.classList.remove('hidden');
    }
});