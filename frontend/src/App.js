import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Main from './Main';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentState, setCurrentState] = useState('Default');
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    setCurrentState(item);
  };

  return (
    <div className="App">
      <div className="topBar">
        <h1>Makers Lab Logging Software</h1>
      </div>

      <Sidebar isOpen={sidebarOpen} onItemClick={handleSidebarItemClick} />

      <div className="mainArea">
        {/* Display current state */}
        <Main state={currentState} user={"Ali"} />
      </div>
    </div>
  );
}

export default App;
