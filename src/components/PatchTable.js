import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TeamRow from './TeamRow.js';
import './PatchTable.css';

const datab = require('../data/database.js');

export default class PatchTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const teams = {"red":{"color":"red","points":4,"questions":{"1":{"correct":true,"attempts":2},"2":{"correct":true,"attempts":2},"3":{"correct":true,"attempts":2},"4":{"correct":true,"attempts":2},
        "5":{"correct":true,"attempts":2},"6":{"correct":true,"attempts":2},"7":{"correct":true,"attempts":2},"8":{"correct":true,"attempts":2},"9":{"correct":true,"attempts":2},"10":{"correct":true,"attempts":2}}},
        "blue":{"color":"blue","points":4,"questions":{"1":{"correct":true,"attempts":2},"2":{"correct":true,"attempts":2},"3":{"correct":true,"attempts":2},"4":{"correct":true,"attempts":2},
        "5":{"correct":true,"attempts":2},"6":{"correct":true,"attempts":2},"7":{"correct":true,"attempts":2},"8":{"correct":true,"attempts":2},"9":{"correct":true,"attempts":2},"10":{"correct":true,"attempts":2}}},
        "black":{"color":"black","points":4,"questions":{"1":{"correct":true,"attempts":2},"2":{"correct":true,"attempts":2},"3":{"correct":true,"attempts":2},"4":{"correct":true,"attempts":2},
        "5":{"correct":true,"attempts":2},"6":{"correct":true,"attempts":2},"7":{"correct":true,"attempts":2},"8":{"correct":true,"attempts":2},"9":{"correct":true,"attempts":2},"10":{"correct":true,"attempts":2}}},
        "white":{"color":"white","points":4,"questions":{"1":{"correct":true,"attempts":2},"2":{"correct":true,"attempts":2},"3":{"correct":true,"attempts":2},"4":{"correct":true,"attempts":2},
        "5":{"correct":true,"attempts":2},"6":{"correct":true,"attempts":2},"7":{"correct":true,"attempts":2},"8":{"correct":true,"attempts":2},"9":{"correct":true,"attempts":2},"10":{"correct":true,"attempts":2}}}}

        return (
            <div style={{paddingTop:15,marginRight:10}}>
                <ul>
                    <li className="teamDescriptionNameBox">Team</li>
                    <li className="teamDescriptionNameBox">Points</li>
                    {Object.keys(teams.red.questions).map((el,i) => <li className="teamDescriptionPointsBox">{i+1}</li>)}
                </ul>
                {Object.keys(teams).map(key =>
                    <TeamRow color={teams[key].color} questions={teams[key].questions} points={teams[key].points} />
                )}
                <div className="solversHeadline">Best Solvers</div>

                <div>lukas cerny - 12 questions</div>
                <div>leonard euler - 9 questions</div>
                <div>carl gauss - 3 questions</div>
            </div>
        )
    }

}