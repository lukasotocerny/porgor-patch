const request = require('request');
const database = require('./data/database.js');

console.log("Starting a client.");

const postRequest = () => request({url: "http://localhost:8080/login"}, function(err,res,body) {
    if (err) {
        console.log(err);
    } else {
        console.log(body);
    }
});

const databaseQuery = () => database.addMember("blue","novyblue",()=>console.log("yes"));

const data = {"id":1,"team":"red"};

console.log(data.id);