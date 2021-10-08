export const fetchWeatherData = (weather_api_url) => {
  fetch(weather_api_url)
    .then((res) => res.json())
    .then((data) => {
      const current_weather = data.current.weather[0].main;
      const current_weather_description = data.current.weather[0].description;
      const current_temp = Math.round(data.current.temp);
      const current_humidity = data.current.humidity;
      const current_clouds = data.current.clouds;
      const current_wind_speed = data.current.wind_speed;
      const current_weather_icon = data.current.weather[0].icon;
      const current_timezone = data.timezone;
      const bg_img = document.querySelector('[data-bg-img="wrapper-bg"]');

      document.querySelector("#wrapper-name").innerHTML = current_timezone;
      document.querySelector("#wrapper-description").innerHTML =
        current_weather_description;
      document.querySelector("#wrapper-temp").innerHTML = current_temp;
      document.querySelector("#wrapper-humidity").innerHTML = current_humidity;
      document.querySelector("#wrapper-wind-speed").innerHTML =
        current_wind_speed;

      const bg_img_base_url = `https://mdbgo.io/ascensus/mdb-advanced/img/${current_weather.toLowerCase()}.gif`;
      bg_img.style.backgroundImage = `url('${bg_img_base_url}')`;

      // hourly temp
      for (let i = 0; i < data.hourly.length - 30; i++) {
        let img_src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png`;
        let hourly_temp = Math.round(data.hourly[i].temp);
        if (i === 0) {
          document.querySelector("#hourly-forecasts").innerHTML += `
          <div class="col-2 text-center d-flex flex-column text-center">
            <strong class="hour">Now</strong>
            <img class="align-self-center current-weather-img" src="${img_src}" alt="..." width=50 />
            <strong class="hourly-temp">${hourly_temp}&deg;</strong>
            </div>
            `;
        } else {
          let next_hour_in_date_obj = new Date(data.hourly[i].dt * 1000);
          let get_hour = next_hour_in_date_obj.getHours();
          document.querySelector("#hourly-forecasts").innerHTML += `
          <div class="col-2 text-center d-flex flex-column text-center">
            <strong class="hour">${get_hour}</strong>
            <img class="align-self-center current-weather-img" src="${img_src}" alt="..." width=50 />
            <strong class="hourly-temp">${hourly_temp}&deg;</strong>
            </div>
            `;
        }
      }

      // daily temp
      for (let j = 0; j < data.daily.length; j++) {
        let daily_temp = Math.round(data.daily[j].temp.day);
        let img_src = `http://openweathermap.org/img/wn/${data.daily[j].weather[0].icon}.png`;
        let next_day_in_date_obj = new Date(data.daily[j].dt * 1000);
        let get_day = next_day_in_date_obj.toLocaleString("en-us", {
          weekday: "long",
        });

        if (j === 0) {
          document.querySelector("#daily-forecasts").innerHTML += `
        <div class="col-3 d-flex flex-column text-center">
          <strong class="day">Today</strong>
          <img class="align-self-center daily-weather-img" src="${img_src}" alt="..." width=50 />
          <strong>${daily_temp}&deg;</strong>
        </div>`;
        }

        document.querySelector("#daily-forecasts").innerHTML += `
        <div class="col-3 d-flex flex-column text-center ">
          <strong class="day">${get_day.substring(0, 3)}</strong>
          <img class="align-self-center daily-weather-img" src="${img_src}" alt="..." width=50 />
          <strong>${daily_temp}&deg;</strong>
        </div>`;
      }
    })
    .catch((err) => console.log("ERR", err));
};
