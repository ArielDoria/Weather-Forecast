/*
	JQuery for Weather Forecast
	Author: Ariel B. Doria
	Date: November 2018
*/

/***** GEt the current Location *****/


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
const url = 'https://raw.githubusercontent.com/ArielDoria/Weather-Forecast/master/jsondata/municipalities.json';
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

dropdown2.change(function(location){
	selected_location(dropdown2.val(),$("#provinces-dropdown option:selected").text());
});
//change the graph when selected
function selected_location(city,province){
		var api = 'https://api.openweathermap.org/data/2.5/forecast?q='+city+',ph&mode=json&APPID=ea854b50261a6a6ef8fcbdd29db4ccab';
		$("#index-banner").hide('slow');			//remove the starter and footer template
		//$("#foot-info").hide('slow')
		$.getJSON(api, function (data) {
			//extract data from the JSON file 
			var city = data.city.name;
			var categories = new Array();
			var rainfall = new Array();
			var temperature = new Array();
			var mintemp = new Array();
			var maxtemp = new Array();
			//console.log(data);
			var date = " ";
			for (i=2;i<10;i++) {
				if(date!= data.list[i].dt_txt.split(" ")[0]){							//push the hours
					categories.push([data.list[i].dt_txt.split(" ")[0],convert_time(data.list[i].dt_txt.split(" ")[1])]);
					date=data.list[i].dt_txt.split(" ")[0];
				}
				else{categories.push(convert_time(data.list[i].dt_txt.split(" ")[1]))}
				var value = (data.list[i].main.temp - 273.15);							//convert kelvin to degree celcius
				var temp = parseFloat(value).toFixed(2);									//format the temperature with two decimal places
				temperature.push(Number(temp));
				
				var value_min = (data.list[i].main.temp_min - 273.15);					//getthe minimum and maximum temperature for the day
				var temp2 = parseFloat(value_min).toFixed(2);	
				mintemp.push(Number(temp2));
				
				var value_max = (data.list[i].main.temp_max - 273.15);
				var temp3 = parseFloat(value_max).toFixed(2);	
				maxtemp.push(Number(temp3));

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

			addCardLayout();
			asignTable(data.list[2]);
			asignGraph(city,province,categories,rainfall,temperature,mintemp,maxtemp);	//call the function for graph

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
			asign5DayGraph(city,province,categories2,rainfall2,temperature2);
			asignTitle(city);
			asignhourly(city,data);

			//make sure that the page of main is displayed
			$('#container-graph').show();
			$('#5day-graph').hide();
			$('#hourly-table').hide();
			$('#Main_Label').css("color",'#1565c0');
		});
}
		
		function convert_time(timeString){
			var H = +timeString.substr(0, 2);
			var h = H % 12 || 12;
			var ampm = (H < 12 || H === 24) ? "AM" : "PM";
			return timeString = h + timeString.substr(2, 3) + ampm;
		}
		function asignGraph(city,province,categories,rainfall,temp,min,max){
		$(function () {
		    var myChart = Highcharts.chart('container-graph', {
		    	
			    chart: {
			        zoomType: 'xy'
			    },
			    title: {
			        text: 'Weather and Forecasts in '+ city + ', ' + province
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
			                color: '#0d47a1'
			            }
			        },
			        labels: {
			            format: '{value} mm',
			            style: {
			                color: '#0d47a1'
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
			        x: 110,
			        verticalAlign: 'top',
			        y: 40,
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
			        name: 'Maximum Temperature',
			        type: 'spline',
			        data: max,
			        tooltip: {
			            valueSuffix: '°C'
			        }
			    },
			    {
			        name: 'Minimum Temperature',
			        type: 'spline',
			        data: min,
			        tooltip: {
			            valueSuffix: '°C'
			        }
			    },
			    {
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
		function asign5DayGraph(city,province,categories,rainfall,temp){
		$(function () {
		    var myChart = Highcharts.chart('5day-graph', {
		    	
			    chart: {
			        zoomType: 'xy'
			    },
			    title: {
			        text: 'Weather and Forecasts in '+ city + ', ' + province
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
			                color: '#0d47a1'
			            }
			        },
			        labels: {
			            format: '{value} mm',
			            style: {
			                color: '#0d47a1'
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
	
	function addCardLayout(){

		var g = $('#cardlayout');
		g.empty();		//empty for the new data
		g.append("<div class='card-tabs'><ul class='tabs tabs-fixed-width'><li class='tab' id='cont-tab' ><a href='#container-graph' style='color:#1565c0' id='Main_Label'>Main</a></li><li class='tab' id='5day-tab' ><a href='#5day-graph' style='color:#1565c0' id='5_Label'>5-Day Forecast</a></li><li class='tab' id='hourly-tab' ><a href='#hourly-table' style='color:#1565c0' id='hourly_Label'>Hourly Forecast</a></li></ul></div>");
		g.append("<div class='card-content'><div id='container-graph' >  </div><!-- for the main graph --><div id='5day-graph' style='display:none'>  </div><div id='hourly-table' style='display:none'><div id='title-daily'></div><div id='tab-hour'><table id='hourly'></table></div></div></div>");
		
		//toggling the card layout for 5-day forecast
		$("#5day-tab").click(function () {
			 $('#5day-graph').show();
			 $('#container-graph').hide();
			 $('#hourly-table').hide();
			 $('#5_Label').css("color",'black');
			 $('#Main_Label').css("color",'#1565c0');
			 $('#hourly_Label').css("color",'#1565c0');
		});

		//toggling the card layout for main
		$("#cont-tab").click(function () {
			 $('#5day-graph').hide();
			 $('#container-graph').show();
			 $('#hourly-table').hide();
			 $('#5_Label').css("color",'#1565c0');
			 $('#Main_Label').css("color",'black');
			 $('#hourly_Label').css("color",'#1565c0');
		});

		//toggling for card layout for hourly forecast
		$("#hourly-tab").click(function () {
			 $('#5day-graph').hide();
			 $('#container-graph').hide();
			 $('#hourly-table').show();
			 $('#5_Label').css("color",'#1565c0');
			 $('#Main_Label').css("color",'#1565c0');
			 $('#hourly_Label').css("color",'black');
		});
	}

	function asignTable(list){
		//assigning general weather
		var gen = $('#general-weather');
		gen.empty();
		var iconcode = list.weather[0].icon
		var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
		gen.append($("<img id='weather-icon'>").attr('src', iconurl))
		gen.append("<h4>   "+(list.main.temp-273.15).toFixed(2)+"°C</h4>");
		gen.append("<b>"+list.weather[0].description+"</b>");

		//assigning value in weather table
		var tab = $('#weather-table');
		tab.empty();
		var tr = $("<tbody>");
		tr.append("<tr style='background-color:#bbdefb'><td>"+"Wind"+"</td><td>"+list.wind.speed+" m/sec</td></tr>");
		tr.append("<tr><td>"+"Cloudiness"+"</td><td>"+list.clouds.all+" %</td></tr>");
		tr.append("<tr style='background-color:#bbdefb'><td>"+"Pressure"+"</td><td>"+list.main.pressure+" hPa</td></tr>");
		tr.append("<tr><td>"+"Humidity"+"</td><td>"+list.main.humidity+" %</td></tr>");
		tr.append("<tr style='background-color:#bbdefb'><td>"+"Min Temperature"+"</td><td>"+(list.main.temp_min-273.15).toFixed(2)+" °C</td></tr>");
		tr.append("<tr><td>"+"Max Temperature"+"</td><td>"+(list.main.temp_max-273.15).toFixed(2)+" °C</td></tr>");

		tr.append("</tbody>")
		tab.append(tr)
		$('#weather-icon').width('10vh');		//change the size of the icon for the weather
	}


		function asignTitle(city){	//assign a title for hourly data
			var div1 = $('#title-daily');
			div1.empty();
			var samp = $("<h5 class='center bold'>Weather Forecast in "+city+","+$("#provinces-dropdown option:selected").text()+"</h5>");
			div1.append(samp);
		}

		function asignhourly(city,data){
			const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];		//constants for the value
			const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"]
			var hour = $('#hourly');
			hour.empty();

			var tr = $("<tbody>");
			var date = new Date(data.list[0].dt_txt);
			tr.append("<tr style='background-color: #bbdefb'><td><b>"+dayNames[date.getDay()]+", "+monthNames[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear()+"</b></td><td></td></tr>");
			
			for (i=0;i<data.cnt;i++) {
				
				if(!(date.getMonth() == (new Date(data.list[i].dt_txt)).getMonth() && date.getDate() == (new Date(data.list[i].dt_txt)).getDate())){
					date = new Date(data.list[i].dt_txt);						//update the value of date
					tr.append("<tr style='background-color: #bbdefb'><td><b>"+dayNames[date.getDay()]+", "+monthNames[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear()+"</b></td><td></td></tr>");
				}

				var iconcode = data.list[i].weather[0].icon 					//get the icon for the weather
				var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
				//iconurl.css("height",5)
				tr.append("<tr class='table-row' ><td >"+data.list[i].dt_txt.split(" ")[1]+"  <img style='height:30px' src="+iconurl +"></td><td>"+(data.list[i].main.temp-273.15).toFixed(2)+" °C / "+data.list[i].weather[0].description+"</td></tr>");
				//tr.append("<tr class='table-row' ><td>"+data.list[i].dt_txt.split(" ")[1]+"</td><td>"+(data.list[i].main.temp-273.15).toFixed(2)+" °C / "+data.list[i].weather[0].description+"</td></tr>");
			}
			tr.append("</tbody>");
			hour.append(tr);
			$("#tab-hour").css("height","60vh")
			$("#tab-hour").css("overflow-y"," scroll");

		}
