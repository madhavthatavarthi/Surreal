const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const R = require("ramda");

router.get("/createGenre", async (req, res) => {
    try {
        const queryText = "CREATE TABLE genre(genre varchar(50), genreId integer)"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addGenre", async (req, res) => {
    try {
        const { error } = validateGenre(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { movieId, genreId } = req.body;
        const queryText = "INSERT INTO genre(genre, genreId) VALUES($1,$2) RETURNING *"
        const response = await pool.query(queryText, [movieId, genreId])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.get("/createMovieGenre", async (req, res) => {
    try {
        const queryText = "CREATE TABLE movieGenre(movieId integer, genreId integer)"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addMovieGenre", async (req, res) => {
    try {
        const { error } = validateMovieGenre(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { genreId, movieId } = req.body;
        const queryText = "INSERT INTO movieGenre(genreId, movieId) VALUES($1,$2) RETURNING *"
        const response = await pool.query(queryText, [genreId, movieId])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }

})

function validateGenre(genre) {
    const schema = {
        genreId: Joi.number().required(),
        genre: Joi.string().max(30).required()
    };

    return Joi.validate(genre, schema);
}

function validateMovieGenre(movieGenre) {
    const schema = {
        genreId: Joi.number().required(),
        movieId: Joi.number().required(),
    };

    return Joi.validate(movieGenre, schema);
}

module.exports = router;