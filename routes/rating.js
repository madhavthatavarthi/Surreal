const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const R = require("ramda");

router.get("/createRating", async (req, res) => {
    try {
        const queryText = "CREATE TABLE rating(rating integer, movieId integer)"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addRating", async (req, res) => {
    try {
        const { error } = validateRating(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rating, movieId} = req.body;
        const queryText = "INSERT INTO rating(rating, movieId) VALUES($1,$2) RETURNING *"
        const response = await pool.query(queryText, [rating, movieId])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.put("/updateRating", async (req, res) => {
    try {
        const { error } = validateUpdateRating(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { rating, movieTitle} = req.body;
        const queryText = "UPDATE rating set rating = $1 where movieId IN(select movieId from movie where title = $2) RETURNING *"
        const response = await pool.query(queryText, [rating, movieTitle])
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

function validateRating(rating) {
    const schema = {
        movieId: Joi.number().required(),
        rating: Joi.number().required()
    };

    return Joi.validate(rating, schema);
}

function validateUpdateRating(rating) {
    const schema = {
        rating: Joi.number().required(),
        movieTitle: Joi.string().required()
    };

    return Joi.validate(rating, schema);
}

module.exports = router;