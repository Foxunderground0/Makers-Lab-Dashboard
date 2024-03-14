import React, { useState, useEffect } from 'react';
import "./Main.css";

const Main = ({ state }) => {
    // State to store machine list
    const [machineList, setMachineList] = useState([]);

    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        // Define a function to fetch data based on the state
        const fetchData = async () => {
            try {
                let url;
                switch (state) {
                    case 'Machines':
                        url = 'http://localhost:8000/getMachines';
                        break;
                    case 'Employees':
                        url = 'http://localhost:8000/getEmployees';
                        break;
                    // Add more cases for other states if needed
                    default:
                        url = null; // Set a default value if state doesn't match any case
                }
                // Check if the URL is defined
                if (url) {
                    // Make a GET request to the backend endpoint
                    const response = await fetch(url);
                    // Check if the response is successful
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${state}`);
                    }
                    // Parse the response JSON
                    const data = await response.json();
                    console.log(data); // Log the fetched data
                    // Update the corresponding list state
                    if (state === 'Machines') {
                        setMachineList(data);
                    } else if (state === 'Employees') {
                        setEmployeeList(data);
                    }
                    // Add more conditions for other states if needed
                }
            } catch (error) {
                console.error(`Error fetching ${state}:`, error);
            }
        };

        // Call the fetchData function
        fetchData();
    }, [state]); // Include state in the dependency array to run the effect whenever state changes

    // Render the table rows based on the machine list
    const renderMachineRows = () => {
        return machineList.map(machine => (
            <div className="table-row" key={machine.machine_id}>
                <div className="row-item">{machine.machine_id}</div>
                <div className="row-item">{machine.machine_name}</div>
                <div className="row-item">{machine.lab_name}</div>
            </div>
        ));
    };

    const renderEmployeeRows = () => {
        return employeeList.map(employee => (
            <div className="table-row" key={employee.employee_id}>
                <div className="row-item">{employee.employee_id}</div>
                <div className="row-item">{employee.name}</div>
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
                    <div className="row-item small-row-item">Status</div>
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
                    <div className="row-item"><div className='trashIcon'></div></div>
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
                </div>
                {renderEmployeeRows()}
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
