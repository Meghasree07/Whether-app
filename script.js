const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();

  if (city === '') {
    showError('Please enter a city name.');
    return;
  }

  fetchWeatherByCity(city);
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoordinates(lat, lon);
      },
      () => {
        showError('Unable to get your location.');
      }
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
});

function fetchWeatherByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      showError(error.message);
    });
}

function fetchWeatherByCoordinates(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Location not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      showError(error.message);
    });
}

function displayWeather(data) {
    document.getElementById('welcome-message').classList.add('hidden');

  errorMessage.classList.add('hidden');
  weatherResult.classList.remove('hidden');

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `🌡️ ${data.main.temp}°C`;
  description.textContent = `📝 ${data.weather[0].description}`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].main;
}

function showError(message) {
    document.getElementById('welcome-message').classList.add('hidden');

  weatherResult.classList.add('hidden');
  errorMessage.classList.remove('hidden');
  errorMessage.textContent = message;
}
