const STORAGE_KEY = 'recentCities';

export function saveCity(cityObj) {
    if (!cityObj || !cityObj.name) return;

    let cities = getRecentCities();
    cities = cities.filter(item =>
        item.name.toLowerCase() !== cityObj.name.toLowerCase() ||
        (item.state || '').toLowerCase() !== (cityObj.state || '').toLowerCase()
    );
    cities.unshift(cityObj);

    if (cities.length > 5) {
        cities = cities.slice(0, 5);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export function getRecentCities() {
    const storedCities = localStorage.getItem(STORAGE_KEY);
    return storedCities ? JSON.parse(storedCities) : [];
}

export function clearRecentCities() {
    localStorage.removeItem(STORAGE_KEY);
}