const fs = require('fs');
const path = require('path');

const teams = ["red", "blue", "black", "white"];

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

let getTeam = (team, fn) => {
    fs.readFile(path.join(__dirname, "teamSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            const teams = JSON.parse(data);
            fn(teams[team]);
        }
    })
}

let getSubmission = (team, fn) => {
    fs.readFile(path.join(__dirname, "submissionSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            const submissions = JSON.parse(data).submissions;
            fn(submissions.filter((el) => el["color"]==team ? true : false));
        }
    })
}

let getPassword = (team, fn) => {
    fs.readFile(path.join(__dirname, "loginSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            try {
                let teamLogins = JSON.parse(data);
                if (teamLogins[team]) {
                    console.log("Password of team " + team.toUpperCase() + " is " + teamLogins[team]);
                    fn(teamLogins[team])
                } else {
                    console.log("Team " + team.toUpperCase() + " is not registered.");
                    fn(false);
                }
            } catch (e) {
                console.log("No login data.");
                fn(false);
            }
        }
    })
}

let getQuestions = (team, fn) => {
    fs.readFile(path.join(__dirname, "questionSheet.json"), (err, data) => {
        console.log("Retrieving questions for ".concat(team.toUpperCase()));
        if (err) {
            console.log(err);
            fn(false);
        } else {
            try {
                let questions = JSON.parse(data);
                let result = { questions:[], currQuestion:null };
                for (let i=0;i<200;i++) {
                    if (questions[i]) {
                        (result.currQuestion) ? null : result.currQuestion=i;
                        result.questions.push(questions[i]);
                    }
                }
                fn(result);
            } catch (e) {
                console.log("There are no questions yet.");
                fn(false);
            }
        }
    })
}

let modifyPassword = (team, new_password, fn) => {
    fs.readFile(path.join(__dirname, "loginSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            const teams = JSON.parse(data);
            teams[team] = new_password;
            fs.writeFile(path.join(__dirname, "loginSheet.json"), JSON.stringify(teams), (err) => {
                if (err) {
                    fn(false)
                } else {
                    fn(true)
                };
            });
        }
    })
}

let updateScore = (team, question, fn) => {
    console.log("Updating score...");
    fs.readFile(path.join(__dirname, "teamSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let file = JSON.parse(data);
            if (!file[team].questions[question]) {
                console.log("Question ".concat(question, " does not exist."));
                fn(false);
            } else if (file[team].questions[question] == "correct") {
                console.log("Points have been already added.");
                fn(true);
            } else {
                file[team].points++;
                file[team].questions[question] = "correct";
                fs.writeFile(path.join(__dirname, "teamSheet.json"), JSON.stringify(file), (err) => {
                    if (err) {
                        console.log(err);
                        fn(false);
                    } else {
                        console.log("Point successfully added.");
                        fn(true);
                    };
                });
            }
        }
    })
}

let addSubmission = (team, question, answer, solvers, fn) => {
    console.log("Team " + team + " submitting question " + question);
    fs.readFile(path.join(__dirname, "submissionSheet.json"), (err, data) => {
        if (err){
            console.log(err);
            fn(false);
        } else {
            try {
                let submissionSheet = JSON.parse(data);
                const date = new Date();
                validateAnswer(question, answer, (correct) => {
                    const id = getRandomArbitrary(0,100000000000000);
                    const newSubmission = 
                    {
                        "color":team,
                        "question":question,
                        "answer":answer,
                        "solvers":solvers,
                        "time":date.getHours().toString().concat(":",date.getMinutes().toString()),
                        "correct":correct,
                        "id": id,
                    };
                    console.log("New submission: \n" + JSON.stringify(newSubmission));
                    submissionSheet.submissions.push(newSubmission);
                    const json = JSON.stringify(submissionSheet);
                    fs.writeFile(path.join(__dirname, "submissionSheet.json"), json, (err) => {
                        if (err) {
                            console.log(err);
                            fn(false);
                        } else {
                            console.log("Submission was recorded.")
                            if (correct) {
                                updateScore(team, question, fn);
                            } else {
                                fn(false);
                            }
                        }   
                    });
                });
            } catch (e) {
                const date = new Date();
                const id = getRandomArbitrary(0,100000000000000);
                validateAnswer(question, answer, (correct) => {
                    const newSubmission = 
                    {
                        "color":team,
                        "question":question,
                        "answer":answer,
                        "solvers":solvers,
                        "time":date.getHours().toString().concat(":",date.getMinutes().toString()),
                        "correct":correct,
                        "id": id
                    };
                    console.log("New submission: \n" + JSON.stringify(newSubmission));
                    const submissionSheet = {"submission":[newSubmission]};
                    const json = JSON.stringify(submissionSheet);
                    fs.writeFile(path.join(__dirname, "submissionSheet.json"), json, (err) => {
                        if (err) {
                            console.log(err);
                            fn(false);
                        } else {
                            if (correct) {
                                updateScore(team, question, fn);
                            } else {
                                fn(false);
                            }
                        }   
                    });            
                });
            }
        }
    });
}

let validateAnswer = (q, a, fn) => {
    fs.readFile(path.join(__dirname, "questionSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            let questionSheet = JSON.parse(data);
            if (questionSheet[q]) {
                const res = questionSheet[q].answer==a.toString();
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
    console.log("Validating login credentials of " + team.toUpperCase());
    fs.readFile(path.join(__dirname, "loginSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            try {
                const teamLogins = JSON.parse(data);
                if (teamLogins[team]) {
                    if (teamLogins[team]==password) {
                        console.log("Team " + team.toUpperCase() + " correct login.");
                        getTeam(team, (teamInfo) => {
                            if (teamInfo) {
                                fn(teamInfo.members);
                            } else {
                                fn(false);
                            }
                        });
                    } else {
                        console.log("Team " + team.toUpperCase() + " incorrect login.");
                        fn(false);
                    }
                } else {
                    console.log("Team " + team.toUpperCase() + " not registered.");
                    fn(false);
                }
            } catch (e) {
                console.log("Team is not registered.");
                fn(false);
            }
        }
    })
}

let addPassword = (team, password, fn) => {
    console.log("Validating login credentials of " + team.toUpperCase());
    fs.readFile(path.join(__dirname,"loginSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            try {
                let teamLogins = JSON.parse(data);
                if (teamLogins[team]) {
                    console.log("Team " + team + " already registered.");
                    fn(false);
                } else {
                    console.log("Team " + team + " not registered. Lets register it...");
                    teamLogins[team] = password;
                    fs.writeFile(path.join(__dirname,"loginSheet.json"), JSON.stringify(teamLogins), (err) => {
                        if (err) {
                            console.log(err) 
                        } else {
                            console.log("Team " + team.toUpperCase() + " has been successfully registered.");
                            fn(true);
                        }
                    });
                }
            } catch (e) {
                console.log("Team " + team + " not registered. Lets register it...");
                const newTeamLogins = {[team]: password};
                fs.writeFile(path.join(__dirname,"loginSheet.json"), JSON.stringify(newTeamLogins), (err) => {
                    if (err) {
                        console.log(err);
                        fn(false);
                    } else {
                        console.log("Team " + team + " has been successfully registered.");
                        fn(true);
                    }
                });
            }
        }
    })
}

let addMember = (team, member, fn) => {
    console.log("Adding member " + member + " to team " + team.toUpperCase());
    fs.readFile(path.join(__dirname,"teamSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            let teams = JSON.parse(data);
            if (teams[team].members.find((el)=>el==member)) {
                console.log("Member" + member + " already registered.");
                fn(false);
            } else {
                console.log("Member " + member + " not registered. Lets register it...");
                teams[team].members.push(member);
                fs.writeFile(path.join(__dirname,"teamSheet.json"), JSON.stringify(teams), (err) => {
                    if (err) {
                        console.log(err) 
                    } else {
                        console.log("Member " + member + " has been successfully registered.");
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

let engine = (method, object, specifier, value, fn) => {
    if (method=="get") {
        if (object=="team") {
            getTeam(specifier, (res) => fn(res));
        } else if (object=="submission") {
            getSubmission(specifier, (res) => fn(res));
        } else if (object=="password") {
            getPassword(specifier, (res) => fn(res));
        } else if (object=="questions") {
            getQuestions(specifier, (res) => fn(res));
        } else {
            return fn(false);
        }
    } else if (method=="add") {
        if (object=="member") {
            addMember(specifier, value, (res) => fn(res));
        } else if (object=="password") {
            addPassword(specifier, value, (res) => fn(res));
        } else if (object=="submission") {
            addSubmission(specifier, value.question, value.answer, value.solvers, (res) => fn(res));        
        } else {
            fn(false);
        }
    } else if (method=="modify") {
        if (!value || value.length==0) {
            fn(false);
        } else if (object=="password") {
            modifyPassword(specifier, value, (res) => fn(res));
        } else {
            fn(false);
        }
    } else if (method=="login") {
        validateLogin(specifier, value, (res) => fn(res));
    } else {
        fn(false);
    }
}

module.exports = {
    "engine": engine
}