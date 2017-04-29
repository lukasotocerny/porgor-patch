import React from 'react';

export default class TeamRow extends React.Component {

    render() {

        const heightBox = 30;

        const teamBox = {
            height: heightBox,
            margin: 2,
            fontSize: '16',
            display: 'inline-block',
            textAlign: 'center',
            border: "1px solid black",
            verticalAlign: 'middle'
        };
        const teamNameBox = {...teamBox, width: 80};
        const teamPointsBox = {...teamBox, width: heightBox};
        const teamColorBox = {...teamNameBox, backgroundColor: this.props.color};
        const teamCorrectBox = {...teamPointsBox, backgroundColor: this.props.color};

        const correctPoint = answer => {
            if (answer=="correct") {
                return (<li style={teamCorrectBox}>O</li>)
            } else {
                return (<li style={teamPointsBox}>{answer}</li>)
            }
        }

        return (
            <ul>
                <li style={teamColorBox}>{this.props.color}</li>
                <li style={teamNameBox}>{this.props.points}</li>
                {Object.values(this.props.questions).map(answer=>correctPoint(answer))}
            </ul>
        )
    }

}