import React from 'react';
import './AdminPage.css';
import AdminTeams from './AdminTeams.js';
import AdminSubmissions from './AdminSubmissions.js';
import AdminQuestions from './AdminQuestions.js';

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { page:"teams" }
    }

    render() {
        const renderPage = () => {
            if (this.state.page=="teams") {
                return (<AdminTeams />);
            } else if (this.state.page=="submissions") {
                return (<AdminSubmissions />);
            } else {
                return (<AdminQuestions />);
            }
        }
        const changePage = (page) => {
            this.setState({"page":page});
        }
        return (
            <div className="adminPage">
                <ul>
                    <li><button onClick={()=>changePage("teams")}>Teams</button></li>
                    <li><button onClick={()=>changePage("submissions")}>Submissions</button></li>
                    <li><button onClick={()=>changePage("questions")}>Questions</button></li>
                </ul>
                { renderPage() }
            </div>
        )
    }

}