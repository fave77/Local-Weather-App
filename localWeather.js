window.onload = getLocation;

//get current user location
function getLocation(){
    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(recordPosition, showError);
    else
        alert("Your browser doesn't support geolocation!");
}

//set the user coordinates
function recordPosition(position){
    var coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    getWeather(coordinates);
}

//alert in case of error!
function showError(error){
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

//get the weather info
function getWeather(coordinates){
    var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + coordinates.latitude
            + "&lon=" + coordinates.longitude;
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function(){
        updateInfo(JSON.parse(this.responseText));
    };
    request.send(null);
}

//display the result
function updateInfo(data){
    var div = document.getElementById("message");
    var body = document.querySelector("body");
    var button = document.createElement("button");
    button.setAttribute("id", "button");
    var info = {
        city: data["name"],
        country: data["sys"]["country"],
        temp: data["main"]["temp"],
        tempUnit: "C",
        windSpeed: data["wind"]["speed"],
        status: data["weather"][0]["main"],
        icon: data["weather"][0]["icon"],
        celsiusToFahrenheit: function(){
            this.temp = ((9/5)*this.temp + 32).toFixed(2);
            this.tempUnit = "F";
        },
        fahrenheitToCelsius: function(){
            this.temp = ((5/9)*(this.temp-32)).toFixed(2);
            this.tempUnit = "C";
        }
    }
    if(info.temp>0){
        body.setAttribute("style", "background: url('" + info.status
         + ".jpg') no-repeat center center fixed; -webkit-background-size: cover;"
         + "-moz-background-size: cover; -o-background-size: cover; background-size: cover;");
    }
    else{
        body.setAttribute("style", "{background: url('Snow.jpg')"
         + " no-repeat center center fixed; -webkit-background-size: cover;"
         + "-moz-background-size: cover; -o-background-size: cover; background-size: cover;");
    }

    div.innerHTML = info.city + ", " + info.country + "<br><figure><img src=" + info.icon + "><figcaption>"
                  + info.status + "</figcaption></figure>SW " + info.windSpeed + " knots<br><br>";
    button.innerHTML = info.temp + " <sup>0</sup>C";
    div.appendChild(button);
    button.onclick = function(){
        if(info.tempUnit === "C"){
            info.celsiusToFahrenheit();
            button.innerHTML = info.temp + " <sup>0</sup>F";
            div.appendChild(button);
        }
        else{
            info.fahrenheitToCelsius();
            button.innerHTML = info.temp + " <sup>0</sup>C";
            div.appendChild(button);
        }
    };
}