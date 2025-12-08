const API_KEY = "fa1e72ff893c6a4a5ed4077327e855b4";
const cityValueInput = document.getElementById("cityValueInput");
const weatherBtn = document.getElementById("weatherBtn");
const weatherInfo = document.getElementById("weatherInfo");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("weather")) {
    const data = JSON.parse(localStorage.getItem("weather"));
    displayWeather(data);
  }
});

async function fetchWeather(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    localStorage.setItem("weather", JSON.stringify(data));
    return data;
  } catch (error) {}
}

weatherBtn.onclick = async () => {
  const city = cityValueInput.value.trim();
  const lang = document.getElementById("langSelect").value;
  displayWeather(
    await fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`
    )
  );
};

const geoWeatherBtn = document.getElementById("geoWeatherBtn");

geoWeatherBtn.onclick = async () => {
  try {
    // 1. Получаем координаты
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const lang = document.getElementById("langSelect").value;
    const { latitude, longitude } = position.coords;
    displayWeather(
      await fetchWeather(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${lang}`
      )
    );
  } catch (err) {
    weatherInfo.innerHTML = `<p>Не удалось получить геолокацию</p>`;
  }
};

function displayWeather(data) {
  cityValueInput.value = "";
  weatherInfo.innerHTML = `
        <p style="text-transform: uppercase;">${data.name}</p>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }@2x.png" alt="iconWeatherDescription">
        <p><strong>Температура: </strong>${Math.round(
          data.main.temp
        )}°C</p><small><strong>Ощущается как: </strong>${Math.round(
    data.main.feels_like
  )}°C</small>
        <p><strong>Описание: </strong>${data.weather[0].description}</p>
        <p><strong>Влажность:</strong> ${data.main.humidity}%</p>
        <p><strong>Скорость ветра:</strong> ${data.wind.speed} m/s</p>`;
}