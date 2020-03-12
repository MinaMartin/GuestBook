const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const messageRouter = require('./routes/message');
const userRouter = require('./routes/user');

const mongoDB = require('./utilities/dataBase');


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET, POST, PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/messages', messageRouter);
app.use('/auth', userRouter);


app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({ error: message});
});

mongoDB.mongoConnect(() => {
    app.listen(8080);
});