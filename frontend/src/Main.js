import React, { useState, useEffect } from 'react';
import "./Main.css";

const Main = ({ state }) => {
    // State to store machine list
    const [machineList, setMachineList] = useState([]);

    // Effect to fetch machine list from the backend when the component mounts
    useEffect(() => {
        // Define a function to fetch machine data
        const fetchMachines = async () => {
            try {
                // Make a GET request to the backend endpoint
                const response = await fetch('http://localhost:8000/getMachines'); // Adjusted URL
                // Check if the response is successful
                if (!response.ok) {
                    throw new Error('Failed to fetch machines');
                }

                // Parse the response JSON
                const machines = await response.json();
                console.log(machines); // Log the fetched data
                // Update the machine list state
                setMachineList(machines);
            } catch (error) {
                console.error('Error fetching machines:', error);
            }
        };


        // Call the fetchMachines function
        fetchMachines();
    }, []); // Empty dependency array ensures the effect runs only once after initial render

    // Render the table rows based on the machine list
    const renderMachineRows = () => {
        return machineList.map(machine => (
            <div className="table-row" key={machine.id}>
                <div className="row-item">{machine.id}</div>
                <div className="row-item">{machine.name}</div>
                <div className="row-item">{machine.location}</div>
            </div>
        ));
    };

    // Define different sets of table rows based on different states
    const tables = {
        Tasks: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Task ID</div>
                    <div className="row-item">Task Name</div>
                    <div className="row-item">Assigned To</div>
                    <div className="row-item">Status</div>
                </div>
                <div className="table-row">
                    <div className="row-item">1</div>
                    <div className="row-item">Task 1</div>
                    <div className="row-item">John Doe</div>
                    <div className="row-item">Completed</div>
                </div>
                <div className="table-row">
                    <div className="row-item">2</div>
                    <div className="row-item">Task 2</div>
                    <div className="row-item">Jane Smith</div>
                    <div className="row-item">In Progress</div>
                </div>
            </>
        ),
        Machines: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Machine ID</div>
                    <div className="row-item">Machine Name</div>
                    <div className="row-item">Location</div>
                </div>
                {renderMachineRows()}
            </>
        ),
        Employees: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Employee ID</div>
                    <div className="row-item">Employee Name</div>
                    <div className="row-item">Department</div>
                    <div className="row-item">Role</div>
                </div>
                <div className="table-row">
                    <div className="row-item">1</div>
                    <div className="row-item">John Doe</div>
                    <div className="row-item">Engineering</div>
                    <div className="row-item">Engineer</div>
                </div>
                <div className="table-row">
                    <div className="row-item">2</div>
                    <div className="row-item">Jane Smith</div>
                    <div className="row-item">HR</div>
                    <div className="row-item">Manager</div>
                </div>
            </>
        )
    };

    return (
        <div className="main-container">
            <div className="table-container">
                {/* Render the appropriate table based on the state */}
                {tables[state]}
            </div>
        </div>
    );
};

export default Main;
