const fs = require('fs');

const teams = ["red", "blue", "black", "white"];

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

let getScoreSheet = (fn) => {
    fs.readFile("scoreSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            fn(JSON.parse(data).scoreSheet);
        }
    })
}

let addSubmission = (team, question, answer, solvers) => {
    console.log("Team " + team + " submitting question " + question);
    fs.readFile('submissionSheet.json', (err, data) => {
        if (err){
            console.log(err);
        } else {
            let submissionSheet = JSON.parse(data);
            const date = new Date();
            validateAnswer(question, answer, (correct) => {
                const newSubmission = 
                {
                    "color":team,
                    "question":question,
                    "answer":answer,
                    "solvers":solvers,
                    "time":date.getHours().toString().concat(":",date.getMinutes().toString()),
                    "correct":correct
                };
                console.log("New submission: \n" + JSON.stringify(newSubmission));
                submissionSheet.submissions.push(newSubmission);
                const json = JSON.stringify(submissionSheet);
                fs.writeFile('submissionSheet.json', json, (err) => (err) ? console.log(err) : console.log("Submission was recorded."));
            });
        }
    });
}

let validateAnswer = (q, a, fn) => {
    fs.readFile('answerSheet.json', (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            let answerSheet = JSON.parse(data);
            if (answerSheet.answers[q]) {
                const res = answerSheet.answers[q]==a.toString();
                console.log("Question " + q + " was " + (res ? "correct." : "incorrect."));
                fn(res);
            } else {
                console.log("Question number out of bound.");
                fn(false);
            }
        }
    })
};

let addOfficialAnswer = (q, a) => {
    fs.readFile("answerSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try {
                let raw = JSON.parse(data);
                raw.answers[q] = a;
                fs.writeFile('answerSheet.json', JSON.stringify(raw), (err) => (err) ? console.log(err) : console.log("Answer for question " + q + " was recorded."));
            } catch (e) {
                let raw = {answers: {[q] : a}};
                fs.writeFile('answerSheet.json', JSON.stringify(raw), (err) => (err) ? console.log(err) : console.log("Answer for question " + q + " was recorded."));
            }
        }
    })
}

addOfficialAnswer("7","1");