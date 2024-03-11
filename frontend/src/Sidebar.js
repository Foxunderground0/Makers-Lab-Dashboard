import React from 'react';
import "./Sidebar.css"

const Sidebar = ({ onItemClick, currentState }) => {
    const handleItemClick = (item) => {
        onItemClick(item);
    };

    return (
        <div className="sidebar">
            <div className="logo"></div>
            <button className={currentState === 'Tasks' ? 'selectedButton' : ''} onClick={() => handleItemClick('Tasks')}>
                Tasks
            </button>
            <button className={currentState === 'Machines' ? 'selectedButton' : ''} onClick={() => handleItemClick('Machines')}>
                Machines
            </button>
            <button className={currentState === 'Employees' ? 'selectedButton' : ''} onClick={() => handleItemClick('Employees')}>
                Employees
            </button>
        </div>
    );
};

export default Sidebar;
