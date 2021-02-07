const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const R = require("ramda");


router.get("/createMovie", async (req, res) => {
    try {
        const queryText = "CREATE TABLE movie(movieId integer, title varchar(50), language varchar(50), runningTime integer)"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addMovie", async (req, res) => {
    try {
        const { error } = validateMovie(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { movieId, title, language, runningTime} = req.body;
        const queryText = "INSERT INTO movie(movieId ,title, language, runningTime) VALUES($1,$2,$3,$4) RETURNING *"
        const response = await pool.query(queryText, [movieId, title, language, runningTime])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.get('/getMovies', async (req, res) => {
    try {
        const queryText = "Select * from movie"
        const response = await pool.query(queryText)
        if (response && R.type(response.rows) === "Array" && !R.isEmplty(response.rows))
            res.send(response.rows);
        else
            res.status(404).send({ "error": { "code": 400, "message": 'Records not found' } })
    } catch(err) {
        console.log(err);
    }
})

router.get('/getMoviesByLanguage/:language', async (req, res) => {
    try {
        const language = req.params.language;
        if (language) {
            const queryText = "Select * from movie where language = $1"
            const response = await pool.query(queryText, [language])
            if (response && R.type(response.rows) === "Array")
                res.send(response.rows);
            else
                res.status(404).send({ "error": { "code": 400, "message": 'Records not found' } })
            }
    } catch(err) {
        console.log(err);
    }
})

router.get('/getMoviesByActor/:actor', async (req, res) => {
    try {
        const actor = req.params.actor;
        if (actor) {
            const queryText = "Select * from movie where movieId IN (Select movieId from moviecast where actorId IN (Select actorId from actor where name = $1))"
            const response = await pool.query(queryText, [actor])
            console.log("response<><>><><", response);
            if (response && R.type(response.rows) === "Array")
                res.send(response.rows);
            else
                res.status(404).send({ "error": { "code": 400, "message": 'Records not found' } })
            }
    } catch(err) {
        console.log(err);
    }
})

router.get('/getMoviesByGenre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre;
        if (genre) {
            const queryText = "Select * from movie where movieId IN (Select movieId from moviegenre where genreId IN (Select genreId from genre where genre = $1))"
            const response = await pool.query(queryText, [genre])
            console.log("response<><>><><", response);
            if (response && R.type(response.rows) === "Array")
                res.send(response.rows);
            else
                res.status(404).send({ "error": { "code": 400, "message": 'Records not found' } })
            }
    } catch(err) {
        console.log(err);
    }
})


function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        language: Joi.string().max(20).required(),
        movieId: Joi.number().required(),
        runningTime: Joi.number()
    };

    return Joi.validate(movie, schema);
}

function validateRating(rating) {
    const schema = {
        movieId: Joi.number().required(),
        rating: Joi.number().required()
    };

    return Joi.validate(rating, schema);
}

module.exports = router;