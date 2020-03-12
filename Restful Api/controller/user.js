const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


exports.signUp = (req, res, next) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (re.test(email)) { //then a valid email address
        User.findUserByEmail(email.trim())
            .then(user => {
                if (user) {
                    const err = new Error('Email Already Exists, Pick another One');
                    err.statusCode = 401;
                    return Promise.reject(err);
                }
                //return true;
            })
            .catch(err => {
                console.log("Catch Block");
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        const err = new Error('Invalid Email Address');
        err.statusCode = 403;
        throw err;
    }

    try {
        if (name.length < 3 || name.length > 20) {
            const err = new Error('Name must be 3 chars at minimum and 20 chars at maximum');
            err.statusCode = 403;
            throw err;
        }
        if (password.length < 5) {
            const err = new Error('Password must be 5 characheters at minimum');
            err.statusCode = 403;
            throw err;
        }
    } catch (err) {
        next(err);
    }

    bcrypt.hash(password, 10)
        .then(hashedPw => {
            const user = new User(name, email, hashedPw);

            user.signUp()
                .then(response => {
                    res.status(200).json({
                        message: "User Signed Up Successfully",
                        userId: response.ops[0]._id, userName: response.ops[0].name, userEmail: response.ops[0].email
                    })
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

/************************************************************************************************* */
exports.signIn = (req, res, next) => {

    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email = req.body.email;
    const password = req.body.password;

    if (!re.test(email)) { //then a valid email address
        const err = new Error('Invalid Email Address');
        err.statusCode = 403;
        throw err;
    }

    try {
        if (password.length < 5) {
            const err = new Error('Password must be 5 characheters at minimum');
            err.statusCode = 403;
            throw err;
        }
    } catch (err) {
        next(err);
    }

    let user;
    User.findUserByEmail(email.trim())
        .then(USER => {
            if (!USER) {
                const err = new Error('Email Not Found');
                err.statusCode = 401;
                throw err;
            }
            user = USER;
            return bcrypt.compare(password, USER.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const notEqualError = new Error("Wrong Password");
                notEqualError.statusCode = 401;
                throw notEqualError;
            }
            const token = Jwt.sign({ email: user.email, userId: user._id, userName: user.name },
                "veryStrongSecretveryStrongSecret", { expiresIn: '1h' })
            res.status(200).json({ message: "User Signed In Successfully", token: token, userName: user.name, userId: user._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

