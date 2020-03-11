const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');


exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message:"Validation failed",errors:errors.array()});
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 10)
        .then(hashedPw => {
            const user = new User(name, email, hashedPw);

            user.signUp()
            .then(response => {
                res.status(200).json({ message: "User Signed Up Successfully",
                userId: response.ops[0]._id,userName:response.ops[0].name,userEmail:response.ops[0].email })
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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message:"Validation failed",errors:errors.array()});
    }

    const email = req.body.email;
    const password = req.body.password;
    let user;
    User.findUserByEmail(email)
        .then(USER => {
            user = USER;
            return bcrypt.compare(password, USER.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Wrong Password");
                err.statusCode(401);
                throw error;
            }
            const token = Jwt.sign({ email: user.email, userId: user._id, userName: user.name },
                "veryStrongSecretveryStrongSecret", { expiresIn: '1h' })
            res.status(200).json({ message: "User Signed In Successfully", token: token, userName:user.name,userId:user._id});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

