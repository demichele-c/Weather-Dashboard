// define api key and other variables.
const apiKey = '7c83f1fb12810c7022369a78b112fac3'; 
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');

// preventDefault on submit button
searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    
    // Fetch current weather data
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const currentWeatherData = await currentWeatherResponse.json();
    console.log("Current Weather Data:", currentWeatherData);
    
    // Get today's date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

 // Function to convert Celsius to Fahrenheit and round to one decimal point
function convertCelsiusToFahrenheitAndRound(celsius) {
    const fahrenheit = (celsius * 9/5) + 32;
    return fahrenheit.toFixed(1);
}
    
// Display the temperature in Fahrenheit rounded to one decimal point
const temperatureFahrenheit = convertCelsiusToFahrenheitAndRound(currentWeatherData.main.temp);

// dynamically create card for current weather.    
currentWeatherDiv.innerHTML = `<div class="card-panel grey darken-1">
                                   <h2>${currentWeatherData.name}</h2>
                                   <h4>${formattedDate}</h4>
                                   <p><strong>Temperature:</strong> ${temperatureFahrenheit}°F</p>
                                   <p><strong>Humidity:</strong> ${currentWeatherData.main.humidity}%</p>
                                   <p><strong>Wind Speed:</strong> ${currentWeatherData.wind.speed} m/s</p>
                                   <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png" />
                                 </div>`;
   
                                 // Fetch 5-day forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();
    console.log("Forecast Data: ", forecastData);
    
    // Clear previous forecast data
    forecastDiv.innerHTML = '';
    
    const uniqueDays = {};
    const fiveDays = [];
    
    // Function to get the formatted date
    function getFormattedDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    
 // Filter the forecast dataset for 3 PM entries
forecastData.list.forEach(day => {
    let timeStamp = day.dt_txt.split(' ');
    
    if (timeStamp[1] === '15:00:00') {
        fiveDays.push(day);
    }
});

// Clear previous forecast data before adding new forecast
const forecastContainer = document.getElementById('forecast-container');
forecastContainer.innerHTML = '';

fiveDays.forEach(day => {
    const formattedDate = getFormattedDate(day.dt_txt);

// Display the forecast temperature in Fahrenheit rounded to one decimal point
const temperatureFahrenheitForecast = convertCelsiusToFahrenheitAndRound(day.main.temp);

    
    if (!uniqueDays[formattedDate]) {
        const cardHtml = `<div class="card-panel z-depth-4 text-align center grey darken-1">
                              <p><strong>${formattedDate}</p></strong>
                              <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                              <p>Temperature: ${temperatureFahrenheitForecast}°F</p>
                              <p>Humidity: ${day.main.humidity}%</p>
                              <p>Wind Speed: ${day.wind.speed} m/s</p>
                          </div>`;
        forecastContainer.innerHTML += cardHtml;
        uniqueDays[formattedDate] = true;
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
searchHistoryDiv.innerHTML += `<div  class="card-panel grey darken-1">${currentWeatherData.name}</div>`;

// Clear the input field after search
cityInput.value = '';
})