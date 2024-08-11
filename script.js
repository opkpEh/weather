const openweather_key = config.apiKeys.OPNEWEATHER_API_KEY;
const unsplash_key = config.apiKeys.UNSPLASH_API_KEY;

const container = document.querySelector('.container');
const initialContent = document.querySelector('.initial-content');
const weatherDataContainer = document.querySelector('.weather-data');
const iconElement = document.querySelector(".icon img");
const temperatureElement = document.querySelector(".temperature");
const descriptionElement = document.querySelector(".description");
const detailsContainer = document.querySelector('.details');
const placeInput = document.getElementById("place");
const formElement = document.querySelector(".search-form");

async function getWeatherData(cityValue) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${openweather_key}&units=metric`);
        if (!response.ok) {
            throw new Error("Network response Error");
        }
        const data = await response.json();
        console.log(data);
        
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const feelsLike = Math.round(data.main.feels_like);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        iconElement.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        temperatureElement.textContent = `${temperature}°C`;
        descriptionElement.textContent = description;

        detailsContainer.innerHTML = `
            <div class="detail-item">
                <i class="fas fa-thermometer-half"></i>
                <span>Feels like: ${feelsLike}°C</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-tint"></i>
                <span>Humidity: ${humidity}%</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-wind"></i>
                <span>Wind speed: ${windSpeed} m/s</span>
            </div>
        `;

        initialContent.style.display = 'none';
        weatherDataContainer.style.display = 'block';
        container.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    } catch (err) {
        console.error(err);
        weatherDataContainer.innerHTML = '<p class="error">Failed to fetch weather data. Please try again.</p>';
        weatherDataContainer.style.display = 'block';
        initialContent.style.display = 'none';
    }
}

function getImages(cityName) {
    fetch(`https://api.unsplash.com/photos/random?query=${cityName} city night&client_id=${unsplash_key}`)
        .then((res) => res.json())
        .then((data) => {
            const imageUrl = data.urls.regular;

            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';

            container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            container.style.backdropFilter = 'blur(10px)';

            const detailItems = document.querySelectorAll(".detail-item");
            detailItems.forEach(item => {
                item.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });
        })
        .catch((error) => {
            console.error('Error fetching images:', error);
            console.log("hmm");
        });
}

formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = placeInput.value;
    console.log(cityValue);
    getWeatherData(cityValue);
    getImages(cityValue);
});

// Initially show the initial content and hide the weather data container
initialContent.style.display = 'block';
weatherDataContainer.style.display = 'none';