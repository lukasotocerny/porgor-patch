import React from 'react';
import './Login.css';
import Request from 'request';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = { team: null, serverResponse: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        this.setState({ team: e.target.value });
    }

    render() {
        const validateLogInFromServer = (team, pass) => {
            Request.post({url: "http://localhost:8080/login", form:{text:"hi"}}, (err, res, body) => {
                if (err) {
                    return (<p>{err}</p>);
                } else {
                    return (<p>{body}</p>);
                }
            });
        }
        return (
            <div>
                <div className="headlineText">{this.props.loggedIn ? this.props.teamLoggedIn : "no team"} is logged in.</div>
                <form>
                    <label>
                        Team:  
                        <select value={this.state.team} onChange={this.handleChange}>
                            <option selected value="red">Red</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="blue">Blue</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label className="labelText">
                        Password:
                        <input className="inputLogin" type="text" name="name" />
                    </label>
                </form>
                <button onClick={()=>this.props.logIn(this.state.team)}>Login</button>
            </div>
        )
    }

}