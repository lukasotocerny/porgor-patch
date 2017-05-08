import React from 'react';

export default class TeamRow extends React.Component {

    render() {

        const correctPoint = question => {
            if ( question.correct ) {
                return (<li className="teamPointsBox" style={{backgroundColor: this.props.color}}>{question.attempts}</li>)
            } else {
                return (<li className="teamPointsBox">{question.attempts}</li>)
            }
        }

        return (
            <ul>
                <li className="teamNameBox" style={{backgroundColor: this.props.color}}>{this.props.color}</li>
                <li className="teamTotalPointsBox">{this.props.points}</li>
                {Object.values(this.props.questions).map(question => correctPoint(question))}
            </ul>
        )
    }

}