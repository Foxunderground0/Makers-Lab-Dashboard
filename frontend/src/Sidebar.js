import React from 'react';
import "./Sidebar.css"

const Sidebar = ({ onItemClick, currentState, user }) => {
    const handleItemClick = (item) => {
        onItemClick(item);
    };

    return (
        <div className="sidebar">
            <div className="logo"></div>
            {/* // If user is Admin, display the buttons for HR Consumption and Machine Consumption */}

            {user === 'Admin' && (
                <div>
                    <button className={currentState === 'HR Consumption' ? 'selectedButton' : ''} onClick={() => handleItemClick('HR Consumption')}>
                        HR Consumption
                    </button>
                    <button className={currentState === 'Machine Consumption' ? 'selectedButton' : ''} onClick={() => handleItemClick('Machine Consumption')}>
                        Machine Consumption
                    </button>
                </div>
            )}

            <button className={currentState === 'Logs' ? 'selectedButton' : ''} onClick={() => handleItemClick('Logs')}>
                Logs
            </button>
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
