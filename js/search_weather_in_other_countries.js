const search_other_country_weather = document.querySelector(
  "#search_other_country_weather"
);

search_other_country_weather.addEventListener("submit", (e) => {
  e.preventDefault();
  const input_elm = document.querySelector(`#${e.target.id}>input`);
  let BASE_URL = new window.URL(
    "https://api.openweathermap.org/data/2.5/weather?appid=416e9783200627c77363e74e6091c3b8"
  );

  BASE_URL.searchParams.set("q", input_elm.value);
  input_elm.value = "";

  console.log("BASE_URL", BASE_URL.href);

  fetch(BASE_URL.href)
    .then((res) => res.json())
    .then((res) => {
      if (res.cod !== 200) {
        document.querySelector(".container.py-5").insertAdjacentHTML(
          "afterbegin",
          `<div class="alert alert-dismissible fade show alert-warning mb-n4" role="alert" data-mdb-color="warning">
          <i class="fas fa-exclamation-triangle me-3"></i> ${res.message.toUpperCase()}.
        <button type="button" class="btn-close" data-mdb-dismiss="alert" aria-label="Close"></button>
      </div>`
        );
        return;
      }
      const latitude = res.coord.lat;
      const longitude = res.coord.lon;
      const api_units_options = `metric`;
      const api_exclude_options = `minutely,alerts`;
      const api_key = `416e9783200627c77363e74e6091c3b8`;

      let NEW_BASE_URL = new window.URL(
        "https://api.openweathermap.org/data/2.5/onecall"
      );
      NEW_BASE_URL.searchParams.set("lat", latitude);
      NEW_BASE_URL.searchParams.set("lon", longitude);
      NEW_BASE_URL.searchParams.set("units", api_units_options);
      NEW_BASE_URL.searchParams.set("exclude", api_exclude_options);
      NEW_BASE_URL.searchParams.set("appid", api_key);

      fetchSearchedWeatherData(NEW_BASE_URL.href);
    });
});

const fetchSearchedWeatherData = (weather_api_url) => {
  fetch(weather_api_url)
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);

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

      document.querySelector("#hourly-forecasts").innerHTML = "";

      const bg_img_base_url = `https://mdbgo.io/ascensus/mdb-advanced/img/${current_weather.toLowerCase()}.gif`;
      bg_img.style.backgroundImage = `url('${bg_img_base_url}')`;

      // hourly temp
      for (let i = 0; i < data.hourly.length - 30; i++) {
        let img_src = `https://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png`;
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
      document.querySelector("#daily-forecasts").innerHTML = "";
      for (let j = 0; j < data.daily.length; j++) {
        let daily_temp = Math.round(data.daily[j].temp.day);
        let img_src = `https://openweathermap.org/img/wn/${data.daily[j].weather[0].icon}.png`;
        let next_day_in_date_obj = new Date(data.daily[j].dt * 1000);
        let get_day = next_day_in_date_obj.toLocaleString("en-us", {
          weekday: "long",
        });

        if (j !== 0) {
          document.querySelector("#daily-forecasts").innerHTML += `
        <div class="col-3 d-flex flex-column text-center">
          <strong class="day">${get_day.substring(0, 3)}</strong>
          <img class="align-self-center daily-weather-img" src="${img_src}" alt="..." width=50 />
          <strong>${daily_temp}&deg;</strong>
        </div>`;
        }
      }
    })
    .catch((err) => console.log("ERR", err));
};
