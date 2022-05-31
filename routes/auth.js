const express = require('express');
const User_model = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const {registerValidation , loginValidation} = require('../validation');
const { route } = require('express/lib/router');
var routes = express.Router();

routes.post('/register' , async(req , res)=>{

    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // checking if the user is alreadu in the dataabase
    const emailExist = await User_model.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("E-mail is already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password , 10);

    // creatign a new user
    const user = new User_model({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save();
        res.send({user: user.id})
    } catch (e) {
        res.status(400).send(e);
        console.log(e);
    }
})

// LOGIN

routes.post('/login' ,async (req , res)=>{
    
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // checking if the user is alreadu in the dataabase
    const user = await User_model.findOne({email: req.body.email});
    if(!user) return res.status(400).send("E-mail dose't exist");

    // PASSWORD IS CORRRECT
    const validaPass = await bcrypt.compare(req.body.password , user.password);
    if(!validaPass) return res.status(400).send("Invalid password");

    // Create and assign a TOKEN
    const token = jwt.sign({_id : user._id} , process.env.TOKEN_SECREAT);
    res.header('auth-token' , token).send(token);
})

module.exports = routes;
