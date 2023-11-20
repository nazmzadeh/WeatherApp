let apiKey = "09b94cd9a981decd33d53b235676ba0e"
let cityWeatherForm = document.querySelector("#search-form")
let input = document.querySelector("#search-form input")
let weatherImg = document.querySelector(".weather-img img")
let temperature = document.querySelector(".temperature-info .degree")
let description = document.querySelector(".temperature-info .description")
let city = document.querySelector(".location-info .city")
let country = document.querySelector(".location-info .country")
let date = document.querySelector(".date-info .date")
let time = document.querySelector(".date-info .time")
let timeStatus = document.querySelector(".date-info .time-status")
let title = document.querySelector(".weather-detail-box .title")
let windSpeed = document.querySelector(".speed span")
let windDirection = document.querySelector(".wind-direction span");
let humidity = document.querySelector(".humidity span");
let realFeel = document.querySelector(".real-feel span");
let pressure = document.querySelector(".pressure span");
let temperatureMax = document.querySelector(".temp-max span");
let temperatureMin = document.querySelector(".temp-min span");
let rise = document.querySelector(".rise span:last-child");
let set = document.querySelector(".set span:last-child");
let clouds = document.querySelector(".clouds span")


cityWeatherForm.addEventListener("submit", function (event) {
    event.preventDefault();
    fetchApi(input.value)

})

// Convert K to C
function convertTemp(temperature) {
    temperature = Math.round(parseInt(temperature) - 273.15)
    return temperature;
}

// Custom alert
function handleCustomAlert(alerttext, alertcolor) {
    let alertBoxOv = document.querySelector(".alert-box-overlay");
    let alertBox = document.querySelector(".alert-box");
    let alertText = document.querySelector(".alert-box p")
    alertText.innerText = alerttext;
    alertBox.style.backgroundColor = alertcolor;
    let closebutton = document.querySelector("button")
    alertBox.style.opacity = 1;
    alertBoxOv.style.display = "block";
    alertBoxOv.style.opacity = 0.6
    alertBoxOv.style.zIndex = 50
    setTimeout(() => {
        alertBox.style.opacity = 0,
            alertBoxOv.style.display = "none",
            alertBoxOv.style.opacity = 0,
            alertBoxOv.style.zIndex = 0;
    }, 2500);
    closebutton.onclick = () => { alertBox.style.opacity = 0, alertBoxOv.style.display = "none", alertBoxOv.style.opacity = 0, alertBoxOv.style.zIndex = 0; };
    alertBoxOv.onclick = () => { alertBox.style.opacity = 0, alertBoxOv.style.display = "none", alertBoxOv.style.opacity = 0, alertBoxOv.style.zIndex = 0; };
}

// Fetch data
function fetchApi(cityValue, defaultApiUrl) {
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather/?q=${cityValue}&appid=${apiKey}`;
    if (cityValue === "") {
        weatherApiUrl = defaultApiUrl
    }
    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                if (!response.status === 404) {
                    throw new Error("City not found :( Please check the spelling and try again")
                } else if (response.status === 401) {
                    throw new Error("Authentication failed.Please check your API key.")
                } else {
                    throw new Error("An error occured while fetching weather data.")
                }
            }

            return response.json()
        })
        .then(data => {
            console.log(data)
            handleLoader()
            temperature.textContent = convertTemp(data.main.temp);
            weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            description.textContent = data.weather[0].description;
            city.textContent = data.name;
            country.textContent = data.sys.country;
            date.textContent = convertTime(data.dt).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });
            time.textContent = convertTime(data.dt).toLocaleString("en", { weekday: "long", hour: "2-digit", minute: "2-digit" })
            windSpeed.textContent = data.wind.speed;
            windDirection.textContent = data.wind.deg;
            humidity.textContent = data.main.humidity;
            realFeel.textContent = convertTemp(data.main.feels_like);
            pressure.textContent = data.main.pressure;
            temperatureMax.textContent = convertTemp(data.main.temp_max);
            temperatureMin.textContent = convertTemp(data.main.temp_min);
            rise.textContent = convertTime(data.sys.sunrise).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
            set.textContent = convertTime(data.sys.sunset).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })
            clouds.textContent = data.clouds.all
            timeStatus.textContent = getTimeStatus(data.sys.sunrise, data.sys.sunset, data.dt)
            input.value = "";

        })
        .catch(() => {
            handleCustomAlert("Location not found..", "red")

        });

}

// Loader
function handleLoader() {
    document.querySelector(".loader-container").style.display = "none";

}

getDefaultLocation()

// Get default and current location 

function getDefaultLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError)
    }
    else {
        handleCustomAlert("Geolocation isn't allowed for this browser.", "red")
    }


}
async function showPosition(position) {
    let x = position.coords.latitude
    let y = position.coords.longitude
    let defaultApiUrl = `https://api.openweathermap.org/data/2.5/weather/?lat=${x}&lon=${y}&appid=${apiKey}`;
    await fetchApi("", defaultApiUrl)
    handleCustomAlert("Current location loaded.", "green")

}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            handleCustomAlert("User denied the request for Geolocation.", "gray")
            fetchApi("Baku", "")
            handleCustomAlert("Default location loaded.", "green")

            break;
        case error.POSITION_UNAVAILABLE:
            handleCustomAlert("Location information is unavailable.", "red")
            break;
        case error.TIMEOUT:
            handleCustomAlert("The request to get user location timed out.", "red")
            break;
        case error.UNKNOWN_ERROR:
            handleCustomAlert("An unknown error occurred.", "red")
            break;
    }
}

// Convert time
function convertTime(dayTime) {
    const timestamp = dayTime;
    const dateData = new Date(timestamp * 1000);
    return dateData;
}

// Get time status

function getTimeStatus(sunrise, sunset, currentTime) {
    return currentTime <= sunset && currentTime > sunrise ? "Day" : "Night"
}