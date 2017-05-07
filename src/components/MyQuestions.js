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
        this.getQuestionsFromServer = this.getQuestionsFromServer.bind(this);
        this.state = { myQuestions:null, currentQuestion:null, answer:null, correct:false, solvers:[] };
        this.getQuestionsFromServer();
    }

    changeQuestion = (q) => {
        this.setState({currentQuestion: q, answer:""});
    }

    changeAnswer = (e) => {
        this.setState({answer:e.target.value});
    }

    getQuestionsFromServer = () => {
        console.log("Getting questions from server.");
        if (this.props.loggedIn) {
            request.post({url:"http://localhost:8080/getquestions",form:{team:this.props.teamLoggedIn}}, (err,res,body) => {
                if (body) {
                    console.log("Received answer.");
                    let data = JSON.parse(body);
                    this.setState({myQuestions:data.questions, currentQuestion:data.currQuestion});
                } else {
                    this.setState({myQuestions:null});
                }
            })
        } else {
            return null;
        }
    }

    getQuestion = () => {
        if (this.state.myQuestions) {
            const n = this.state.myQuestions.length;
            for (let i=0;i<n;i++) {
                if (this.state.myQuestions[i].number==this.state.currentQuestion) {
                    return this.state.myQuestions[i].problem;
                }
            }
        } else {
            return "";
        }
    }

    submitQuestion = () => {
        if (this.state.answer) {
            request.post({url:"http://localhost:8080/submit", form:{team:this.props.teamLoggedIn, question:this.state.currentQuestion, answer:this.state.answer, solvers:this.state.solvers }}, (err,res,body) => {
                if (body=="correct") {
                    this.setState({correct:"correct"});
                    setTimeout(()=>this.setState({correct:false}), 3000);
                } else {
                    this.setState({correct:"incorrect"});
                    setTimeout(()=>this.setState({correct:false}), 3000);
                }
            })
        }
    }

    addSolver = (e) => {
        if (this.state.solvers.lastIndexOf(e.target.value)==-1 && e.target.value!="") {
            const newSolvers = this.state.solvers;
            newSolvers.push(e.target.value);
            this.setState({ solvers: newSolvers })
        }
    }

    deleteSolver = () => {
        if (this.state.solvers.length > 0) {
            const newSolvers = this.state.solvers;
            newSolvers.pop();
            this.setState({ solvers:newSolvers });
        }
    }

    render() {
        const loggedInPage = () => {
            if (this.props.loggedIn) {
                return (
                    <div className="myQuestions">
                        <ul>
                            {this.state.myQuestions && this.state.myQuestions.map((el) => {
                                return (<li><button onClick={()=>this.changeQuestion(el.number)}>Question {el.number}</button></li>);
                            })}
                        </ul>
                        <p className="question">{this.getQuestion()}</p>
                        <label className="labelText">
                            Answer:
                            <input value={this.state.answer} onChange={this.changeAnswer}/>
                        </label>
                        <label className="labelText">
                            Solvers:
                            <select onChange={this.addSolver}>
                                <option></option>
                                {this.props.teamMembers.map((el) => (<option>{el}</option>))}
                            </select>
                        </label>
                        <span className="solvers">
                            {this.state.solvers.map((el) => (<span>{el}, </span>))}
                        </span>
                        <button onClick={this.deleteSolver} className="deleteSolver">-</button>
                        <br/>
                        <button onClick={this.submitQuestion} className="submitButton">Submit</button>
                        {(this.state.correct) ? (this.state.correct=="correct") ? (<p>Correct!</p>) : (<p>Incorrect!</p>) : null}
                    </div>
                )
            } else {
                return (
                    <div>
                        <p style={{fontWeight:"bold"}} className="question">You have to login.</p>
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