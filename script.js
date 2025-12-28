// Ideally, this key should be secured, but for this client-side demo we'll keep it here.
// PLEASE REPLACE 'YOUR_API_KEY' WITH A VALID KEY FROM VISUAL CROSSING
const API_KEY = 'YOUR_API_KEY';

async function getWeatherData(location) {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.classList.remove('hidden');

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${API_KEY}&contentType=json`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API Data:", data);

        const processedData = processWeatherData(data);
        console.log("Processed Data:", processedData);

    } catch (error) {
        console.error("Error fetching weather data:", error);
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function processWeatherData(data) {
    // Extracting only current conditions and resolved address for now
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
