const express = require('express')
const app = express()
const bodyParser = require('body-parser');
require('./config');

const PORT = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    const body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            message: 'nombre no especificado'
        });
    } else {
        res.json({usuario: body});
    }
});

app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);
    res.json({
        id,
        url: req.url
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});



app.listen(PORT, () => {
    console.info(`REST Server listen on port ${PORT} ...`);
});