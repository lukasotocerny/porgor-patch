import React from 'react';
import './Login.css';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {team:null};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({team: event.target.value});
    };

    render() {
        return (
            <div>
                <div className="headlineText">{this.props.loggedIn} is logged in.</div>
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
                <button onClick={()=>this.props.logInFn(this.state.team)}>Login</button>
            </div>
        )
    }

}