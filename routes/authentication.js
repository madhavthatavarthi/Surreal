const express = require('express');
const router = express.Router();
const { pool } = require("../config");
const Joi = require("joi");
const userService = require("../service/userService")


router.post("/", async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { error } = validateUser(req.body);
        console.log("errorroror", error)
        if (error)
            return res.status(400).send(error.details[0].message);
        const { emailId, password } = req.body;
        console.log("email", emailId, password);
        if (emailId && password) {
            const user = await userService.authenticate(emailId, password);
            console.log("use.,,.,..,", user);
            if (user) {
                res.json(user);
            } else {
                res.status(400).json({ message: 'Username or password is incorrect' })
            }
        }
    } catch (err) {
        res.status(500).send(err)
    }
    
  });

  function validateUser(user) {
    const schema = {
        emailId: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;