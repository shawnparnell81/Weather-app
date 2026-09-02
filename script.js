const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const unitToggle = document.getElementById("unit-toggle");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Snow",
  95: "Thunderstorm"
};

let currentUnit = "celsius";

async function getWeather(city) {
  const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + city;
  const geoResponse = await fetch(geoUrl);
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    cityName.textContent = "";
    temperature.textContent = "";
    description.textContent = "City not found. Try just the city name.";
    return;
  }

  const firstResult = geoData.results[0];
  const lat = firstResult.latitude;
  const lon = firstResult.longitude;

  const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&temperature_unit=" + currentUnit;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  const temp = weatherData.current_weather.temperature;
  const code = weatherData.current_weather.weathercode;
  const desc = weatherCodes[code];

  const symbol = currentUnit === "celsius" ? "°C" : "°F";

  cityName.textContent = firstResult.name;
  temperature.textContent = temp + symbol;
  description.textContent = desc;
}

searchBtn.addEventListener("click", function () {
  const city = cityInput.value;
  getWeather(city);
});

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const city = cityInput.value;
    getWeather(city);
  }
});

unitToggle.addEventListener("click", function () {
  if (currentUnit === "celsius") {
    currentUnit = "fahrenheit";
    unitToggle.textContent = "°C";
  } else {
    currentUnit = "celsius";
    unitToggle.textContent = "°F";
  }

  const city = cityInput.value;
  getWeather(city);
});