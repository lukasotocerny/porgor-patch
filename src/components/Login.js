import React from 'react';
import './Login.css';
import AdminPage from './AdminPage.js';

const request = require('request');

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { team:null, password:null, serverResponse:null };
        this.changeTeam = this.changeTeam.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    changeTeam = (e) => {
        this.setState({ team: e.target.value });
    }

    changePassword = (e) => {
        this.setState({ password: e.target.value });
    }

    render() {
        const validateLogInFromServer = (team, pass) => {
            if (this.state.password && this.state.password!="") {
                request.post({url:"http://localhost:8080/login",form:{"team":team, "password":pass}}, (err, res, body) => {
                    if (err) {
                        console.log("Error in trying to validate login credentials.");
                        this.setState({ password:null, serverResponse:"Error in trying to validate login credentials." });
                        setTimeout(() => {
                            this.setState({ serverResponse:null })
                        }, 2000);
                    } else {
                        if (res.body != "false") {
                            console.log("Correct login credentials. Team ".concat(team, " is logged in."));
                            const teamMembers = JSON.parse(res.body);
                            this.props.logIn(team, teamMembers);
                        } else {
                            console.log("Incorrect login credentials.");
                            this.setState({ password:null, serverResponse:"Incorrect login credentials." });
                            setTimeout(() => {
                                this.setState({ serverResponse:null })
                            }, 2000);
                            this.setState({ team: null });
                        };
                    }
                });
            } else if (!this.state.team) {
                this.setState({ serverResponse: "Choose a team."});
                setTimeout(() => {
                    this.setState({ serverResponse: null })
                }, 2000);
            } else {
                this.setState({ serverResponse: "Write your password."});
                setTimeout(() => {
                    this.setState({ serverResponse: null })
                }, 2000);
            }
        }

        const loggedInText = () => {
            if (this.props.teamLoggedIn=="admin") {
                return (
                    <div>
                        <AdminPage />
                        <button className="loginButton" onClick={()=>this.props.logOut()}>Log out</button>
                    </div>
                )
            } else {
                return (
                    <div>
                        <div className="headlineText">{this.props.teamLoggedIn} is logged in.</div>
                        <button className="loginButton" onClick={()=>{this.props.logOut();this.setState({team:null})}}>Log out</button>
                    </div>
                )
            }
        }

        const logInForm = () => {
            return (
                <div>
                    <form className="loginForm">
                        <label className="labelText">
                            Team:  
                            <select value={this.state.team} onChange={this.changeTeam}>
                                <option value="red">Red</option>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                                <option value="blue">Blue</option>
                                <option selected value="admin">Admin</option>
                            </select>
                        </label>
                        <label className="labelText">
                            Password:
                            <input onChange={this.changePassword} className="inputLogin" type="text" name="name" />
                        </label>
                    </form>
                    <button className="loginButton" onClick={()=>validateLogInFromServer(this.state.team, this.state.password)}>Login</button>
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