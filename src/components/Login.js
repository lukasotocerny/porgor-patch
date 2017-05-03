import React from 'react';
import './Login.css';
import AdminPage from './AdminPage.js';

const request = require('request');

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { team: null };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        this.setState({ team: e.target.value });
    }

    render() {
        const validateLogInFromServer = (team, pass) => {
            this.setState({serverResponse:"loading"})
            request.post({url:"http://localhost:8080/login",form:{"team":team, "password":pass}}, (err, res, body) => {
                if (err) {
                    console.log("Error in trying to validate login credentials.");
                    return this.setState({serverResponse:err.statusCode});
                } else {
                    if (res.body == "true") {
                        console.log("Correct login credentials. Team ".concat(team, " is logged in."));
                        this.props.logIn(team);
                    } else {
                        console.log("Incorrect login credentials.");
                        this.setState({ team: ""});
                    };
                }
            });
        }

        const loggedInText = () => {
            if (this.props.teamLoggedIn=="admin") {
                return (<AdminPage />)
            } else {
                return (
                    <div>
                        <div className="headlineText">{this.props.teamLoggedIn} is logged in.</div>
                        <button className="loginButton" onClick={()=>this.props.logOut()}>Log out</button>
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
                            <select value={this.state.team} onChange={this.handleChange}>
                                <option value="red">Red</option>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                                <option value="blue">Blue</option>
                                <option selected value="admin">Admin</option>
                            </select>
                        </label>
                        <label className="labelText">
                            Password:
                            <input className="inputLogin" type="text" name="name" />
                        </label>
                    </form>
                    <button className="loginButton" onClick={()=>validateLogInFromServer("red","hi")}>Login</button>
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