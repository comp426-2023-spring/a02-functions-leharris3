#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

var argv = minimist(process.argv.slice(2));
// const timezone = moment_timezone.tz.guess()

const latitude = parseFloat(argv.n || -argv.s)
const longitude = parseFloat(-argv.w || argv.e)
const timezone = argv.z || "America/New_York"

var day = ""
const days = argv.d

if (days == 0) {
  day = "today."
} else if (days > 1) {
  day = "in " + days + " days."
} else {
  day = "tomorrow."
}

if ((argv.n && argv.s) || (argv.e && argv.w)) {
  process.exit(1) // Illegal Args
}

async function getWeather() { 
  let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&timezone=' + timezone);
  let data = await response.json()
  
  if (argv.j) {
    console.log(data)
    process.exit(0)
  }

  if (data.daily.precipitation_hours[days] > 0) {
    console.log("You might need your galoshes " + day)
  }
  else {
    console.log("You probably won't need your galoshes " + day);
  
  }

  return data;
}

if (argv.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    - j            Echo pretty JSON from open - meteo API and exit.in / bash`)
  process.exit(0)
}

getWeather() // Main Function Driver