
const apiKey = "53baf9806e1aca54e5a8bf1523b4b424";
const cityInput = document.querySelector("#cityInp");
const suggestions = document.querySelector("#suggestions");
const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#currTemp");
const feelsLike = document.querySelector("#feelsLike")
const condition = document.querySelector("#condition");
const pressure = document.querySelector("#pressure");
const wind = document.querySelector("#wind");
const sunriseTime = document.querySelector("#sunriseTime");
const sunsetTime = document.querySelector("#sunsetTime");
const humidity = document.querySelector("#humid");
const visibility = document.querySelector("#visibility");
const minTemp = document.querySelector("#minTemp");
const maxTemp = document.querySelector("#maxTemp");
const body = document.querySelector("body");
const today = document.querySelector("#today")
const weatherIcon = document.querySelector("#weatherIcon");


cityInput.addEventListener("input", async()=>{
    const query = cityInput.value.trim();

    if(query.length < 2){
        suggestions.style.display = "none";
        return;
    }

    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
    let response = await fetch(url);
    let cities = await response.json();

    suggestions.innerHTML = "";
    if(cities.length>0){
        suggestions.style.display = "block";

        cities.forEach(city=>{
            let li = document.createElement("li");
            li.textContent = `${city.name}, ${city.country}`;

            li.addEventListener("click", ()=>{
                cityInput.value = city.name;
                suggestions.style.display = "none";
                getWeather(city.name);
            });
            suggestions.appendChild(li);

        })
    }
    else{
        suggestions.style.display = "none";
    }

})



async function getWeather(city){

    try{
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        let res = await fetch(url);
        let data = await res.json();

        if(data.cod === 200){
            cityName.textContent = `📍${data.name}, ${data.sys.country}`;
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
            condition.textContent = data.weather[0].main;
            pressure.textContent = `${data.main.pressure} hPa`;
            wind.textContent = `${Math.round(data.wind.speed)} km/h`;

            const sunrise = data.sys.sunrise;
            const sunset = data.sys.sunset;

            const sunriseTimee = new Date(sunrise * 1000); 
            const sunsetTimee = new Date(sunset * 1000);

            sunriseTime.textContent = sunriseTimee.toLocaleTimeString();
            sunsetTime.textContent = sunsetTimee.toLocaleTimeString();
            humidity.textContent = `${data.main.humidity}%`;
            visibility.textContent = `${(data.visibility)/1000} km`;
            minTemp.textContent = data.weather[0].description;
            maxTemp.textContent = `${Math.round(data.main.temp_max)} °C`;

            
            
            getMap(data.coord.lat, data.coord.lon);
            toggleTheme(data.sys.sunrise, data.sys.sunset, data.weather[0].main);
            setWeatherIcon(data.weather[0].main);
            todaysDay();
            console.log(data.weather[0].main);
            
            cityInput.value = "";
        }
        else{
            alert("City not found");
        }

    }
    catch(err){
        alert("Error fetching weather data!")
    }

}



function toggleTheme(sunrise, sunset, condi){
    let currTime = Math.floor(Date.now()/1000);
    if(currTime>sunrise && currTime<sunset){
        body.style.background = 'linear-gradient(135deg, #a1c4fd, #c2e9fb)';
        if(condi==='Clear'){
          weatherIcon.src = "./Images/sun.png";
        }
        else if(condi==="Clouds"){
          weatherIcon.src = "./Images/suncl.png";
        }
        else if(condi==="Rain"){
          weatherIcon.src = "./Images/rain.png";
        }
        else if(condi==='Thunderstorm'){
          weatherIcon.src = "./Images/thunder.png";
        }
        else{
          weatherIcon.src = "./Images/suncl.png";
        }


    }
    else{
        body.style.background = 'linear-gradient(135deg, #1f1c2c, #928dab)';
        if(condi==='Clear'){
          weatherIcon.src = "./Images/moon.png";
        }
        else{
          weatherIcon.src = "./Images/moon-cloudy.png";
        }
    }
}


getWeather("kasdol");




function todaysDay(){
    const currDate = new Date();
    const day = currDate.getDay();

switch (day) {
    case 0:
        today.textContent = "Sunday";
        break;
    case 1:
        today.textContent = "Monday";
        break;
    case 2:
        today.textContent = "Tuesday";
        break;
    case 3:
        today.textContent = "Wednesday";
        break;
    case 4:
        today.textContent = "Thursday";
        break;
    case 5:
        today.textContent = "Friday";
        break;
    case 6:
        today.textContent = "Saturday";
        break;

    default:
        break;
}
}





//code of the map 


let map; 
let marker;    

function initializeMap() {
  if (map !== undefined) {
    map.remove(); 
  }

  map = L.map('map').setView([20.5937, 78.9629], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([20.5937, 78.9629]).addTo(map);
}


function getMap(lat, lon) {
  if (!map) {
    
    initializeMap();
  }

  map.flyTo([lat, lon], 10, { duration: 1.5 });
  marker.setLatLng([lat, lon]);
}


//code of the icon in left
function setWeatherIcon(main) {
  let icon = "";
  switch (main.toLowerCase()) {
    case "clear":
      icon = "☀️";
      break;
    case "clouds":
      icon = "☁️";
      break;
    case "rain":
      icon = "🌧️";
      break;
    case "thunderstorm":
      icon = "⛈️";
      break;
    case "snow":
      icon = "❄️";
      break;
    default:
      icon = "🌤️";
  }

}








