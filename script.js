const apikey = "2f795439ea9c736f5408c423f9011008"

const weather_data= document.getElementsByClassName("weather-data");
const icon_element = document.querySelector(".icon img"); 
const detailsContainer = document.querySelector('.details');
const place_input= document.getElementById("place");
const form_element= document.querySelector("form");

async function getWeatherData(cityValue){
      try{
            const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`)

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
                  `Humiditiy: ${data.main.humidity}`,
                  `Wind speed: ${data.wind.speed}`
            ]
            
            icon_element.src =  `http://openweathermap.org/img/wn/${icon}.png`
            document.querySelector(".temperature").textContent= `${temperature}°C`;
            document.querySelector(".description").textContent= `${description}`;

            detailsContainer.firstElementChild.textContent= details[0];
            detailsContainer.children[1]= details[1];
            detailsContainer.lastElementChild.textContent= details[2];

      }

      catch(err)
      {

      }
}

form_element.addEventListener("submit", (event)=>{
      event.preventDefault();
      const cityValue= place_input.value;
      console.log(cityValue);
      getWeatherData(cityValue);
})