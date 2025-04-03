import { getCurrentWeather, getForecast, getCoordinates } from "./api.mjs";
import { renderCurrentWeather, renderForecast, renderSearchResults, renderRecentSearches } from "./ui.mjs";
import { saveCity, getRecentCities, clearRecentCities } from "./storage.mjs";

async function main() {
    setupEventHandlers();
    renderRecentSearches(getRecentCities(), fetchWeatherData);
}

function setupEventHandlers() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearHistory');

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    clearBtn.addEventListener('click', () => {
        clearRecentCities();
        renderRecentSearches(getRecentCities(), fetchWeatherData);
    });
}

async function handleSearch() {
    const city = document.getElementById('searchInput').value.trim();
    if (!city) return;

    try {
        const locations = await getCoordinates(city);
        if (!locations || locations.length === 0) {
            throw new Error('No matching cities found.');
        } else if (locations.length === 1) {
            await fetchWeatherData(locations[0]);
        } else {
            renderSearchResults(locations, fetchWeatherData);
            console.log(locations[0]);
        }
    } catch (err) {
        console.error('Search error', err);
        showError(err.message);
    }
}

async function fetchWeatherData(location) {
    try {
        const { lat, lon, name, state, country } = location;
        const currentWeather = await getCurrentWeather(lat, lon);
        const currentForecast = await getForecast(lat, lon);

        renderCurrentWeather(currentWeather);
        renderForecast(currentForecast);
        saveCity({ name, state, country, lat, lon });
        renderRecentSearches(getRecentCities(), fetchWeatherData);
    } catch (err) {
        console.error('Weather fetch error:', err);
        showError('Failed to retrieve weather data.');
    }
}

function showError(message) {
    let errorContainer = document.getElementById('error-message');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message';
        errorContainer.style.color = 'red';
        document.body.prepend(errorContainer);
    }
    errorContainer.textContent = message;
    setTimeout(() => {
        errorContainer.textContent = '';
    }, 5000);
}

main();