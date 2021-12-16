'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json')
const axios = require('axios');


const app = express();
app.use(cors());



app.get('/test', (req, res) => { res.status(200).send('Hello, I work and ready for lab!') });
app.get('/hello', (req, res) => { res.status(200).send('Added a hello page, Yay!') });
app.get('/weather', handleGetWeather);
app.get('/movies', handleGetMovies);



async function handleGetMovies(req, res) {
    const city_name = req.query.city_name;
    // let { searchQuery } = req.query;
    // const key = `movies-${searchQuery}`
    try {
        const moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${req.query.city_name.split(',')[0]}&page=1&include_adult=false`;
        // const moviesURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${searchQuery.split(',')[0]}&page=1&include_adult=false`;
        const movieAPI_Response = await axios.get(moviesURL);
        const cleanedMovieData = movieAPI_Response.data.results.map(movie => new Movie(movie));
        res.status(200).send(cleanedMovieData);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('server error')
    }

    if (cache[key] && (Date.now() - cache[key].timestamp < 86400000)
    ) {
        const movieArray = cache[key].results.data.results.map(movie => new Movie(movie));
    } else {
        try {
            let results = await axios.get(url);
            const movieArray = results.data.results.map(movie => new Movie(movie));
            cache[key] = {};
            cache[key].timestamp = Date.now();
            cache[key].results = results;
            res.status(200).send(movieArray);

        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}

const PORT = 3001;

class Forecast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = `a high of ${obj.max_temp}, a low of ${obj.min_temp}, with ${obj.weather.description}.`
    }
}

class Movie {
    constructor(obj) {
        this.title = obj.title;
        this.overview = obj.overview;
        this.avg_votes = obj.vote_averages;
        this.total_votes = obj.vote_count;
        this.image_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500${obj.poster_path}` : `https://www.reelviews.net/resources/img/default_poster.jpg`
        this.popularity = obj.popularity;
        this.released_on = obj.release_date;
    }
}

function handleGetWeather(req, res) {
    const weatherURL = `https://api.weatherbit.io/v2.0/current?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`
    const weatherURL_Forecast = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I`

    //code from when using json////////////////////////////////
    // const city_name = req.query.city_name;
    // const cityMatch = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());
    // if (cityMatch) {
    //     let weatherDescription = cityMatch.data.map(day => new Forecast(day));
    //     res.status(200).send(weatherDescription);
    // } else {
    //     res.status(400).send('sorry no data for entered city');
    // }

    ///code from using api call////////////////////////////////
    axios.get(weatherURL_Forecast)
        .then(results => {
            let weatherDescription = results.data.data.map(day => new Forecast(day));
            res.status(200).send(weatherDescription);
        })
        .catch(error => {
            console.error(error.message);
            res.status(500).send('sorry error server side');
        });
}







app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
