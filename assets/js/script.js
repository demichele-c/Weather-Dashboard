const apiKey = '7c83f1fb12810c7022369a78b112fac3'; 
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
    console.log("Current Weather Data:", currentWeatherData);
    
    // Get today's date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    // Fetch 5-day forecast data
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastResponse.json();
    console.log("Forecast Data: ", forecastData);
    
    // Display current weather and forecast on the page
    currentWeatherDiv.innerHTML = `<div class="card-panel teal">
                                   <h2>${currentWeatherData.name}</h2>
                                   <h4>${formattedDate}</h4>
                                   <p>Temperature: ${currentWeatherData.main.temp}°C</p>
                                   <p>Humidity: ${currentWeatherData.main.humidity}%</p>
                                   <p>Wind Speed: ${currentWeatherData.wind.speed} m/s</p>
                                   <img src="https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png" />
                                   </div>`;

                                   forecastDiv.innerHTML = ''; // Clear previous forecast data
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
                                   
                                   fiveDays.forEach(day => {
                                       const formattedDate = getFormattedDate(day.dt_txt);
                                   
                                       if (!uniqueDays[formattedDate]) {
                                           forecastDiv.innerHTML += `<div class="card-panel teal">
                                                                       <p>${formattedDate}</p>
                                                                       <p>Temperature: ${day.main.temp}°C</p>
                                                                       <p>Humidity: ${day.main.humidity}%</p>
                                                                       <p>Wind Speed: ${day.wind.speed} m/s</p>
                                                                       <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                                                                     </div>`;
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
    searchHistoryDiv.innerHTML += `<div>${currentWeatherData.name}</div>`;

    // Clear the input field after search
    cityInput.value = '';
});