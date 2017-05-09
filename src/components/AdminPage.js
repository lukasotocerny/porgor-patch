import React from 'react';
import './AdminPage.css';
import request from 'request';
import AdminPageQuery from './AdminPageQuery.js';

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { "n":null, "password":null, "response":null };
        this.changeNQuestions = this.changeNQuestions.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.resetScore = this.resetScore.bind(this);
    }

    resetScore = () => {
        if (this.state.n && this.state.password) {
            request.post({url:"http://localhost:8080/reset", form:{"password":this.state.password,"n":this.state.n}}, (err,res,body) => {
                this.setState({"response":body});
                setTimeout(() => {
                    this.setState({"response":null});
                }, 2000);
            })
        } else {
            this.setState({"response":"Enter all values."});
            setTimeout(() => {
                this.setState({"response":null});
            }, 2000);
        }
    }

    changePassword = (e) => {
        this.setState({ "password": e.target.value });
    }

    changeNQuestions = (e) => {
        this.setState({ "n":e.target.value });
    }

    render() {
        return (
            <div className="adminPage">
                <span>Number of questions</span>
                <input onChange={this.changeNQuestions}/>
                <span>Password</span>
                <input onChange={this.changePassword}/>
                <button onClick={this.resetScore}>Reset</button>
                <p>{this.state.response}</p>
                <AdminPageQuery />
            </div>
        )
    }

}