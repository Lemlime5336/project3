//making the application interactive and adding functionality
//the funciton takes no parameters
//async as await is required by getLonAndLat()
async function fetchWeather(){
    //declaring and initializing variables
    //search input variable with the search element
    let searchInput = document.getElementById("search").value;
    //the inital display none is replaced with block so fetched data will be seen
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    
    //api key variable to get weather data
    const apiKey = "APIKEY"

    //if statement for custom message for empty input with innerHTML property
    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>    
        `;
        return;
    }
    //define the two inner functions that help get weather data
    //used for 2 separate APIs from OpenWeather
    //1. get location latitude and longitude from a typed name
    //2. get current weather data based on the coordinates
    //they use the async keyword with await and fetch() to ensure valid information each time
    async function getLonAndLat(){
        //uses OpenWeather's GeoCoding API to return data based on our searchInput.
        ///search unout should be a valid string of a location's name
        //countryCode integer is needed for the API to work, in the US it is 1
        const countryCode = 1;
        //URL of the API endpoint which includes the countrycode along with apikey previously defined
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        //the response is returned from a server and may take time,
        //using async the program is able to keep runing ahead, but with await
        //it waits till teh data is fetched
        //this is stored in a response variable where if it is bad an error message is logged.
        const response = await fetch(geocodeURL);
        if (!response.ok){
            console.log("Bad response! ", response.status);
            return;
        }

        //retrieve geocode data in JSON using response object's .json() with await as its asynchronous
        const data = await response.json();
        //if the API call was unsuccesful, data array will be empty and error message will be printed
        if (data.length==0){
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML=`
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            //else JSON object will be stored and returned
            return data[0];
        }
    }

    //accept lon and lat parameters from the getLonAndLat() function
    //since it works with fetched data it will use async
    async function getWeatherData(lon, lat){
        //define and assign OpenWeatherAPI endpoint string to a variable
        const weatherURL=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        //response variable for object returned by fetch() with await keyword
        const response = await fetch(weatherURL);
        //print error message if problem exists
        if (!response.ok){
            console.log("Bad response! ", response.status);
            return;
        }

        //data object with JSON object for current weather data
        const data = await response.json();
        //flex so weather information is beside the icon
        weatherDataSection.style.display = "flex";
        //inner HTML to assign new HTML to the weather-data element
        //data.weather[0].icon for an image representation of the current weather.
        // data.name for the location/city.
        // data.main.temp for the temperature (measured in Kelvins by default, hence the rounding).
        // data.weather[0].description for a brief description of the current weather.
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `
    }

    //reset the value of the searchInput to an empty string, to clear after searches
    document.getElementById("search").value = "";
    //define geocodeData with information returned from getLatAndLong()
    const geocodeData = await getLonAndLat();
    //incoked getWeatherData() and passed .lon and .lat properties or geocodeData
    getWeatherData(geocodeData.lon, geocodeData.lat);

}

  
