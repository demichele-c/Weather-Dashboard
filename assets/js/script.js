const apiKey = '7c83f1fb12810c7022369a78b112fac3'; // Replace 'YOUR_API_KEY' with your actual API key
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    
    // Fetch current weather data
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const currentWeatherData = await currentWeatherResponse.json();

    // Fetch 5-day forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();

    // Display current weather and forecast on the page
    currentWeatherDiv.innerHTML = `<div class="card2">
                                   <h2>${currentWeatherData.name}</h2>
                                   <p>Temperature: ${currentWeatherData.main.temp}°C</p>
                                   <p>Humidity: ${currentWeatherData.main.humidity}%</p>
                                   <p>Wind Speed: ${currentWeatherData.wind.speed} m/s</p>
                                   </div>`;

    forecastDiv.innerHTML = ''; // Clear previous forecast data
    const uniqueDays = {};
    forecastData.list.forEach(day => {
        const date = day.dt_txt.split(' ')[0]; // Extracting just the date from the datetime string
        if (!uniqueDays[date]) {
            forecastDiv.innerHTML += `<div class="card">
                                        <p>Date: ${day.dt_txt}</p>
                                        <p>Temperature: ${day.main.temp}°C</p>
                                        <p>Humidity: ${day.main.humidity}%</p>
                                        <p>Wind Speed: ${day.wind.speed} m/s</p>
                                      </div>`;
            uniqueDays[date] = true;
        }
    });

    // Save the weather information in local storage
    const weatherInfo = {
        city: currentWeatherData.name,
        temperature: currentWeatherData.main.temp,
        humidity: currentWeatherData.main.humidity,
        windSpeed: currentWeatherData.wind.speed,
        forecast: forecastData.list
    };
    localStorage.setItem('weatherInfo', JSON.stringify(weatherInfo));

    // Display search history
    searchHistoryDiv.innerHTML += `<div>${currentWeatherData.name}</div>`;

    // Clear the input field after search
    cityInput.value = '';
});