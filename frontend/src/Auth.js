import React, { useState } from 'react';
import cookies from 'js-cookie';
import logo from './logo.png'; // Import the NIC logo image

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const formContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    };

    const formStyle = {
        maxWidth: '300px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    };

    const inputStyle = {
        width: '100%',
        marginBottom: '10px',
        padding: '8px',
        boxSizing: 'border-box',
        borderRadius: '3px',
        border: '1px solid #ccc',
    };

    const buttonStyle = {
        width: '100%',
        backgroundColor: '#00242b',
        color: 'white',
        padding: '10px 20px',
        margin: '8px 0',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const logoStyle = {
        width: '40%',
        marginBottom: '20px',
        animation: 'spin 150s linear infinite',
        display: 'block',
        margin: 'auto', // Align center horizontally
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your authentication logic here
        if (username && password) {
            cookies.set('user', username, { expires: 0.1 });
            window.location.reload();
        } else {
            alert('Please enter both username and password');
        }
    };

    return (
        <div style={formContainerStyle}>
            <div style={formStyle}>
                <img src={logo} alt="NIC Logo" style={logoStyle} />
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username:
                        <input
                            type="text"
                            id="username"
                            style={inputStyle}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label htmlFor="password">
                        Password:
                        <input
                            type="password"
                            id="password"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit" style={buttonStyle}>
                        Login
                    </button>
                </form>
                <p>Software Version 1.1</p>
            </div>
        </div>
    );
};

export default Auth;

