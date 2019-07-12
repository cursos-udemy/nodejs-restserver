require('./config');

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/usuarios'));

// mongodb+srv://jendrix:jendrix@cluster0-zfegt.mongodb.net/udemy-nodejs-cafe
// mongodb+srv://jendrix:jendrix@cluster0-zfegt.mongodb.net/udemy-nodejs-cafe?retryWrites=true&w=majority
mongoose.connect(process.env.DATA_BASE_URL, { useNewUrlParser: true, useCreateIndex: true }, (err, resp) => {
    if (err) throw err;
    console.info('database: udemy-nodejs-cafe connection OK');
});

app.listen(PORT, () => {
    console.info(`REST Server listen on port ${PORT} ...`);
});
