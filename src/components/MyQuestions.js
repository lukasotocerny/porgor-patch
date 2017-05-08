import React from 'react';
import request from 'request';
import './MyQuestions.css';

export default class MyQuestions extends React.Component {

    constructor(props) {
        super(props);
        this.changeQuestion = this.changeQuestion.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.submitQuestion = this.submitQuestion.bind(this);
        this.responseText = this.responseText.bind(this);
        this.state = { "currentQuestion":null, "answer":null, "correct":false, "solvers":[] };
    }

    changeQuestion = (q) => {
        this.setState({currentQuestion: q, answer:""});
    }

    changeAnswer = (e) => {
        this.setState({answer:e.target.value});
    }

    getQuestion = () => {
        if (this.props.team.questions) {
            const n = this.props.team.questions.length;
            for (let i=0;i<n;i++) {
                if (this.props.team.questions[i].number==this.state.currentQuestion) {
                    return this.props.team.questions[i].problem;
                }
            }
        } else {
            return "";
        }
    }

    submitQuestion = () => {
        console.log("Submit button clicked.");
        if (this.state.answer && this.state.solvers.length>0) {
            console.log("Conditions met. Sending request.");
            request.post({url:"http://localhost:8080/submit", form:{ "team":this.props.team.color, "question":this.state.currentQuestion, "answer":this.state.answer, "solvers":this.state.solvers }}, (err,res,body) => {
                if (body=="correct") {
                    this.props.updateState((data) => {
                        this.setState({"correct":"correct", "answer":"", "solvers":[]});
                        setTimeout(()=>this.setState({correct:false}), 3000);
                    })
                } else {
                    this.setState({ "correct":"incorrect" });
                    setTimeout(()=>this.setState({correct:false}), 3000);
                }
            })
        } else {
            console.log("Missing answer or solvers field.");
            this.setState({ "correct":"information" });
            setTimeout(()=>this.setState({ "correct":false }), 3000);
        }
    }

    addSolver = (e) => {
        if (this.state.solvers.lastIndexOf(e.target.value)==-1 && e.target.value!="") {
            const newSolvers = this.state.solvers;
            newSolvers.push(e.target.value);
            this.setState({ "solvers": newSolvers })
        }
    }

    deleteSolver = () => {
        if (this.state.solvers.length > 0) {
            const newSolvers = this.state.solvers;
            newSolvers.pop();
            this.setState({ "solvers":newSolvers });
        }
    }

    responseText = () => {
        if (this.state.correct=="information") {
            return (<p>Please fill all the information</p>);
        } else if (this.state.correct=="correct") {
            return (<p>Correct!</p>);
        } else if (this.state.correct=="incorrect") {
            return (<p>Incorrect!</p>);
        } else {
            return null;
        }
    }

    render() {
        const loggedInPage = () => {
            if (this.props.loggedIn) {
                return (
                    <div className="myQuestions">
                        <ul>
                            {this.props.team.questions && this.props.team.questions.map((el) => {
                                return (<li><button onClick={()=>this.changeQuestion(el.number)}>Question {el.number}</button></li>);
                            })}
                        </ul>
                        <p className="question">{this.getQuestion()}</p>
                        <label className="labelText">
                            <span>Answer:</span>
                            <input className="answerInput" value={this.state.answer} onChange={this.changeAnswer}/>
                        </label>
                        <label className="labelText">
                            <span>Solvers:</span>
                            <select onChange={this.addSolver}>
                                <option></option>
                                {this.props.team.members.map((el) => (<option>{el}</option>))}
                            </select>
                        </label>
                        <span className="solvers">
                            {this.state.solvers.map((el) => (<span className="solver">{el}, </span>))}
                        </span>
                        <button onClick={this.deleteSolver} className="deleteSolver">-</button>
                        <br/>
                        <button onClick={this.submitQuestion} className="submitButton">Submit</button>
                        {this.responseText()}
                    </div>
                )
            } else {
                return (
                    <div>
                        <p className="question">You have to login.</p>
                    </div>
                )
            }
        }

        return (
            <div>
                {loggedInPage()}
            </div>
        )

    }

}