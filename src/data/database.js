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

let getScoreSheet = (fn) => {
    fs.readFile(path.join(__dirname, "teamSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            const scoreSheet = JSON.parse(data);
            console.log("Reading file teamSheet.json successful.");
            fn(scoreSheet);
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

let getTeamData = (team, fn) => {
    console.log("Retrieving questions for ".concat(team.toUpperCase()));
    fs.readFile(path.join(__dirname, "teamSheet.json"), (err, data) => {
        if (err) {
            console.log("Error in reading teamSheet.json");
            fn(false);
        } else {
            const teams = JSON.parse(data);
            fs.readFile(path.join(__dirname, "questionSheet.json"), (err, data2) => {
                if (err) {
                    console.log("Error in reading questionSheet.json");
                    fn(false);
                } else {
                    let i=1;
                    const officialQuestions = JSON.parse(data2);
                    let response = {
                        questions: [],
                        members: teams[team].members,
                        color: team
                    };
                    while (officialQuestions[i] && response.questions.length<5) {
                        if (teams[team].questions[i]==null || !teams[team].questions[i].correct) {
                            console.log("Adding question ".concat(i, " to stack of ", team));
                            response.questions.push(officialQuestions[i]);
                        }
                        i++;
                    }
                    fn(response);
                }
            });
        }
    })
}

let getQuestion = (fn) => {
    console.log("Getting questions...");
    fs.readFile(path.join(__dirname, "questionSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            const questions = JSON.parse(data);
            fn(questions);
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

let updateScore = (team, question, correct, fn) => {
    console.log("Updating team sheet...");
    fs.readFile(path.join(__dirname, "teamSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            let file = JSON.parse(data);
            if (file[team].questions[question]!=null && file[team].questions[question].correct) {
                console.log("Points have been already added.");
                fn(true);
            } else {
                if (file[team].questions[question]) {
                    file[team].questions[question].correct = correct;
                    file[team].questions[question].attempts++;
                } else {
                    file[team].questions[question] = {
                        "correct": correct,
                        "attempts": 1
                    };
                }
                (correct) ? file[team].points++ : null;
                fs.writeFile(path.join(__dirname, "teamSheet.json"), JSON.stringify(file), (err) => {
                    if (err) {
                        console.log(err);
                        fn(false);
                    } else {
                        console.log("Team sheet successfully updated.");
                        fn(correct);
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
                fs.writeFile(path.join(__dirname, "submissionSheet.json"), json, (errr) => {
                    if (errr) {
                        console.log(errr);
                        fn(false);
                    } else {
                        console.log("Submission was recorded.")
                        updateScore(team, question, correct, (res) => {
                            fn(res);
                        });
                    }   
                });
            });
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
                        fn(true);
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

let addQuestion = (number, problem, answer, fn) => {
    fs.readFile(path.join(__dirname, "questionSheet.json"), (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let questions = JSON.parse(data);
            questions[number] = {
                "problem": problem,
                "answer": answer,
                "number": number
            };
            fs.writeFile(path.join(__dirname, 'questionSheet.json'), JSON.stringify(questions), (err) => {
                if (err) {
                    console.log(err);
                    fn(false);
                } else {
                    console.log("Question " + number + " has been added.");
                    fn(true);
                }
            });
        }
    })
}


let reset = (n, fn) => {
    console.log("Starting reseting in database.");
    const loginSheet = {
        "admin": "2382017",
        "red": null,
        "white": null,
        "black": null,
        "blue": null
    };
    const submissionSheet = {
        "submissions": []
    }
    let teamSheet = {
        "red": 
            {
                "color":"red",
                "points":0,
                "members": [],
                "questions": {}
        },
        "white":
            {
                "color":"white",
                "points":0,
                "members": [],
                "questions": {}
            },
        "blue":
            {
                "color":"blue",
                "points":0,
                "members": [],
                "questions": {}
            },
        "black":
            {
                "color":"black",
                "points":0,
                "members": [],
                "questions": {}
            }
    }
    let questionSheet = {};
    for (let i=1;i<=n;i++) {
        teamSheet["red"].questions[i] = {"correct":false,"attempts":0};
        teamSheet["black"].questions[i] = {"correct":false,"attempts":0};
        teamSheet["white"].questions[i] = {"correct":false,"attempts":0};
        teamSheet["blue"].questions[i] = {"correct":false,"attempts":0};
        questionSheet[i] = {"number":i};
    }
    fs.writeFile(path.join(__dirname, "loginSheet.json"), JSON.stringify(loginSheet), (err) => {
        if (err) {
            console.log(err);
            fn(false);
        } else {
            console.log("loginSheet reset.");
            fs.writeFile(path.join(__dirname, "submissionSheet.json"), JSON.stringify(submissionSheet), (err1) => {
                if (err1) {
                    console.log(err1);
                    fn(false);
                } else {
                    console.log("submissionSheet reset.");
                    fs.writeFile(path.join(__dirname, "questionSheet.json"), JSON.stringify(questionSheet), (err2) => {
                        if (err2) {
                            console.log(err2);
                            fn(false);
                        } else {
                            console.log("questionSheet reset.");
                            fs.writeFile(path.join(__dirname, "teamSheet.json"), JSON.stringify(teamSheet), (err3) => {
                                if (err3) {
                                    console.log(err3);
                                    fn(false);
                                } else {
                                    console.log("teamSheet reset.");
                                    fn(true);
                                }
                            })
                        }
                    })
                }
            })
        }
    });

}

let getBestSolvers = (fn) => {
    const minArr = (arr) => {
        let min = arr[0];
        for (let i=1;i<arr.length;i++) {
            if (arr[i]<min) min=arr[i];
        }
        return min;
    }
    const bestSolvers = (sols) => {
        let result = [];
        let numbers = [];
        let min;
        Object.keys(sols).map((el) => {
            if (result.length<3) {
                result.push({"solver":el,"number":sols[el]});
                numbers.push(sols[el]);
            } else {
                min = minArr(numbers);
                if (sols[el] > min) {
                    result.filter((ell) => ell.number==min);
                    numbers.filter((ell) => ell==min);
                    result.push({"solver":el,"number":sols[el]});
                    numbers.push(sols[el]);
                } else if (sols[el]==min) {
                    result.push({"solver":el,"number":sols[el]});
                }
            }
        })
        if (result.length==0) {
            return false;
        } else if (result.length==1) {
            return result;
        } else if (result.length==2) {
            if (result[0].number>=result[1].number) {
                return result;
            } else {
                const temp = result[0];
                result[0] = result[1];
                result[1] = temp;
                return result;
            }
        } else {
            let temp;
            if (result[0].number<result[1].number) {
                temp = result[0];
                result[0] = result[1];
                result[1] = temp;
            }
            if (result[1].number<result[2].number) {
                temp = result[1];
                result[1] = result[2];
                result[2] = temp;
            }
            if (result[0].number<result[1].number) {
                temp = result[0];
                result[0] = result[1];
                result[1] = temp;
            }
            return result;
        }
    }
    let solvers = {};
    fs.readFile(path.join(__dirname, "submissionSheet.json"), (err, data) => {
        if (err) {
            console.log("Error in reading submissionSheet.json ".concat(err));
            fn(false);
        } else {
            const submissions = JSON.parse(data).submissions;
            for (let i=0;i<submissions.length;i++) {
                if (submissions[i].correct) {
                    submissions[i].solvers.map((el) => {
                        if (solvers[el]) {
                            solvers[el]++;
                        } else {
                            solvers[el] = 1;
                        }
                    })
                }
            }
            console.log("Calculating best solvers...");
            fn(bestSolvers(solvers));
        }
    })
}

let validateQuestionInput = (text) => {
    const args = text.split('||');
    if (args.length==3) {
        if (!(isNaN(args[0]) || isNaN(args[2])) && args[0].length>0 && args[2].length>0) {
            return {
                "number": args[0],
                "problem": args[1],
                "answer": args[2]
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

let engine = (method, object, specifier, value, fn) => {
    if (method=="get") {
        if (object=="team") {
            getTeam(specifier, (res) => fn(res));
        } else if (object=="submission") {
            getSubmission(specifier, (res) => fn(res));
        } else if (object=="password") {
            getPassword(specifier, (res) => fn(res));
        } else if (object=="data") {
            getTeamData(specifier, (res) => fn(res));
        } else if (object=="scoresheet") {
            getScoreSheet((res) => fn(res));
        } else if (object=="solvers") {
            getBestSolvers((res) => fn(res))
        } else if (object=="question") {
            getQuestion((res) => fn(res))
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
        } else if (object=="question") {
            const args = validateQuestionInput(value);
            if (args) {
                addQuestion(args.number, args.problem, args.answer, (res) => fn(res));
            } else {
                fn(false);
            }
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
    } else if (method=="reset") {
        reset(value, fn);
    } else {
        fn(false);
    }
}

module.exports = {
    "engine": engine
}