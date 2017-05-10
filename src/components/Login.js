import React from 'react';
import './Login.css';
import AdminPage from './AdminPage.js';

const path = require("path");
const request = require('request');

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { team:"admin", password:"", serverResponse:null };
        this.changeTeam = this.changeTeam.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.validateLogInFromServer = this.validateLogInFromServer.bind(this);
    }

    changeTeam = (e) => {
        this.setState({ team: e.target.value });
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    }
            
    validateLogInFromServer = () => {
        if (this.state.password && this.state.password!="") {
            request.post({url:this.props.host.concat("/login"),form:{"team":this.state.team, "password":this.state.password}}, (err, res, body) => {
                if (err) {
                    console.log("Error in trying to validate login credentials.");
                    this.setState({ "password":"", "serverResponse":"Error in trying to validate login credentials." });
                    setTimeout(() => {
                        this.setState({ "serverResponse":null })
                    }, 2000);
                } else {
                    if (res.body != "false") {
                        console.log("Correct login credentials. Team ".concat(this.state.team, " is logged in."));
                        this.props.logIn(this.state.team);
                    } else {
                        console.log("Incorrect login credentials.");
                        this.setState({ "password":"", "serverResponse":"Incorrect login credentials." });
                        setTimeout(() => {
                            this.setState({ "serverResponse":null })
                        }, 2000);
                    };
                }
            });
        } else if (!this.state.team) {
            this.setState({ "serverResponse":"Choose a team."});
            setTimeout(() => {
                this.setState({ "serverResponse":null })
            }, 2000);
        } else {
            this.setState({ "serverResponse":"Write your password."});
            setTimeout(() => {
                this.setState({ "serverResponse":null })
            }, 2000);
        }
    }

    render() {

        const loggedInText = () => {
            if (this.props.team.color=="admin") {
                return (
                    <div>
                        <AdminPage host={this.props.host} />
                        <button className="loginButton" onClick={()=>this.props.logOut()}>Log out</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="headlineText">{this.props.team.color} is logged in.</div>
                        <button className="loginButton" onClick={()=>{ this.props.logOut(); this.setState({team:null}) }}>Log out</button>
                    </div>
                )
            }
        }

        const logInForm = () => {
            return (
                <div>
                    <form className="loginForm">
                        <label className="labelText">
                            <span>Team:</span>  
                            <select value={this.state.team} onChange={this.changeTeam}>
                                <option value="red">Red</option>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                                <option value="blue">Blue</option>
                                <option selected value="admin">Admin</option>
                            </select>
                        </label>
                        <label className="labelText">
                            <span>Password:</span>
                            <input value={this.state.password} onChange={this.changePassword} className="inputLogin" type="text" name="name" />
                        </label>
                    </form>
                    <button className="loginButton" onClick={()=>this.validateLogInFromServer(this.state.team, this.state.password)}>Login</button>
                    <p>{this.state.serverResponse}</p>
                </div>
            )
        }

        return (
            <div>
                {this.props.loggedIn ? loggedInText() : logInForm()}
            </div>
        )
    }

}