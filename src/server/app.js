require('./config');

const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(require('./routes'));

mongoose.connect(process.env.DATA_BASE_URL, { useNewUrlParser: true, useCreateIndex: true }, (err, resp) => {
    if (err) throw err;
    console.info('database connection OK');
});

app.listen(PORT, () => {
    console.info(`REST Server listen on port ${PORT} ...`);
});
