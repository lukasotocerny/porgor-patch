import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TeamRow from './TeamRow.js';

const datab = require('../data/database.js');

export default class PatchTable extends React.Component {

    render() {

        const teamBox = {
            height: 10,
            width: 80,
            padding: 1,
            margin: 2,
            fontSize: '16',
            display: 'inline-block',
            textAlign: 'center',
        };
        const teamNameBox = {...teamBox, width: 80,fontWeight: "bold"};
        const teamPointsBox = {...teamBox, width: 30, fontWeight: "bold"};
        const solversHeadline = {
            marginTop: 30,
            marginBottom: 10,
            textTransform: "uppercase",
            fontWeight: "bold"
        }

        const teams = datab.scoreSheet;

        return (
            <div style={{paddingTop:15,marginRight:10}}>
                <ul>
                    <li style={teamNameBox}>Team</li>
                    <li style={teamNameBox}>Points</li>
                    {Object.keys(teams[0].questions).map((el,i) => <li style={teamPointsBox}>{i+1}</li>)}
                </ul>
                {teams.map(team =>
                    <TeamRow color={team.color} questions={team.questions} points={team.points} />
                )}
                <div style={solversHeadline}>Best Solvers</div>

                <div>lukas cerny - 12 questions</div>
                <div>leonard euler - 9 questions</div>
                <div>carl gauss - 3 questions</div>
            </div>
        )
    }

}