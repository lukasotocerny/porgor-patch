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
            if (answerSheet[q]) {
                const res = answerSheet[q]==a.toString();
                console.log("Question " + q + " was " + (res ? "correct." : "incorrect."));
                fn(res);
            } else {
                console.log("Question number out of bound.");
                fn(false);
            }
        }
    })
};

let validateLogin = (team, password, fn) => {
    console.log("Validating login credentials of " + team);
    fs.readFile("loginSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try {
                const teamLogins = JSON.parse(data);
                if (teamLogins[team]) {
                    if (teamLogins[team]==password) {
                        console.log("Team " + team + " correct login.");
                        fn(true);
                    } else {
                        console.log("Team " + team + " incorrect login.");
                        fn(false);
                    }
                } else {
                    console.log("Team " + team + " not registered.");
                    fn(false);
                }
            } catch (e) {
                console.log("Team is not registered.");
            }
        }
    })
}

let registerLogin = (team, password, fn) => {
    console.log("Validating login credentials of " + team);
    fs.readFile("loginSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try {
                let teamLogins = JSON.parse(data);
                if (teamLogins[team]) {
                    console.log("Team " + team + " already registered.");
                    fn(false);
                } else {
                    console.log("Team " + team + " not registered. Lets register it...");
                    teamLogins[team] = password;
                    fs.writeFile('loginSheet.json', JSON.stringify(teamLogins), (err) => {
                        if (err) {
                            console.log(err) 
                        } else {
                            console.log("Team " + team + " has been successfully registered.");
                            fn(true);
                        }
                    });
                }
            } catch (e) {
                console.log("Team " + team + " not registered. Lets register it...");
                const newTeamLogins = {[team]: password};
                fs.writeFile('loginSheet.json', JSON.stringify(newTeamLogins), (err) => {
                    if (err) {
                        console.log(err) 
                    } else {
                        console.log("Team " + team + " has been successfully registered.");
                        fn(true);
                    }
                });
            }
        }
    })
}

let addOfficialAnswer = (q, a) => {
    fs.readFile("answerSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try {
                let answers = JSON.parse(data);
                answers[q] = a;
                fs.writeFile('answerSheet.json', JSON.stringify(answers), (err) => (err) ? console.log(err) : console.log("Answer for question " + q + " was recorded."));
            } catch (e) {
                let answers = {[q] : a};
                fs.writeFile('answerSheet.json', JSON.stringify(answers), (err) => (err) ? console.log(err) : console.log("Answer for question " + q + " was recorded."));
            }
        }
    })
}

let getPassword = (user, pass, team, fn) => {
    fs.readFile("loginSheet.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            try {
                let teamLogins = JSON.parse(data);
                if (user=="admin" && teamLogins.admin && pass==teamLogins.admin) {
                    console.log("admin logged in.");
                    (teamLogins[team]) ? fn(teamLogins[team]) : fn(null);
                }
            } catch (e) {
                console.log("No login data.");
                fn(null);
            }
        }
    })

}