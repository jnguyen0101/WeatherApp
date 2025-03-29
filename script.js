/*
	Tell us about your project below!👇

  I used a weather API because I've always wanted to make my own simple
  weather app but I didn't really understand how to do it or what an API even was.
  I chose this specific weather API because the data given back was simple and straightforward.
  I interacted with the API using the HTTP client Axios. After getting the city
  name input by the user, I appended it to the link and picked out the data that I
  was interested in in the response.
  The project asks the user for a city name, and, if valid/found, shows the user
  the city's current temperature, condition, and wind speed. I also included a unit
  conversion toggler, which takes the data and converts it back and forth from C/kmh
  to F/mph.
  If I were to keep coding this project, I might add a 3-day weather forecast or maybe
  just make it more visually appealing by adding animations or changing the background
  of the app based on the current condition.

*/

// default temperature unit
let currentUnit = "C";
document.getElementById("celsius").classList.add("selected");

/**
 * Gets the weather in the city inputted by the user and displays
 * it on the screen.
 */
function getWeather() {
    // get user input city
    let city = document.getElementById("city").value;
    city = capitalizeWords(city);
    document.getElementById("error").style.display = "none";

    // send a message if user did not input a city
    if (!city.trim()) {
        setWeather("Please enter a valid city name.", "", "", "", "");
        return;
    }

    // get weather data of city
    axios
        .get("https://goweather.herokuapp.com/weather/" + city)
        .then((response) => {
            let temperature = response.data.temperature;
            let condition = response.data.description;
            let wind = response.data.wind;

            // check if data fetched is valid
            if (temperature && condition && wind) {
                // convert to F/mph if toggled (edge case)
                if (currentUnit === "F") {
                    temperature = parseFloat(temperature);
                    wind = parseFloat(wind);
                    temperature = Math.round((temperature * 9) / 5 + 32) + " °F";
                    wind = Math.round(wind * 0.621371) + " mp/h";
                }

                // display onto screen
                document.getElementById("weather-info").style.display = "block";
                setWeather(
                    "",
                    city,
                    "Temperature: " + temperature,
                    "Condition: " + condition,
                    "Wind: " + wind
                );
            } else {
                setWeather("No city found.", "", "", "", "");
            }
        })
        .catch((error) => {
            document.getElementById("error").style.display = "block";
            setWeather("", "", "", "", "");
            console.log(
                "Error: Failed to Fetch Data\nWe encountered an issue while retrieving the requested information. [Error Code: " +
                error.code +
                "]."
            );
        });
}

/**
 * Sets the HTML code to display the weather data.
 * @param info Any info needed to be displayed to user
 * @param city The current city
 * @param temp The current temperature of the city
 * @param cond The current condition of the city
 * @param wind The current wind speed of the city
 */
function setWeather(info, city, temp, cond, wind) {
    document.getElementById("info").innerHTML = info;
    document.getElementById("city-name").innerHTML = city;
    document.getElementById("temperature").innerHTML = temp;
    document.getElementById("condition").innerHTML = cond;
    document.getElementById("wind").innerHTML = wind;
}

/**
 * Changes the units between F/mph and C/kmh.
 * @param unit The unit to be changed to
 */
function toggleUnits(unit) {
    if (currentUnit === unit) {
        return;
    }
    currentUnit = unit;

    // update selected button's style
    document.getElementById("fahrenheit").classList.remove("selected");
    document.getElementById("celsius").classList.remove("selected");
    document
        .getElementById(unit === "F" ? "fahrenheit" : "celsius")
        .classList.add("selected");

    // get temperature and wind values and convert to floats
    let newTemp = parseFloat(
        document.getElementById("temperature").innerText.replace(/[^\d.-]/g, "")
    );
    let newWind = parseFloat(
        document.getElementById("wind").innerText.replace(/[^\d.-]/g, "")
    );

    // unit conversion
    if (unit === "F") {
        newTemp = (newTemp * 9) / 5 + 32;
        newWind = newWind * 0.621371;
    } else {
        newTemp = ((newTemp - 32) * 5) / 9;
        newWind = newWind / 0.621371;
    }

    // update displayed values
    document.getElementById("temperature").innerText =
        "Temperature: " + Math.round(newTemp) + (unit === "F" ? " °F" : " °C");
    document.getElementById("wind").innerText =
        "Wind: " + Math.round(newWind) + (unit === "F" ? " mp/h" : " km/h");
}

/**
 * Capitalizes the first letter in each word.
 * @param str The string to be capitalized
 * @return the capitalized string
 */
function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}