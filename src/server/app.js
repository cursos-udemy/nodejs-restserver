require('./config');

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/usuarios'));

mongoose.connect('mongodb://192.168.0.201:27017/udemy-nodejs-cafe', (err, resp) => {
    if (err) throw err;
    console.info('database: udemy-nodejs-cafe connection OK');
});

app.listen(PORT, () => {
    console.info(`REST Server listen on port ${PORT} ...`);
});
