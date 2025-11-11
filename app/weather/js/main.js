const apiKey = "7a2aed067014465cbee14230251506";

function showLoading(show) {
  const loading = document.getElementById("loading");
  const btn = document.getElementById("checkBtn");
  const result = document.getElementById("weatherResult");
  
  loading.style.display = show ? "block" : "none";
  btn.disabled = show;
  btn.textContent = show ? "Checking..." : "Check Weather";
  
  if (show) {
    result.style.display = "none";
  }
}

function showError(message) {
  alert(message);
  showLoading(false);
}

function checkWeather() {
  showLoading(true);
  
  if (!navigator.geolocation) {
    showError("Browser does not support geolocation");
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    position => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      getWeatherData(coords);
    },
    error => {
      showError("Unable to access location. Please enable GPS and try again.");
    }
  );
}

async function getWeatherData(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&lang=en`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      showError("Unable to get weather data");
      return;
    }
    
    displayWeather(data);
  } catch (error) {
    showError("Connection error. Please check your network and try again.");
    console.error(error);
  }
}

function displayWeather(data) {
  const iconUrl = "https:" + data.current.condition.icon;
  
  document.getElementById("location").innerHTML = `📍 ${data.location.name}, ${data.location.country}`;
  document.getElementById("condition").textContent = data.current.condition.text;
  document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;
  document.getElementById("wind").textContent = `${data.current.wind_kph} km/h`;
  document.getElementById("feelsLike").textContent = `${data.current.feelslike_c}°C`;
  
  const iconEl = document.getElementById("weatherIcon");
  iconEl.src = iconUrl;
  iconEl.alt = data.current.condition.text;
  iconEl.style.display = "block";
  
  document.getElementById("weatherResult").style.display = "block";
  showLoading(false);
}