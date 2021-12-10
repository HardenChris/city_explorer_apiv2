'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json')


const app = express();
app.use(cors());



app.get('/test', (req, res) => {res.status(200).send('Hello, I work and ready for lab!')});
app.get('/hello', (req, res) => {res.status(200).send('Added a hello page, Yay!')});
app.get('/weather', handleGetWeather);


const PORT = 3001;

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = `a high of ${obj.max_temp}, a low of ${obj.min_temp}, with ${obj.weather.description}` 
    }
}

function handleGetWeather (req, res) {
    const city_name = req.query.city_name;
    const cityMatch = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());
    if (cityMatch) {
        let weatherDescription = cityMatch.data.map(day => new Forecast(day));
        res.status(200).send(weatherDescription);
    } else {
        res.status(400).send('sorry no data for entered city');
    }
}






app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
