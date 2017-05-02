var request = require('request');

console.log("Starting a client.");

request({url: "http://localhost:8080/login"}, function(err,res,body) {
    if (err) {
        console.log(err);
    } else {
        console.log(body);
    }
});