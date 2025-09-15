
const apiKey = 'b9c7a664871384d1b7c5198c3db4af2d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&appid=';

const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const weatherInfoDiv = document.getElementById('weather-info');


async function getWeather(city) {
    const url = `${apiUrl}${apiKey}&q=${city}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            
            if (response.status === 404) {
                throw new Error('Cidade não encontrada.');
            } else if (response.status === 401) {
                throw new Error('API Key inválida. Verifique sua chave.');
            } else {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoDiv.innerHTML = `<p style="color: red;">Erro: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather, sys } = data; 

    const weatherIcons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '☁️', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌦️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '💨', '50n': '💨'
    };

    const iconCode = weather[0].icon;
    const weatherIcon = weatherIcons[iconCode] || '❓'; 

    const country = sys.country;
    const temperature = Math.round(main.temp); 
    const feelsLike = Math.round(main.feels_like);
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = (main.wind?.speed || 0).toFixed(1); 

    weatherInfoDiv.innerHTML = `
        <h2>${name}, ${country}</h2>
        <p class="temperature">${temperature}°C</p>
        <p>Sensação térmica: ${feelsLike}°C</p>
        <p class="description">${description}</p>
        <p>Umidade: ${humidity}%</p>
        <p>Vento: ${windSpeed} m/s</p>
        <span class="icon">${weatherIcon}</span>
    `;
}

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim(); 
    if (city) { 
        getWeather(city);
    } else {
        weatherInfoDiv.innerHTML = '<p style="color: orange;">Por favor, digite o nome de uma cidade.</p>';
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); 
    }
});
