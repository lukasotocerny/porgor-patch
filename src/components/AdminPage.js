import React from 'react';
import './AdminPage.css';
import request from 'request';
import AdminPageQuery from './AdminPageQuery.js';

const path = require("path");

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
            request.post({url:this.props.host.concat("/reset"), form:{"password":this.state.password,"n":this.state.n}}, (err,res,body) => {
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
                <p className="labelText">QUERY</p>
                <p className="labelTextMini">As values for adding questions use format "number||question||answer", e.g. 1||What is 1+1?||2</p>
                <AdminPageQuery host={this.props.host} />
                <p className="labelTextR">RESET</p>
                <ul>
                    <form className="resetForm">
                        <li><label className="labelText">
                            Number of Questions: 
                            <input onChange={this.changeNQuestions} className="inputLogin" type="text" />
                        </label></li>
                        <li><label className="labelText">
                            Admin password:
                            <input onChange={this.changePassword} className="inputLogin" type="text" />
                        </label></li>
                    </form>
                </ul>
                <button className="queryButton" onClick={this.resetScore}>Reset</button>
                <p>{this.state.response}</p>
            </div>
        )
    }

}