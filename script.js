function getWeather() {
  const apiKey = "cce83ada19e1bd482a8caa610849afd9";
  const city = $("#cityInput").val();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch current weather
  $.getJSON(currentWeatherUrl, function (data) {
    if (data.cod !== 200) {
      alert("City not found");
      return;
    }

    // Weather icon
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    $("#weather-icon").attr("src", iconUrl).show();

    // Temperature
    $("#temp-div").html(`<p>${data.main.temp}°C</p>`);

    // Extra info
    $("#weather-info").html(`
      <p>${data.name}, ${data.sys.country}</p>
      <p>${data.weather[0].description}</p>
      <p>💨 ${data.wind.speed} m/s wind</p>
    `);

    // 🌈 Dynamic background
    changeBackground(data.weather[0].main);
  }).fail(function (err) {
    console.error("Error fetching weather data:", err);
  });

  // Fetch forecast
  $.getJSON(forecastUrl, function (data) {
    if (data.cod !== "200") {
      console.error("Forecast error:", data.message);
      return;
    }

    const hourlyForecastDiv = $("#hourly-forecast");
    hourlyForecastDiv.empty(); // clear old forecast

    for (let i = 0; i < 6; i++) {
      const item = data.list[i];
      const time = new Date(item.dt * 1000).getHours();
      const temp = Math.round(item.main.temp);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const forecastItem = `
        <div class="hourly-item">
          <p>${time}:00</p>
          <img src="${iconUrl}" alt="icon" />
          <p>${temp}°C</p>
        </div>
      `;
      hourlyForecastDiv.append(forecastItem);
    }
  }).fail(function (err) {
    console.error("Error fetching forecast data:", err);
  });
}

// 🎨 Background changer (still vanilla since it’s short)
function changeBackground(weather) {
  const body = $("body");
  switch (weather.toLowerCase()) {
    case "clear":
      body.css("background", "linear-gradient(to bottom, #f9d423, #ff4e50)");
      break;
    case "clouds":
      body.css("background", "linear-gradient(to bottom, #d7d2cc, #304352)");
      break;
    case "rain":
    case "drizzle":
      body.css("background", "linear-gradient(to bottom, #74ebd5, #ACB6E5)");
      break;
    case "thunderstorm":
      body.css("background", "linear-gradient(to bottom, #232526, #414345)");
      break;
    case "snow":
      body.css("background", "linear-gradient(to bottom, #E0EAFC, #CFDEF3)");
      break;
    case "mist":
    case "fog":
      body.css("background", "linear-gradient(to bottom, #606c88, #3f4c6b)");
      break;
    default:
      body.css("background", "linear-gradient(to bottom, #87ceeb, #4682b4)");
  }
}
