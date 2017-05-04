const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const database = require('./data/database.js');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));

app.use('/static', express.static(path.join(__dirname, '..', 'build', 'static')));

app.get('/', function (req, res) {
    console.log("New client with IP address " + req.ip);
    console.log(req.method + " request for " + req.path);
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.post('/login', function (req, res) {
    console.log("Login request.");
    res.send("true");
});

app.post('/database', function (req, res) {
    const method = req.body.method;
    const object = req.body.object;
    const specifier = req.body.specifier;
    const value = req.body.value;
    console.log("Performing ".concat(method, " on ", object, " of ", specifier));
    database.addMember(specifier, value, () => {
        console.log("Succesfully performed operation ".concat(method, " on ", specifier, " ", object));
        res.send("Succesfully performed operation ".concat(method, " on ", specifier, " ", object));
    });    
})

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});