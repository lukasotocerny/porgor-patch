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
    const team = req.body.team;
    const password = req.body.password;
    console.log("Login request for team ".concat(team.toUpperCase(), " with password: ", password));
    database.engine("login", null, team, password, (data) => {
        if (data) {
            console.log("Succesful login for team ".concat(team.toUpperCase()));
            res.send("correct");
        } else {
            console.log("Incorrect login for team ".concat(team.toUpperCase()));
            res.send("false");
        }
    })
});

app.post('/database', function (req, res) {
    const method = req.body.method;
    const object = req.body.object;
    const specifier = req.body.specifier;
    const value = req.body.value;
    console.log("Performing ".concat(method.toUpperCase(), object.toUpperCase(), " on ", specifier.toUpperCase()));   
    if (method=="get") {
        database.engine(method, object, specifier, value, (data) => {
            if (data) {
                console.log("Succesfully performed operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
                res.send(data);
            } else {
                console.log("Error on operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
                res.send("Error on operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
            }
        });
    } else {
        database.engine(method, object, specifier, value, (data) => {
            if (data) {
                console.log("Succesfully performed operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
                res.send("Succesfully performed operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
            } else {
                console.log("Error on operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
                res.send("Error on operation ".concat(method.toUpperCase(), " ", object.toUpperCase(), " on ", specifier.toUpperCase()));
            }
        });
    }
})

app.post('/submit', function(req, res) {
    const specifier = req.body.team;
    const value = {"answer":req.body.answer, "question":req.body.question, "solvers":req.body.solvers };
    console.log("Submitting question ".concat(req.body.question, " for team ",specifier.toUpperCase()));
    database.engine("add", "submission", specifier, value, (data) => {
        if (data) {
            console.log("Team ".concat(specifier.toUpperCase(), " correctly answered question ", req.body.question));
            res.send("correct");
        } else {
            console.log("Team ".concat(specifier.toUpperCase(), " incorrectly answered question ", req.body.question));
            res.send("incorrect");
        }
    })
});

app.post('/getteamdata', function (req, res) {
    const team = req.body.team;
    console.log("Getting team data for team ".concat(team.toUpperCase()));
    database.engine("get", "data", team, null, (data) => {
        if (data) {
            console.log("Successfully retrieved data for team ".concat(team.toUpperCase()));
            res.send(data);
        } else {
            console.log("Error in retrieving data for team ".concat(team.toUpperCase()));
            res.send(null);
        }
    })
});

app.get('/getscoresheet', (req, res) => {
    console.log("Getting score sheet.");
    database.engine("get", "scoresheet", null, null, (data) => {
        if (data) {
            console.log("Successfully retrieved score sheet.");
            res.send(data);
        } else {
            console.log("Error in retrieving score sheet.");
            res.send(null);
        }
    })  
});

app.post('/reset', (req,res) => {
    console.log("Reseting...");
    const password = req.body.password;
    const n = req.body.n;
    if (password=="2382017") {
        console.log("Password correct.");
        database.engine("reset", null, null, n, (data) => {
            if (data) {
                console.log("Reset successful");
                res.send("Reset sucessful.");
            } else {
                console.log("Reset unsuccessful.");
                res.send("Reset unsuccessful.");
            }
        });
    } else {
        console.log("Password incorrect.");
    }
})

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT);
});