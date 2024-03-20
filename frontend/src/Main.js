import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = ({ state }) => {
    const [machineList, setMachineList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newEmployee, setNewEmployee] = useState({ id: '', name: '' }); // State to store new employee data

    useEffect(() => {
        setCurrentPage(1); // Reset page when state changes
        fetchData();
    }, [state]);

    useEffect(() => {
        // Find the maximum ID from the employeeList array
        const maxId = employeeList.reduce((max, employee) => (employee.employee_id > max ? employee.employee_id : max), 0);
        // Set the default ID to the maximum ID + 1
        setNewEmployee(prevState => ({ ...prevState, id: maxId + 1 }));
    }, [employeeList]);

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
                default:
                    url = null;
            }
            if (url) {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${state}`);
                }
                const data = await response.json();
                if (state === 'Machines') {
                    setMachineList(data);
                } else if (state === 'Employees') {
                    setEmployeeList(data);
                }
            }
        } catch (error) {
            console.error(`Error fetching ${state}:`, error);
        }
    };

    const itemsPerPage = 15;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state === 'Machines' ? machineList.slice(indexOfFirstItem, indexOfLastItem) : employeeList.slice(indexOfFirstItem, indexOfLastItem);

    const renderMachineRows = () => {
        // Sort the machines by machine_id
        const sortedMachines = currentItems.sort((a, b) => a.machine_id - b.machine_id);
        return sortedMachines.map(machine => (
            <div className="table-row" key={machine.machine_id}>
                <div className="row-item">{machine.machine_id}</div>
                <div className="row-item">{machine.machine_name}</div>
                <div className="row-item">{machine.lab_name}</div>
                <div className="row-item"><div className='trashIcon'></div></div>
            </div>
        ));
    };

    const renderEmployeeRows = () => {
        // Sort the employees by employee_id
        const sortedEmployees = currentItems.sort((a, b) => a.employee_id - b.employee_id);
        return sortedEmployees.map(employee => (
            <div className="table-row" key={employee.employee_id}>
                <div className="row-item">{employee.employee_id}</div>
                <div className="row-item">{employee.name}</div>
                <div className="row-item">
                    <div className='trashIcon' onClick={() => handleDeleteEmployee(employee.employee_id)}></div>
                </div>
            </div>
        ));
    };


    const handleClick = (type) => {
        if (type === 'next') {
            setCurrentPage(currentPage + 1);
        } else if (type === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAddEmployee = async () => {
        try {
            // Check if the newEmployee ID already exists
            const idExists = employeeList.some(employee => employee.employee_id === newEmployee.id);
            if (idExists) {
                console.error('Error adding employee: ID already exists');
                return; // Exit the function if ID already exists
            }

            const response = await fetch('http://localhost:8000/addEmployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEmployee) // Send newEmployee data as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            // Clear the input fields after successful addition
            setNewEmployee({ id: '', name: '' });
            // Refetch employee data to update the list
            await fetchData();
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };


    const handleDeleteEmployee = async (employeeId) => {
        try {
            const response = await fetch(`http://localhost:8000/deleteEmployee/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // Add any other headers if needed
                },
                body: JSON.stringify({ employeeId: employeeId }) // Wrap employeeId in an object
            });

            if (!response.ok) {
                throw new Error(`Failed to delete employee with ID ${employeeId}`);
            }

            // Filter out the deleted employee from the employeeList based on employee_id
            setEmployeeList(prevEmployeeList => prevEmployeeList.filter(employee => employee.employee_id !== employeeId));

        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };


    const renderPaginationButtons = () => {
        const shouldDisplayButtons = state === 'Machines' ? machineList.length > itemsPerPage : employeeList.length > itemsPerPage;

        if (!shouldDisplayButtons) {
            return null;
        }

        return (
            <div className="pagination-buttons">
                <button onClick={() => handleClick('prev')} disabled={currentPage === 1}>Previous</button>
                <button onClick={() => handleClick('next')} disabled={state === 'Machines' ? indexOfLastItem >= machineList.length : indexOfLastItem >= employeeList.length}>Next</button>
            </div>
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({ ...prevState, [name]: value }));
    };

    const tables = {
        Tasks: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Task ID</div>
                    <div className="row-item">Task Name</div>
                    <div className="row-item">Assigned To</div>
                    <div className="row-item small-row-item">Action</div>
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
                    <div className="row-item small-row-item">Action</div>
                </div>

                {renderMachineRows()}
                {renderPaginationButtons()}
            </>
        ),
        Employees: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Employee ID</div>
                    <div className="row-item">Employee Name</div>
                    <div className="row-item small-row-item">Action</div>
                </div>
                <div className='table-row'>
                    <div className="row-item"><input type="text" placeholder="ID" name="id" value={newEmployee.id} onChange={handleInputChange}></input></div>
                    <div className="row-item"><input type="text" placeholder="Name" name="name" value={newEmployee.name} onChange={handleInputChange}></input></div>
                    <div className="row-item">
                        <div className='plusIcon' onClick={handleAddEmployee}></div>
                    </div>
                </div>

                {renderEmployeeRows()}
                {renderPaginationButtons()}
            </>
        )
    };

    return (
        <div className="main-container">
            <div className="table-container">
                {tables[state]}
            </div>
        </div>
    );
};

export default Main;
