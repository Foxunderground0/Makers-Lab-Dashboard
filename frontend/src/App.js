import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('checking'); // Initial state: checking backend status

  useEffect(() => {
    // Function to check backend status
    const checkBackendStatus = async () => {
      try {
        // Send a GET request to the backend
        const response = await fetch('/');

        // Check if response is successful (status code 2xx)
        if (response.ok) {
          setBackendStatus('online'); // Backend is online
        } else {
          setBackendStatus('unavailable'); // Backend is unavailable
        }
      } catch (error) {
        console.error('Error checking backend status:', error);
        setBackendStatus('unavailable'); // Backend is unavailable due to error
      }
    };

    // Call the checkBackendStatus function when component mounts
    checkBackendStatus();
  }, []); // Empty dependency array ensures useEffect runs only once after initial render

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {backendStatus === 'online' ? ( // Display different content based on backend status
          <p>
            Backend is online! Edit <code>src/App.js</code> and save to reload.
          </p>
        ) : backendStatus === 'unavailable' ? (
          <p>
            Backend is unavailable. Please try again later.
          </p>
        ) : (
          <p>
            Checking backend status...
          </p>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
