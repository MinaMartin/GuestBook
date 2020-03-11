const express = require('express');
const {body} =require('express-validator');
const router = express.Router();

const User = require('../models/user');


const userController = require('../controller/user');

router.post('/signUp',[
    body('email','Invalid Email').trim().isEmail().custom((value,{req}) => {
        return User.findUserByEmail(value)
        .then(user => {
            if(user){
                return Promise.reject('Email Already Exists, Pick another One');
            }
            
        })
    }).normalizeEmail(),
    body('name','Name must be 3 chars at minimum and 20 chars at maximum').trim().isLength({max:20,min:3}),
    body('password','Password must be 5 characheters at minimum').trim().isLength({min:5}),
], userController.signUp);

router.post('/signIn',[
    body('email','Invalid Email').trim().isEmail().custom((value,{req}) => {
        return User.findUserByEmail(value)
        .then(user => {
            if(!user){
                return Promise.reject('Email Not Found');
            }
            
        })
    }).normalizeEmail(),
    body('password','Password must be 5 characheters at minimum').trim().isLength({min:5})
],userController.signIn);

module.exports = router;
