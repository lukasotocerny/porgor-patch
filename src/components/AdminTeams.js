import React from 'react';
import './AdminPage.css';

const teams = {
    "red": 
        {
            "color":"red",
            "points":4,
            "members": ["lukas", "pavel","adam"],
            "questions":{"1":"correct","2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}
    },
    "white":
        {
            "color":"white",
            "points":0,
            "members": ["lukas", "pavel","adam"],
            "questions":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}
        },
    "blue":
        {
            "color":"blue",
            "points":0,
            "members": ["lukas", "pavel","adam"],
            "questions":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}
        },
    "black":
        {
            "color":"black",
            "points":0,
            "members": ["lukas", "pavel","adam"],
            "questions":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0}
        }
}

export default class AdminTeams extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {Object.keys(teams).map((e,i) => {
                    return (
                        <div className="adminTeams">
                            <p>
                                <span className="adminPageBold">Team: {e}</span>
                            </p>
                            <ul><span className="adminPageBold">Members: </span>{teams[e].members.map((member,i1) => (<li className="adminTeamsMembers">{member}, </li>))}
                            </ul>
                        </div>
                    )
                })}
            </div>
        )
    }

}