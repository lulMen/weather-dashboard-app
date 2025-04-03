const GEO_API_URL = "http://api.openweathermap.org/geo/1.0/direct";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "58f93690b92e10b5e82edf914afdbfcd";
// const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Function to get latitude and longitude from a city name
export async function getCoordinates(cityName) {
    try {
        const LIMIT = 5;
        const response = await fetch(`${GEO_API_URL}?q=${cityName}&limit=${LIMIT}&appid=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch coordinates");

        // const data = await response.json();
        // if (data.length === 0) throw new Error("City not found");

        // return { lat: data[0].lat, lon: data[0].lon };
        return await response.json();
    } catch (err) {
        console.error("Geocoding Error:", err.message);
        return null;
    }
}

// Function to get current weather data
export async function getCurrentWeather(lat, lon) {
    console.log(lat, lon);
    try {
        const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        return await response.json();
    } catch (err) {
        console.error("Weather API Error:", err.message);
        return null;
    }
}

// Function to get 5-day weather forecast
export async function getForecast(lat, lon) {
    try {
        const response = await fetch(`${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error("Failed to fetch forecast");

        return await response.json();
    } catch (err) {
        console.error("Forecast API Error:", err.message);
        return null;
    }
}