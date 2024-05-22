import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Sidebar from './Sidebar';
import Main from './Main';
import Auth from './Auth';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentState, setCurrentState] = useState('Default');
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    setCurrentState(item);
  };


  // Read a cookie for the user's name. If it exists pass that to the Main component, else render an authentication form
  const user = Cookies.get('user');
  if (!user) {
    return (
      <>
        <div className="App-Auth">
          <div className="topBar-Auth">
            <h1>Makers Lab Logging Software</h1>
          </div>
          <div className="mainArea-Auth">
            <Auth />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="App">
          <div className="topBar">
            <h1>Makers Lab Logging Software</h1>
          </div>

          <Sidebar isOpen={sidebarOpen} onItemClick={handleSidebarItemClick} />

          <div className="mainArea">
            <Main state={currentState} user={user} />
          </div>
        </div>
      </>
    );
  }
}

export default App;
