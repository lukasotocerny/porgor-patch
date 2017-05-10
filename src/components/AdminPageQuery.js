import React from 'react';
import './AdminPage.css';
import request from 'request';

const path = require("path");

export default class AdminPageQuery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {method:"add",object:"password",specifier:"red",value:"",serverResponse:"No query executed"};
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
            request.post({url:this.props.host.concat("/database"),form:{"method":method,"object":object,"specifier":specifier,"value":value}}, (err, res, body) => {
                if (err) {
                    console.log("Error in sending query.");
                    this.setState({ "serverResponse":err.statusCode });
                    setTimeout(() => {
                        this.setState({ "serverResponse":null })
                    }, 1000);
                } else {
                    console.log("Query successfully performed.");
                    this.setState({ "serverResponse":body });
                }
            });
        }

        const renderOptions = () => {
            if (this.state.method=="get") {
                return (
                    <div>
                        <label className="labelText">
                        Object: 
                        <select value={this.state.object} onChange={this.handleChangeObject}>
                            <option value="team">Team</option>
                            <option value="submission">Submissions</option>
                            <option value="password">Password</option>
                            <option value="question">Questions</option>
                        </select>
                        </label>
                    </div>
                )
            } else {
                return (
                    <div>
                        <label className="labelText">
                        Object: 
                        <select value={this.state.object} onChange={this.handleChangeObject}>
                            <option value="password">Password</option>
                            <option value="member">Member</option>
                            <option value="question">Question</option>
                        </select>
                        </label>
                    </div>
                )
            }
        }

        return (
            <div>
                <ul>
                    <form className="queryForm">
                        <li><label className="labelText">
                            Method:  
                            <select value={this.state.method} onChange={this.handleChangeMethod}>
                                <option value="add">ADD</option>
                                <option value="get">GET</option>
                            </select>
                        </label></li>
                        <li> 
                            {renderOptions()}
                        </li>
                        <li><label className="labelText">
                            Team:  
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
                <button className="queryButton" onClick={()=>sendQuery(this.state.method, this.state.object, this.state.specifier, this.state.value)}>Submit</button>
                <p className="queryResponse">{this.state.serverResponse}</p>
            </div>
        )
    }

}