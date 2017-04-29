const fs = require('fs');

const teams = ["red", "blue", "black", "white"];

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

let getScoreSheet = () => {
    fs.readFile("scoreSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            return JSON.parse(data).scoreSheet;
        }
    })
}

let addSubmission = (team, question, answer, solvers) => {
    fs.readFile('submissionSheet.json', (err, data) => {
        if (err){
            console.log(err);
        } else {
        let submissionSheet = JSON.parse(data);
        const date = new Date();
        submissionSheet.submissions.push({"color":team,"question":question,"answer":answer,
        "time":date.getHours().toString().concat(":",date.getMinutes().toString()),"correct":validateAnswer(question, answer)});
        const json = JSON.stringify(submissionSheet);
        fs.writeFile('submissionSheet.json', json, (err) => (err) ? console.log(err) : console.log("Submission recorded.")); // write it back 
        }
    });
}

let validateAnswer = (q, a) => {
    fs.readFile('answerSheet.json', (err, data) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            let answerSheet = JSON.parse(data);
            return answerSheet.answers[q]==a.toString();
        }
    })
}

console.log(getScoreSheet());