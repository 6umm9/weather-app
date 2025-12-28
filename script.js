// Ideally, this key should be secured, but for this client-side demo we'll keep it here.
// PLEASE REPLACE 'YOUR_API_KEY' WITH A VALID KEY FROM VISUAL CROSSING
const API_KEY = 'X7P9S8JAZUKEUQH958BBBYY2D';

async function getWeatherData(location) {
    const loadingDiv = document.getElementById('loading');
    const weatherInfoDiv = document.getElementById('weather-info');

    loadingDiv.classList.remove('hidden');
    weatherInfoDiv.classList.add('hidden');

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${API_KEY}&contentType=json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API Data:", data);

        const processedData = processWeatherData(data);
        console.log("Processed Data:", processedData);
        displayWeather(processedData);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Better error handling for the user could go here (e.g., a toast or error message in UI)
        weatherInfoDiv.innerHTML = `<p class="error">Failed to fetch weather data. Please try again.</p>`;
        weatherInfoDiv.classList.remove('hidden');
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function processWeatherData(data) {
    const current = data.currentConditions;
    return {
        location: data.resolvedAddress,
        description: data.description,
        temp: current.temp,
        conditions: current.conditions,
        humidity: current.humidity,
        windSpeed: current.windspeed,
        icon: current.icon
    };
}

function displayWeather(data) {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = `
        <div class="weather-card">
            <h2 class="location">${data.location}</h2>
            <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            
            <div class="current-weather">
                <div class="temp-container">
                    <span class="temp">${Math.round(data.temp)}°F</span>
                    <span class="condition">${data.conditions}</span>
                </div>
                <div class="icon-container">
                    <div class="weather-icon">${getWeatherIcon(data.icon)}</div>
                </div>
            </div>
            
            <p class="description">${data.description}</p>
            
            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Humidity</span>
                    <span class="value">${data.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="label">Wind Speed</span>
                    <span class="value">${data.windSpeed} mph</span>
                </div>
            </div>
        </div>
    `;
    weatherInfoDiv.classList.remove('hidden');
}

function getWeatherIcon(iconName) {
    // Simple emoji mapping for weather conditions
    if (iconName.includes('snow')) return '❄️';
    if (iconName.includes('rain')) return '🌧️';
    if (iconName.includes('fog')) return '🌫️';
    if (iconName.includes('wind')) return '💨';
    if (iconName.includes('partly-cloudy-day')) return '⛅';
    if (iconName.includes('partly-cloudy-night')) return '☁️';
    if (iconName.includes('cloudy')) return '☁️';
    if (iconName.includes('clear-day')) return '☀️';
    if (iconName.includes('clear-night')) return '🌙';
    return '🌡️';
}
// Form handling
const form = document.getElementById('location-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const locationInput = document.getElementById('location-input');
    const location = locationInput.value.trim();

    if (location) {
        getWeatherData(location);
    }
});
