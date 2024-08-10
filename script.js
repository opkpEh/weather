const openweather_key= config.apiKeys.OPNEWEATHER_API_KEY;
const googleplaces_key = config.apiKeys.GOOGLE_PLACES_API_KEY;

const weather_data= document.getElementsByClassName("weather-data");
const icon_element = document.querySelector(".icon img"); 
const detailsContainer = document.querySelector('.details');
const place_input= document.getElementById("place");
const form_element= document.querySelector("form");

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

        // Update weather details on the page
        icon_element.src = `http://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".temperature").textContent = `${temperature}°C`;
        document.querySelector(".description").textContent = description;

        detailsContainer.firstElementChild.textContent = details[0];
        detailsContainer.children[1].textContent = details[1];
        detailsContainer.lastElementChild.textContent = details[2];

        // Fetch and display the place photo
        const placeId = await getPlaceId(cityValue);
        const photoReference = await getPhotoReference(placeId);
        const photoUrl = getPhotoUrl(photoReference);
        displayPhoto(photoUrl);

    } catch(err) {
        console.error(err);
    }
}

async function getPlaceId(placeName) {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${googleplaces_key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].place_id;
    } else {
        throw new Error('No place found with that name');
    }
}

async function getPhotoReference(placeId) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${googleplaces_key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result.photos && data.result.photos.length > 0) {
        return data.result.photos[0].photo_reference;
    } else {
        throw new Error('No photos found for this place');
    }
}

function getPhotoUrl(photoReference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${googleplaces_key}`;
}

function displayPhoto(photoUrl) {
    const imgElement = document.createElement('img');
    imgElement.src = photoUrl;
    imgElement.alt = "City Photo";
    document.querySelector(".icon").appendChild(imgElement); // Display photo in the icon div
}

form_element.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = place_input.value;
    console.log(cityValue);
    getWeatherData(cityValue);
});
