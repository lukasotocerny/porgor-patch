import React, { Component } from 'react';
import './App.css';
import request from 'request';
import PatchTable from './PatchTable';
import TimeCountdown from './TimeCountdown';
import Login from './Login';
import MyQuestions from './MyQuestions.js';

const testTeam = { color:"admin", members:["lukas","ota"], questions:[{"number":1,"problem":"How are you?"}, {"number":2,"problem":"How old are you?"}] };

export default class App extends Component {

    constructor() {
        super();
        this.state = { "page":"login", "loggedIn":false, "team":null }; 
        this.getTeamData = this.getTeamData.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    getTeamData = (team, fn) => {
        console.log("Getting data from server for team".concat(team.toUpperCase(),"."));
        request.post({ url:"http://localhost:8080/getteamdata", form:{ "team":team } }, (err,res,body) => {
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
            this.getTeamData(team, (res) => {
                if (res) {
                    this.setState({ "loggedIn":true });
                    console.log("Retrived data successfully.")
                } else {
                    console.log("Retrived data unsuccessfully.");
                }
            });
        }

        const logOut = () => this.setState({ "loggedIn":false, "team":null });

        const linkClick = (arg) => this.setState({ "page":arg });

        const boxRender = () => {
            if (this.state.page=="countdown") {
                return (<TimeCountdown />);
            } else if (this.state.page=="patchtable") {
                return (<PatchTable />);
            } else if (this.state.page=="login") {
                return (<Login logIn={logIn} logOut={logOut} loggedIn={this.state.loggedIn} team={this.state.team}/>);
            } else if (this.state.page=="myquestions") {
                return (<MyQuestions updateState={this.updateState} loggedIn={this.state.loggedIn} team={this.state.team} />)
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