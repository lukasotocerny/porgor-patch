import React from 'react';
import './Login.css';

export default class Login extends React.Component {

    render() {
        return (
            <div>
                <div className="headlineText">Login</div>
                <form>
                    <label>
                        Team:  
                        <select>
                            <option selected value="red">Red</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="blue">Blue</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label className="labelText">
                        Password:
                        <input className="inputLogin" type="text" name="name" />
                    </label>
                </form>
            </div>
        )
    }

}