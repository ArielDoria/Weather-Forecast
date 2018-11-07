/*
	JQuery for Weather Forecast
	Author: Ariel B. Doria
	Date: November 2018
*/

/*** Initializing the Dropdown in Select ****/
var dropdown = $('#provinces-dropdown');
var dropdown2 = $('#cities-dropdown');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Choose Province</option>');
dropdown.prop('selectedIndex', 0);

dropdown2.empty();

dropdown2.append('<option selected="true" disabled>Choose Municipality</option>');
dropdown2.prop('selectedIndex', 0);

/*** Select the content of the provinces and municipalities**/
const url = 'https://raw.githubusercontent.com/darklight721/philippines/master/provinces.json';
const url2 = 'https://raw.githubusercontent.com/darklight721/philippines/master/cities.json';

// Populate dropdown with list of provinces
$.getJSON(url, function (data) {
  	for (i in data) {
    dropdown.append($('<option></option>').attr('value', data[i].key).text(data[i].name));
	}
});

// Populate dropdown with list of municipalities based on the province selected
dropdown.change(function(){
	$.getJSON(url2, function (data) {
		dropdown2.empty();
		dropdown2.append('<option selected="true" disabled>Choose Municipality</option>');
		dropdown2.prop('selectedIndex', 0);
	  	for (i in data) {
	  		if(data[i].province==dropdown.val()){
	    		dropdown2.append($('<option></option>').attr('value', data[i].name).text(data[i].name));
		}}
	});
});

//change the graph when selected
dropdown2.change(function(){
		var api = 'https://api.openweathermap.org/data/2.5/forecast?q='+dropdown2.val()+',ph&mode=json&APPID=ea854b50261a6a6ef8fcbdd29db4ccab';
		$.getJSON(api, function (data) {
			//extract data from the JSON file 
			var city = data.city.name;
			var categories = new Array();
			var rainfall = new Array();
			var temperature = new Array();
			console.log(data);
			for (i=2;i<10;i++) {
				categories.push(data.list[i].dt_txt.split(" ")[1]);						//push the hours
				var value = (data.list[i].main.temp - 273.15);							//convert kelvin to degree celcius
				var temp = parseFloat(value).toFixed(2);									//format the temperature with two decimal places
				temperature.push(Number(temp));
				
				if(typeof (data.list[i].rain) !== 'undefined' ){				//check if rain value is undefined
					if(data.list[i].rain['3h']!== undefined){
						rainfall.push(data.list[i].rain['3h']);
					}else{
						rainfall.push(0);
					}
				}
				else{
					rainfall.push(0);
				}
			}
			asignTable(data.list[2]);
			asignGraph(city,categories,rainfall,temperature);	//call the function for graph

			var categories2 = new Array();
			var rainfall2 = new Array();
			var temperature2 = new Array();

			for (i=0;i<data.cnt;i++) {
				categories2.push(data.list[i].dt_txt.split(" ")[0]);						//push the hours
				var value = (data.list[i].main.temp - 273.15);							//convert kelvin to degree celcius
				var temp = parseFloat(value).toFixed(2);									//format the temperature with two decimal places
				temperature2.push(Number(temp));
				
				if(typeof (data.list[i].rain) !== 'undefined' ){				//check if rain value is undefined
					if(data.list[i].rain['3h']!== undefined){
						rainfall2.push(data.list[i].rain['3h']);
					}else{
						rainfall2.push(0);
					}
				}
				else{
					rainfall2.push(0);
				}
			}
			asign5DayGraph(city,categories2,rainfall2,temperature2);
		});

		function asignGraph(city,categories,rainfall,temp){
		$(function () {
		    var myChart = Highcharts.chart('container-graph', {
		    	
			    chart: {
			        zoomType: 'xy'
			    },
			    title: {
			        text: 'Weather and Forecasts in '+ city + ', ' + $("#provinces-dropdown option:selected").text()
			    },
			    subtitle: {
			        text: 'Source: openweathermap.org'
			    },
			    xAxis: [{
			        categories: categories,
			        labels: {
				            step: 1,
				        }
			    }],
			    yAxis: [{ // Primary yAxis
			        labels: {
			            format: '{value}°C',
			            style: {
			                color: Highcharts.getOptions().colors[1]
			            }
			        },
			        title: {
			            text: 'Temperature',
			            style: {
			                color: Highcharts.getOptions().colors[1]
			            }
			        }
			    }, { // Secondary yAxis
			        title: {
			            text: 'Rainfall',
			            style: {
			                color: Highcharts.getOptions().colors[0]
			            }
			        },
			        labels: {
			            format: '{value} mm',
			            style: {
			                color: Highcharts.getOptions().colors[0]
			            }
			        },
			        opposite: true
			    }],
			    tooltip: {
			        shared: true
			    },
			    legend: {
			        layout: 'vertical',
			        align: 'left',
			        x: 120,
			        verticalAlign: 'top',
			        y: 70,
			        floating: true,
			        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
			    },
			    series: [{
			        name: 'Rainfall',
			        type: 'column',
			        yAxis: 1,
			        data: rainfall,
			        tooltip: {
			            valueSuffix: ' mm'
			        }

			    }, {
			        name: 'Temperature',
			        type: 'spline',
			        data: temp,
			        tooltip: {
			            valueSuffix: '°C'
			        }
			    }]
			});
	});
}
		function asign5DayGraph(city,categories,rainfall,temp){
		$(function () {
		    var myChart = Highcharts.chart('5day-graph', {
		    	
			    chart: {
			        zoomType: 'xy'
			    },
			    title: {
			        text: 'Weather and Forecasts in '+ city + ', ' + $("#provinces-dropdown option:selected").text()
			    },
			    subtitle: {
			        text: 'Source: openweathermap.org'
			    },
			    xAxis: [{
			        categories: categories,
			        labels: {
				            step: 8,
				        }
			    }],
			    yAxis: [{ // Primary yAxis
			        labels: {
			            format: '{value}°C',
			            style: {
			                color: Highcharts.getOptions().colors[1]
			            }
			        },
			        title: {
			            text: 'Temperature',
			            style: {
			                color: Highcharts.getOptions().colors[1]
			            }
			        }
			    }, { // Secondary yAxis
			        title: {
			            text: 'Rainfall',
			            style: {
			                color: Highcharts.getOptions().colors[0]
			            }
			        },
			        labels: {
			            format: '{value} mm',
			            style: {
			                color: Highcharts.getOptions().colors[0]
			            }
			        },
			        opposite: true
			    }],
			    tooltip: {
			        shared: true
			    },
			    legend: {
			        layout: 'vertical',
			        align: 'left',
			        x: 400,
			        verticalAlign: 'top',
			        y: 60,
			        floating: true,
			        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255,255,255,0.25)'
			    },
			    series: [{
			        name: 'Rainfall',
			        type: 'column',
			        yAxis: 1,
			        data: rainfall,
			        tooltip: {
			            valueSuffix: ' mm'
			        }

			    }, {
			        name: 'Temperature',
			        type: 'spline',
			        data: temp,
			        tooltip: {
			            valueSuffix: '°C'
			        }
			    }]
			});
	});
}

	function asignTable(list){
		//assigning general weather
		var gen = $('#general-weather');
		gen.empty();
		var iconcode = list.weather[0].icon
		var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
		gen.append($('<img>').attr('src', iconurl))
		gen.append("<h4>   "+(list.main.temp-273.15).toFixed(2)+"°C</h4>");
		gen.append("<b>"+list.weather[0].description+"</b>");

		//assigning value in weather table
		var tab = $('#weather-table');
		tab.empty();
		var tr = $("<tbody>");
		tr.append("<tr><td>"+"Wind"+"</td><td>"+list.wind.speed+" m/sec</td></tr>");
		tr.append("<tr><td>"+"Cloudiness"+"</td><td>"+list.clouds.all+" %</td></tr>");
		tr.append("<tr><td>"+"Pressure"+"</td><td>"+list.main.pressure+" hPa</td></tr>");
		tr.append("<tr><td>"+"Humidity"+"</td><td>"+list.main.humidity+" %</td></tr>");
		tr.append("<tr><td>"+"Min Temperature"+"</td><td>"+(list.main.temp_min-273.15).toFixed(2)+"°C</td></tr>");
		tr.append("<tr><td>"+"Max Temperature"+"</td><td>"+(list.main.temp_max-273.15).toFixed(2)+"°C</td></tr>");

		tr.append("</tbody>")
		tab.append(tr)
	}

});

//toggling the card layout for 5-day forecast
$("#5day-tab").click(function () {
	 $('#5day-graph').show();
	 $('#container-graph').hide();
});

//toggling the card layout for main
$("#cont-tab").click(function () {
	 $('#5day-graph').hide();
	 $('#container-graph').show();
});
