const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const R = require('ramda');

router.get("/createUser", async (req, res) => {
    try {
        const queryText = "CREATE TABLE userinfo(name varchar(50), mobileNo varchar(10), email_id varchar(50), password varchar(50))"
        const response = await pool.query(queryText)
        res.send(response);
    } catch(err) {
        res.status(500).send(err.stack)
    }
})

router.post("/", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const { name, mobileNumber, emailId, password} = req.body;
        const queryText = "Select * from userinfo where email_Id = $1 and password = $2"
            const response = await pool.query(queryText, [emailId, password])
            console.log("ressss", response);
            if (response && response.rows && R.type(response.rows) === "Array" && !R.isEmpty(response.rows)) {
               return { "error": { "code": 400, "message": 'EmailId already exists' } }

            }       
            else {
               const insertQueryText = "INSERT INTO userinfo(name, mobileNo, email_id, password) VALUES($1,$2,$3,$4) RETURNING *"
               const response = await pool.query(insertQueryText, [name, mobileNumber, emailId, password])
                res.send(response.rowa[0]);
            }
        
    } catch(err) {
        res.status(500).send(err.stack)
    }
    
})

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        mobileNumber: Joi.string().max(20).required(),
        emailId: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;