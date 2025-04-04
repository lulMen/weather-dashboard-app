import { kelvtoFahr, titleCase } from "./utility.mjs";

const ICON_URL = "https://openweathermap.org/img/wn/";

export function renderSearchResults(cities, selectCallBack) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (cities.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'searchResultsList';

    cities.forEach(location => {
        const listItem = document.createElement('li');
        listItem.className = 'searchResultItem';
        listItem.textContent = `${location.name}, ${location.state || ''}, ${location.country}`;
        listItem.dataset.lat = location.lat;
        listItem.dataset.lon = location.lon;

        listItem.addEventListener('click', () => {
            selectCallBack(location);
            container.innerHTML = '';
        });

        list.appendChild(listItem);
    });

    container.appendChild(list);
}

export function renderCurrentWeather(data) {
    if (!data) return;

    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    updateElement('cityName', data.name);
    const weatherIcon = document.getElementById('weatherIcon');
    if (weatherIcon) {
        weatherIcon.innerHTML = `
            <img src="${ICON_URL}${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        `;
    }
    updateElement('temperature', `Temp: ${kelvtoFahr(data.main.temp)}\u00B0`);
    updateElement('condition', `${titleCase(data.weather[0].description)}`);
    updateElement('humidity', `Humidity: ${data.main.humidity}%`);
    updateElement('windSpeed', `Wind Speed: ${data.wind.speed} mph`);
}

export function renderForecast(forecastData) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';

    if (!forecastData?.list?.length) return;

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const todayIndex = new Date().getDay();

    const forecastHTML = forecastData.list
        .slice(1, 6)
        .map((day, i) => {
            const forecastDay = dayNames[(todayIndex + i + 1) % 7];
            return `
                <div class="forecastCard">
                    <p>${forecastDay}</p>
                    <img src="${ICON_URL}${day.weather[0].icon}.png"
                    alt="${day.weather[0].description}">
                    <p>${kelvtoFahr(day.main.temp)}\u00B0</p>
                </div>
            `;
        })
        .join('');

    container.innerHTML = forecastHTML;
}

export function renderRecentSearches(cities, selectCallBack) {
    const list = document.getElementById('search-history');
    list.innerHTML = cities.map(cityObj => {
        if (typeof cityObj === 'string') {
            return `<li data-name="${cityObj}">${cityObj}</li>`
        }

        let displayText = cityObj.name;
        if (cityObj.state) displayText += `, ${cityObj.state}`;
        if (cityObj.country) displayText += `, ${cityObj.country}`;
        return `<li 
                    data-lat="${cityObj.lat}" 
                    data-lon="${cityObj.lon}" 
                    data-name="${cityObj.name}" 
                    data-state="${cityObj.state || ''}" 
                    data-country="${cityObj.country || ''}"
                >
                    ${displayText}
                </li>`;
    }).join('');

    const items = list.querySelectorAll('li');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const lat = item.getAttribute('data-lat');
            const lon = item.getAttribute('data-lon');
            const name = item.getAttribute('data-name');
            const state = item.getAttribute('data-state');
            const country = item.getAttribute('data-country');

            if (!lat || !lon || lat === "undefined" || lon === "undefined") {
                if (selectCallBack) {
                    selectCallBack({ name });
                }
            } else {
                if (selectCallBack) {
                    selectCallBack({
                        lat,
                        lon,
                        name,
                        state,
                        country
                    });
                }
            }
        });
    });
}