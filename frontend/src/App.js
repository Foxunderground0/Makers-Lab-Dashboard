import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar'; // Import Sidebar component

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="App">
      <div className="topbar">
        <h1>Makers Lab Logging Software</h1>
      </div>

      {/* Render Sidebar component */}
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        {/* Blank main display panel */}
      </div>

    </div>
  );
}

export default App;
