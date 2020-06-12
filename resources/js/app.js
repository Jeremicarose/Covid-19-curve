const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".value2");
const new_cases_element = document.querySelector(" .newValue");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .newValue");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .newValue");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	deaths = [],
	formatedDates = [];

// GET USERS COUNTRY CODE
let country_code = geoplugin_countryCode();
let user_country;
country_list.forEach( country => {
	if( country.code == country_code ){
		user_country = country.name;
	}
});

/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */

function fetchData(user_country){
	country_name_element.innerHTML = "Loading...";

	cases_list = [], recovered_list =[], deaths_list = [], dates = [], formatedDates = [];
	
	fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	})
	.then( response => {
		return response.json();
	})
	.then( data => {
		dates = Object.keys(data);
		console.log(dates);
		dates.forEach( date => {
			let DATA = data[date];
			formatedDates.push(formateDate(date))
			app_data.push(DATA);
			cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
			recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
			deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));
		})
	})
	.then( () => {
		updateUI();
	})
	.catch( error => {
		alert(error);
	})
}

fetchData(user_country);

// UPDATE UI FUNCTION
function updateUI(){
	updateStats();
	axesLinearChart();
}

function updateStats(){
	let last_entry = app_data[app_data.length - 1];
	let before_last_entry = app_data[app_data.length - 2];
	country_name_element.innerHTML = last_entry.country_name;
	total_cases_element.innerHTML = last_entry.total_cases || 0;
	
	new_cases_element.innerHTML = `+${last_entry.new_cases || 0 }`;

	recovered_element.innerHTML = last_entry.total_recovered || 0;
	new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g, "")) - parseInt(before_last_entry.total_recovered.replace(/,/g, ""))}`;
	
	deaths_element.innerHTML = last_entry.total_deaths;
	new_deaths_element.innerHTML = `+${last_entry.new_deaths || 0}`;
}

// UPDATE CHART
let my_chart;
function axesLinearChart(){

	if(my_chart){
		my_chart.destroy();
	}

	my_chart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Cases',
				data: cases_list,
				fill : false,
				borderColor : '#FFF',
				backgroundColor: '#FFF',
				borderWidth : 1
			},{
				label: 'Recovered',
				data: recovered_list,
				fill : false,
				borderColor : '#00FF00',
				backgroundColor: '#00FF00',
				borderWidth : 1
			},{
				label: 'Deaths',
				data: deaths_list,
				fill : false,
				borderColor : '#FF0000',
				backgroundColor: '#FF0000',
				borderWidth : 1
			}],
			labels: formatedDates
		},
		options: {
			responsive : true,
			maintainAspectRatio : false
		}
	});
}
// format date
const monthsName = ['Jan','Feb','Mar','Apr','May','Jun','July','Agu','Sept','Oct','Nov','Dec'];
function formateDate(dateString){
	let date = new Date(dateString);
	return `${date.getDate()} ${monthsName [date.getMonth()]}`;
}