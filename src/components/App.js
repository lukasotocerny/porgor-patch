import React, { Component } from 'react';
import './App.css';
import PatchTable from './PatchTable';
import TimeCountdown from './TimeCountdown';
import Login from './Login';
import MyQuestions from './MyQuestions.js';

export default class App extends Component {

    constructor() {
        super();
        this.state = { page:"login", loggedIn:true, teamLoggedIn:"admin", teamMembers:["lukas","ota"] }; 
    }

    render() {
        const logIn = (team, members) => this.setState({ loggedIn:true, teamLoggedIn:team, teamMembers:members });
        const logOut = () => this.setState({ loggedIn:false, teamMembers:null, teamLoggedIn:null });
        const linkClick = (arg) => this.setState({ page:arg });
        const boxRender = () => {
            if (this.state.page=="countdown") {
                return (<TimeCountdown />);
            } else if (this.state.page=="patchtable") {
                return (<PatchTable />);
            } else if (this.state.page=="login") {
                return (<Login logIn={logIn} logOut={logOut} loggedIn={this.state.loggedIn} teamLoggedIn={this.state.teamLoggedIn}/>);
            } else if (this.state.page=="myquestions") {
                return (<MyQuestions loggedIn={this.state.loggedIn} teamLoggedIn={this.state.teamLoggedIn} teamMembers={this.state.teamMembers} />)
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
              {boxRender()}
            </div>
          </div>
        );
    }
}