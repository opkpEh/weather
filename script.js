const openweather_key= config.apiKeys.OPNEWEATHER_API_KEY;
const unsplash_key = config.apiKeys.UNSPLASH_API_KEY;
console.log(unsplash_key);

const weather_data= document.getElementsByClassName("weather-data");
const icon_element = document.querySelector(".icon img"); 
const detailsContainer = document.querySelector('.details');
const place_input= document.getElementById("place");
const form_element= document.querySelector("form");
const place_img= document.querySelector(".background_place_img img");

async function getWeatherData(cityValue){
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${openweather_key}&units=metric`);

        if(!response.ok){
            throw new Error("Network response Error");
        }

        const data = await response.json();
        console.log(data);

        const temperature= Math.round(data.main.temp);
        const description= data.weather[0].description;
        const icon= data.weather[0].icon;

        const details= [
            `Feels like: ${Math.round(data.main.feels_like)}°C`,
            `Humidity: ${data.main.humidity}%`,
            `Wind speed: ${data.wind.speed} m/s`
        ];

        icon_element.src = `http://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".temperature").textContent = `${temperature}°C`;
        document.querySelector(".description").textContent = description;

        detailsContainer.firstElementChild.textContent = details[0];
        detailsContainer.children[1].textContent = details[1];
        detailsContainer.lastElementChild.textContent = details[2];

    } catch(err) {
        console.error(err);
    }
}

function getImages(cityName) {
      fetch(`https://api.unsplash.com/photos/random?query=${cityName} city map image&client_id=${unsplash_key}`)
          .then((res) => res.json()) 
          .then((data) => {
              const imageUrl = data.urls.regular;
  
              document.body.style.backgroundImage = `url(${imageUrl})`;
              document.body.style.backgroundSize = 'cover';
              document.body.style.backgroundPosition = 'center';
              document.body.style.backgroundAttachment = 'fixed'; 
  
              const container = document.querySelector(".Container");
              if (container) {
                  container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  container.style.backdropFilter = 'blur(10px)';
              }
  
              const detailDivs = document.querySelectorAll(".details > div");
              detailDivs.forEach(div => {
                  div.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  div.style.backdropFilter = 'blur(5px)';
              });
          })
          .catch((error) => {
              console.error('Error fetching images:', error);
          });
  }
  


form_element.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = place_input.value;
    console.log(cityValue);
    getWeatherData(cityValue);
    getImages(cityValue);
});
