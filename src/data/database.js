const scoreSheet = [
{color:"red",points:0,questions:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}},
{color:"blue",points:0,questions:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}},
{color:"white",points:0,questions:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}},
{color:"black",points:0,questions:{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}}];

let submissionsSheet = [
{color:"red",question:"2",answer:"5.6",time:"20:32:34"},
{color:"blue",question:"1",answer:"7",time:"20:56:08"},
{color:"black",question:"1",answer:"8",time:"20:51:12"}
]

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

const answerSheet = {"1":"7","2":"5.6"};

const teams = ["red", "blue", "black", "white"];

let initializeScoreSheet = (n) => {
    teams.map(team => {
        const points = getRandomArbitrary(0,n);
        const pointsTemp = points;
        let sheet;
        for (let i=0;i<n;i++) {
            if (pointsTemp > 0) {
                sheet[i] = "correct";
            } else {
                sheet[i] = 0;
            }
        }
    })
}

let addSubmission = (t, q, a) => {
    let date = new Date();
    submissionsSheet.push({color:t,question:q,answer:a,time:date.getHours().toString().concat(date.getMinutes().toString())})
    if (validateAnswer(q,a)) {
        scoreSheet[t].questions[q] = "correct";
        scoreSheet[t].points++;
    } else {
        scoreSheet[t].questions[q]++;
    }
}

let validateAnswer = (q, a) => a==answerSheet[q];

module.exports = {
    scoreSheet: scoreSheet
}