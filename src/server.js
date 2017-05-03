const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

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
})

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});