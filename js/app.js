
  //Method to covert Fahrenheit to celsius
  function fToC(fahrenheit){
    var fTemp = fahrenheit,
        fToCelsius = (fTemp - 32) * 5/9;

    return fToCelsius;
  }

  //------------------
  //Weather Report
  //------------------

  function getWeather(latitude, longitude){
    var apiKey = "4242fa6a0e37db953621cb2b28a9c8b1";
        lat = latitude,
        long = longitude,
        url = "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + "?extend=hourly&callback=?";

     // Hold our days of the week for reference later.
    var days = [
    	'Sunday',
  		'Monday',
  		'Tuesday',
  		'Wednesday',
  		'Thursday',
  		'Friday',
  		'Saturday'
  	];

    //Store hourly values for each day of the week
    var sun   = [],
        mon   = [],
        tue   = [],
        wed   = [],
        thur  = [],
        fri   = [],
        sat   = [];

    //To check if celsius button is toggled
    var isCelsiusChecked = $('#celsius:checked').length > 0;

    function hourlyReport(day, selector){
      for(var i = 0, l = day.length; i < l; i++) {
        $("." + selector + " " + "ul").append('<li>' + Math.round(day[i]) + '</li>');
      }
    }

    //get darksky api data
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (forecast) {
        console.log(forecast);

      //get skycons
      var skycons = new Skycons({"color": "#00040a"}),
          list = [
            "clear-day",
            "clear-night",
            "partly-cloudy-day",
            "cloudy",
            "rain",
            "sleet",
            "snow",
            "wind",
            "fog"
            ];
        console.log(skycons);
        for(var i = list.length; i--;){
          var weatherCondition = list[i],
              icons = document.getElementsByClassName(weatherCondition);

          for(e = icons.length; e--;){
            skycons.set(icons[e], weatherCondition);
          }
        }

        skycons.play();

        //looping through hourly forecasts
        for(var j = 0, k = forecast.hourly.data.length; j < k; j++){
          var hourly_date = new Date(forecast.hourly.data[j].time * 1000),
              hourly_day  = days[hourly_date.getDay()],
              hourly_temp = forecast.hourly.data[j].temperature;

          if(isCelsiusChecked){
            hourly_temp = fToC(hourly_temp);
            hourly_temp = Math.round(hourly_temp);
          }
          switch (hourly_day) {
            case 'Sunday':
              sun.push(hourly_temp);
              break;
            case 'Monday':
              mon.push(hourly_temp);
              break;
            case 'Tuesday':
              tue.push(hourly_temp);
              break;
            case 'Wednesday':
              wed.push(hourly_temp);
              break;
            case 'Thursday':
              thur.push(hourly_temp);
              break;
            case 'Firday':
              fri.push(hourly_temp);
              break;
            case 'Saturday':
              sat.push(hourly_temp);
              break;
            default: console.log(hourly_date.toLocaleTimeString());
              break;

          }
        }
        var currTemp = forecast.currently.temperature;
        var currSummary = forecast.currently.summary;
        var icon = forecast.currently.icon;
        $('#forecast').append(
          '<h2>' + currTemp + '</h2>'+ '<h2>'+ currSummary +'</h2>'

        );
        //Looping through forecasts
        for(var i = 1, l = forecast.daily.data.length; i < l; i++){
          var date = new Date(forecast.daily.data[i].time * 1000),
              day = days[date.getDay()],
              skicons = forecast.daily.data[i].skycons,
              time = forecast.daily.data[i].time,
              humidity = forecast.daily.data[i].humidity,
              summary = forecast.daily.data[i].summary,
              temp = Math.round(forecast.hourly.data[i].temperature),
              maxTemp = Math.round(forecast.hourly.data[i].temperatureMax);

          //if celsius
          if(isCelsiusChecked){
            temp = fToC(temp);
            maxTemp = fToC(maxTemp);
            temp = Math.round(temp);
            maxTemp = Math.round(maxTemp);
          }

        //Append

        $('#forecast').append(
          '<li class="shade-'+ skicons +'"><div class="weather-container"><div><div class="general-info"><div>' +
          // "<div class='graphic'><canvas class=" + skicons + "></canvas></div>" +
          "<div><b>Day</b>: " + date.toLocaleDateString() + "</div>"+
          "<div><b>Temperature</b>: " + temp + "</div>" +
          "<div><b>Max Temp.</b>: " + maxTemp + "</div>" +
          "<div><b>Humidity</b>: " + humidity + "</div>" +
          '<p class="summary">' + summary + '</p>' +
          '</div></div><div class="back card">'+
          '<div class="hourly' + ' ' + day + '"><b>24hr Forecast</b><ul class="list-reset"></ul></div></div></div></div></li>'

        );

          switch (day) {
            case 'Sunday':
              hourlyReport(sun, days[0]);
              break;
            case 'Monday':
              hourlyReport(mon, days[1]);
              break;
            case 'Tuesday':
              hourlyReport(tue, days[2]);
              break;
            case 'Wednesday':
              hourlyReport(wed, days[3]);
              break;
            case 'Thursday':
              hourlyReport(thur, days[4]);
              break;
            case 'Friday':
              hourlyReport(fri, days[5]);
              break;
            case 'Saturday':
              hourlyReport(sat, days[6]);
              break;
          }
        }
      }
    });
  }

  //------------------
  //Click event
  //------------------

  $('button').on('click', function(e){
    var city = $('#city-name').val(),
        lat = $('#latitude').val(),
        long = $('#longitude').val()

    if(lat && long !== '') {
		    e.preventDefault();



        $('.input-form').fadeOut(100, function(){
          getWeather(lat, long);

          $('.container').append('<h2 class="city">' + city +'</h2><ul class="myList" id="forecast"></ul>');
          $('.input-form').replaceWith("<h2>Weather Forecast</h2>");
        });
      }
  });

  //------------------
  //AutoComplete city and collect coordinates
  //------------------

  function googleApi() {
	var google_api = document.createElement('script'),
			api_key    = 'AIzaSyCdkwxUWi6y4BHLwaR2kzk6bBYqjGGfByw';

	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
  }

  //SearchBox method
  function initGoogleAPI(){
      var autocomplete = new google.maps.places.SearchBox(document.querySelector('#city-name'));

      autocomplete.addListener('places_changed', function(){
        var place = autocomplete.getPlaces()[0];
        document.querySelector("#latitude").value = place.geometry.location.lat();
        document.querySelector("#longitude").value = place.geometry.location.lng();
      });
  }

  googleApi();
