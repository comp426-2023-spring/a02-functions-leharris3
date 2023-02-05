#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
// const timezone = moment_timezone.tz.guess()

const latitude = argv.n || argv.s
const longitude = argv.w || argv.e
const date = argv.d
const timezone = argv.z || "America/New_York"

var weather = []
async function getWeather() { 
    let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&timezone=' + timezone);
    let data = await response.json()
    const jsonString = JSON.parse(JSON.stringify(data))
    for (var i in jsonString)
        weather.push(jsonString[i])
    // console.log(data.daily.precipitation_hours[1])
    return data;
}

const days = argv.d 
if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

getWeather()


if (argv.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    - j            Echo pretty JSON from open - meteo API and exit.in / bash`)
}
else if (argv.j) {
    getWeather().then(data => console.log(data));
}