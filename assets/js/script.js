let searchInputEl = $("#search-input");
let searchButtonEl = $("#search-btn");
let cityNameEl = $("#cityname");
let cityHistoryEl = $("#city-history");

let indexs = [0, 7, 15, 23, 31, 39];

let cityDayEl = [
  $("#daycity"),
  $("#day1city"),
  $("#day2city"),
  $("#day3city"),
  $("#day4city"),
  $("#day5city")
].map(el => el[0]);

let tempEls = [
  $("#temp"), 
  $("#temp1"),
  $("#temp2"),
  $("#temp3"),
  $("#temp4"),
  $("#temp5")
];

let humidEls = [
  $("#humid"), 
  $("#humid1"),
  $("#humid2"),
  $("#humid3"),
  $("#humid4"),
  $("#humid5")
];

let windEls = [
  $("#wind"), 
  $("#wind1"),
  $("#wind2"),
  $("#wind3"),
  $("#wind4"),
  $("#wind5")
];

let weatherIconEls = [
  $("#weather-icon"),
  $("#weather-icon1"),
  $("#weather-icon2"),
  $("#weather-icon3"),
  $("#weather-icon4"),
  $("#weather-icon5")
];

let weatherDisplayEl = $("#displayweather");
let weatherIconEl = $("#weather-icon");

let apiKey = "550f01e8cf456a25abbd44843c13ad2a";
let cities = [];
let city_history = [];
let temps = [6];
let humids = [6];
let winds = [6];
let dates = [6];

function getLocation(city) {
  console.log("hello");
  let locationUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;

  $.getJSON(locationUrl, function (data) {
    console.log(data);
    console.log(data[0]);
    console.log(data[0].name);

    let lat = data[0].lat;
    let lon = data[0].lon;
    getWeather(lat, lon);
  });
}

function getWeather(lat, lon) {
  let weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  $.getJSON(weatherUrl, function (data) {
    console.log(data);
    displayWeather(data);
  });
}

function displayWeather(data) {
  console.log(data);

  let city = data.city.name;
  cityHistoryEl.text = ("");
  

  for (let i = 0; i < 6; i++) {
    temps[i] = data.list[indexs[i]].main.temp;
    humids[i] = data.list[indexs[i]].main.humidity;
    winds[i] = data.list[indexs[i]].wind.speed;
    dates[i] = new Date(data.list[indexs[i]].dt * 1000);
  }

  for (let i = 0; i < 5; i++) {
    cities.push(data.list[i]);
  }

  for (let j = 0; j < 6; j++) {
    tempEls[j].text("Temperature: " + (temps[j] * 9 / 5 + 32) + "°F");
    humidEls[j].text("Humidity: " + humids[j] + "%");
    windEls[j].text("Wind Speed: " + (winds[j] / 1.609) + "M");
    cityDayEl[j].text(city + " " + dates[j].toLocaleString());
    weatherIconEls[j].attr("src", `https://openweathermap.org/img/w/${data.list[j].weather[0].icon}.png`);
  }
}

$(document).ready(function() {
  // This event listener is triggered when the user clicks the search button. 
  // It retrieves the user's search input and calls the "getLocation" function to get the weather data
  searchButtonEl.on("click", function() {
    var searchInput = searchInputEl.val();
    getLocation(searchInput);

    // Add the user's search input to the "city_history" array and update the city history on the page
    if (city_history.length < 3) {
      console.log(city_history);
      city_history.unshift(searchInput);
      console.log(city_history);
    } else {
      city_history.length = city_history.length - 1;
      city_history.unshift(searchInput);
    }

    printCityHistory();
    updateCityHistory(city_history);
  });

  // Retrieve city history from local storage, or initialize empty array if not present
  var city_history = JSON.parse(localStorage.getItem("city_history")) || [];

  // This function prints the city history on the page, with each city as a button that can be clicked to retrieve the weather data
  function printCityHistory() {
    city_HistoryEl.html("");
    console.log($("#city_HistoryEl"));
    for (let i = 0; i < city_history.length; i++) {
      const list = $("<li></li>").attr("id", city_history[i]);
      $("#city_HistoryEl").append(list);
      const container = $("#" + city_history[i]);
      const button = $("<button></button>").attr("value", city_history[i]).text(city_history[i]);
      container.append(button);
      button.on("click", function(event) {
        const city = event.target.value;
        console.log(city);
        getLocation(city);
      });
    }
  }

  // This function updates the city history in local storage with the user's search input and calls the "printCityHistory" function to update the city history on the page
  function updateCityHistory(searchInput) {
    localStorage.setItem("city_history", JSON.stringify(searchInput));
    printCityHistory();
  }

  // Load city history on page load
  printCityHistory();
});
