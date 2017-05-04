import React from 'react';
import './AdminPage.css';
const request = require('request');

export default class AdminPageQuery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {method:"add",object:"team",specifier:"red",value:"",serverResponse:"not loaded"};
        this.handleChangeMethod = this.handleChangeMethod.bind(this);
        this.handleChangeObject = this.handleChangeObject.bind(this);
        this.handleChangeSpecifier = this.handleChangeSpecifier.bind(this);
        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    handleChangeMethod(e) {
        this.setState({method:e.target.value});
    }

    handleChangeObject(e) {
        this.setState({object:e.target.value});
    }
    handleChangeSpecifier(e) {
        this.setState({specifier:e.target.value});
    }
    handleChangeValue(e) {
        this.setState({value:e.target.value});
    }

    render() {

        const sendQuery = (method, object, specifier, value) => {
            request.post({url:"http://localhost:8080/database",form:{"method":method,"object":object,"specifier":specifier,"value":value}}, (err, res, body) => {
                if (err) {
                    console.log("Error in sending query.");
                    this.setState({serverResponse:err.statusCode});
                } else {
                    console.log("Query successfully performed.");
                    this.setState({serverResponse:body});
                }
            });
        }

        return (
            <div>
                <ul>
                    <form className="loginForm">
                        <li><label className="labelText">
                            Method:  
                            <select value={this.state.method} onChange={this.handleChangeMethod}>
                                <option value="add">ADD</option>
                                <option value="get">GET</option>
                                <option value="modify">MODIFY</option>
                                <option value="delete">DELETE</option>
                            </select>
                        </label></li>
                        <li><label className="labelText">
                            Object:  
                            <select value={this.state.object} onChange={this.handleChangeObject}>
                                <option value="team">Team</option>
                                <option value="submission">Submission</option>
                                <option value="member">Member</option>
                                <option value="password">Password</option>
                            </select>
                        </label></li>
                        <li><label className="labelText">
                            Specifier:  
                            <select value={this.state.specifier} onChange={this.handleChangeSpecifier}>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="black">Black</option>
                                <option value="white">White</option>
                            </select>
                        </label></li>
                        <li><label className="labelText">
                            Value:
                            <input onChange={this.handleChangeValue} className="inputLogin" type="text" name="name" />
                        </label></li>
                    </form>
                </ul>
                <button onClick={()=>sendQuery(this.state.method, this.state.object, this.state.specifier, this.state.value)}>Submit</button>
                <p>{this.state.serverResponse}</p>
            </div>
        )
    }

}