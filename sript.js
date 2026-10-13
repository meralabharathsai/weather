
async function getWeather() {
    let city = document.getElementById("city").value.trim();
    let message = document.getElementById("message");

    if (city === "") {
        message.innerText = "Please enter a city name!";
        return;
    }

    message.innerText = "Loading weather...";

    try {
        // Find the city's location
        let geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name="
            + encodeURIComponent(city) + "&count=1";

        let geoResponse = await fetch(geoURL);
        let geoData = await geoResponse.json();

        if (!geoData.results) {
            message.innerText = "City not found!";
            return;
        }

        let place = geoData.results[0];
        let lat = place.latitude;
        let lon = place.longitude;

        // Get current weather
        let weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

        let response = await fetch(weatherURL);
        let data = await response.json();
        let weather = data.current;

        document.getElementById("cityName").innerText =
            place.name;

        document.getElementById("temperature").innerText =
            weather.temperature_2m + "°C";

        document.getElementById("humidity").innerText =
            weather.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            weather.wind_speed_10m + " km/h";

        document.getElementById("description").innerText =
            getDescription(weather.weather_code);

        message.innerText = "Weather updated successfully!";
    } catch (error) {
        message.innerText =
            "Unable to get weather. Check your internet connection.";
    }
}

function getDescription(code) {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
        return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code))
        return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather information available";
}
