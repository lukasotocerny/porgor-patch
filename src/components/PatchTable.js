import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TeamRow from './TeamRow.js';
import './PatchTable.css';

const solvers = ["lukas cerny 12", "leonard euler 8", "carl gauss 3"];

export default class PatchTable extends React.Component {

    constructor(props) {
        super(props);
        this.props.updateScoreSheet();
    }

    render() {

        return (
            <div style={{paddingTop:15,marginRight:10}}>
                <ul>
                    <li className="teamDescriptionNameBox">Team</li>
                    <li className="teamDescriptionNameBox">Points</li>
                    {Object.keys(this.props.scoreSheet.red.questions).map((el,i) => <li className="teamDescriptionPointsBox">{i+1}</li>)}
                </ul>
                {Object.keys(this.props.scoreSheet).map(key =>
                    <TeamRow color={this.props.scoreSheet[key].color} questions={this.props.scoreSheet[key].questions} points={this.props.scoreSheet[key].points} />
                )}
                <div className="solversHeadline">Best Solvers</div>
                {(this.props.bestSolvers) ? this.props.bestSolvers.map((el) => (<div className="solvers">{el.solver} --- {el.number}</div>)) : null}
            </div>
        )
    }

}