import React, { Component } from 'react';
import './App.css';
import request from 'request';
import PatchTable from './PatchTable';
import TimeCountdown from './TimeCountdown';
import Login from './Login';
import MyQuestions from './MyQuestions.js';

const path = require("path");

const HOST = "https://porgor-patch.herokuapp.com";

export default class App extends Component {

    constructor() {
        super();
        this.state = { "page":"login", "loggedIn":false, "team":null, "scoreSheet":null, "bestSolvers":null }; 
        this.getTeamData = this.getTeamData.bind(this);
        this.getScoreSheet = this.getScoreSheet.bind(this);
        this.updateState = this.updateState.bind(this);
        this.getScoreSheet();
    }

    getTeamData = (team, fn) => {
        console.log("Getting team data from server for team".concat(team.toUpperCase(),"."));
        request.post({ url:HOST.concat("/getteamdata"), form:{ "team":team } }, (err,res,body) => {
            if (body) {
                let data = JSON.parse(body);
                this.setState({ "team":data });
                fn(true);
            } else {
                this.setState({ "loggedIn":false, "team":null });
                fn(false);
            }
        })
    }

    getScoreSheet = () => {
        console.log("Getting score sheet from server.");
        request.get(HOST.concat("/getscoresheet"), (err,res,body) => {
            if (body) {
                let data = JSON.parse(body);
                this.setState({ "scoreSheet":data });
                console.log("Getting best solvers from server.");
                request.get(HOST.concat("/getbestsolvers"), (errr, ress, bodyy) => {
                    if (bodyy) {
                        let dataa = JSON.parse(bodyy);
                        this.setState({ "bestSolvers":dataa });
                        console.log("Data successfully retrieved.");
                    } else {
                        this.setState({ "bestSolvers":null });
                    }
                })
            } else {
                this.setState({ "scoreSheet":null });
            }
        })
    }

    updateState = (fn) => {
        console.log("Updating app's state.");
        this.getTeamData(this.state.team.color, (res) => {
            if (res) {
                console.log("Successfully updated.");
                fn(res);
            } else {
                console.log("Unsuccessfully updated.");
                fn(res);
            }
        });
    }

    render() {
        const logIn = (team, members) => {
            if (team=="admin") {
                this.setState({"loggedIn":true, "team":{"color":"admin"}});
            } else {
                this.getTeamData(team, (res) => {
                    if (res) {
                        this.setState({ "loggedIn":true });
                        console.log("Retrived team data successfully.");
                    } else {
                        console.log("Retrived team data unsuccessfully.");
                    }
                });
            }
        }

        const logOut = () => this.setState({ "loggedIn":false });

        const linkClick = (arg) => this.setState({ "page":arg });

        const boxRender = () => {
            if (this.state.page=="countdown") {
                return (<TimeCountdown />);
            } else if (this.state.page=="patchtable") {
                return (<PatchTable host={HOST} updateScoreSheet={this.getScoreSheet} scoreSheet={this.state.scoreSheet} bestSolvers={this.state.bestSolvers} />);
            } else if (this.state.page=="login") {
                return (<Login host={HOST} logIn={logIn} logOut={logOut} loggedIn={this.state.loggedIn} team={this.state.team}/>);
            } else if (this.state.page=="myquestions") {
                return (<MyQuestions host={HOST} updateState={this.updateState} loggedIn={this.state.loggedIn} team={this.state.team} />)
            } else {
                return (<TimeCountdown />);
            }
        }

        return (
          <div className="App">
            <div className="App-header">
              <h2>Porgor Patch 2017</h2>
              <ul>
                <li><button onClick={()=>linkClick("login")}>Log in</button></li>
                <li><button onClick={()=>linkClick("patchtable")}>Scoreboard</button></li>
                <li><button onClick={()=>linkClick("myquestions")}>My Questions</button></li>
              </ul>
            </div>
            <div className="App-box">
              { boxRender() }
            </div>
          </div>
        );
    }
}