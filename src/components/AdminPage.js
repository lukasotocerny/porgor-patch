import React from 'react';
import './AdminPage.css';
import AdminPageQuery from './AdminPageQuery.js';
import AdminPageResult from './AdminPageResult.js';

export default class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { result: false }
    }

    render() {
        const renderPage = () => (this.state.result) ? (<AdminPageResult />) : (<AdminPageQuery />);

        const getQuery = () => this.setState({ result: true });

        return (
            <div className="adminPage">
                {renderPage()}
            </div>
        )
    }

}