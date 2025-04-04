export function kelvtoFahr(kelvin) {
    const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
    return Math.round(fahrenheit);
}

export function titleCase(str) {
    if (!str) {
        return "";
    }

    return str.toLowerCase().split(' ').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}