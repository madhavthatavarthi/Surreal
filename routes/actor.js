const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const R = require("ramda");

router.get("/createActor", async (req, res) => {
    try {
        const queryText = "CREATE TABLE actor(actorId integer, name varchar(50), gender varchar(5))"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addActor", async (req, res) => {
    try {
        const { error } = validateActor(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { actorId, name, gender } = req.body;
        const queryText = "INSERT INTO actor(actorId, name, gender) VALUES($1,$2, $3) RETURNING *"
        const response = await pool.query(queryText, [actorId, name, gender])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.get("/createCast", async (req, res) => {
    try {
        const queryText = "CREATE TABLE movieCast(actorId integer, movieId integer, role varchar(5))"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/addCast", async (req, res) => {
    try {
        const { error } = validateCast(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { actorId, movieId, role } = req.body;
        const queryText = "INSERT INTO movieCast(actorId, movieId, role) VALUES($1,$2, $3) RETURNING *"
        const response = await pool.query(queryText, [actorId, movieId, role])
        res.send(response.rows[0]);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

function validateActor(actor) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        actorId: Joi.number().required(),
        gender: Joi.string().max(5).required()
    };

    return Joi.validate(actor, schema);
}

function validateCast(cast) {
    const schema = {
        actorId: Joi.number().required(),
        movieId: Joi.number().required(),
        role: Joi.string().max(50).required()
    };

    return Joi.validate(cast, schema);
}

module.exports = router;