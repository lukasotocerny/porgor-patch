import React, { Component } from 'react';
import './App.css';
import PatchTable from './PatchTable';
import TimeCountdown from './TimeCountdown';
import Login from './Login';

export default class App extends Component {

  constructor() {
    super();
    this.state = { page: "countdown" };
  }

  render() {
    const boxRender = () => {
        if (this.state.page=="countdown") {
            return (<TimeCountdown />);
        } else if (this.state.page=="patchtable") {
            return (<PatchTable />);
        } else if (this.state.page=="login") {
            return (<Login />);
        } else {
            return (<TimeCountdown />);
        }
    }

    const linkClick = (arg) => {
        this.setState({page:arg});
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Porgor Patch 2017</h2>
          <ul>
            <li><button onClick={()=>linkClick("login")}>Log in</button></li>
            <li><button onClick={()=>linkClick("patchtable")}>Scoreboard</button></li>
            <li><button onClick={()=>linkClick("countdown")}>My Questions</button></li>
          </ul>
        </div>
        <div className="App-box">
          {boxRender()}
        </div>
      </div>
    );
  }
}