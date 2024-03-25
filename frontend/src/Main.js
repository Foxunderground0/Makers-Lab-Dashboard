import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = ({ state }) => {

    const [taskList, setTaskList] = useState([]);
    const [machineList, setMachineList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newEmployee, setNewEmployee] = useState({ id: '', name: '' }); // State to store new employee data
    const [newMachine, setNewMachine] = useState({ id: '', name: '', location: '' }); // State to store new machine data

    useEffect(() => {
        setCurrentPage(1); // Reset page when state changes
        fetchData();
    }, [state]);

    // Find the maximum ID from the employeeList array
    useEffect(() => {
        const maxId = employeeList.reduce((max, employee) => (employee.employee_id > max ? employee.employee_id : max), 0);
        // Set the default ID to the maximum ID + 1
        setNewEmployee(prevState => ({ ...prevState, id: maxId + 1 }));
    }, [employeeList]);

    // Find the maximum ID from the machineList array
    useEffect(() => {
        const maxId = machineList.reduce((max, machine) => (machine.machine_id > max ? machine.machine_id : max), 0);
        // Set the default ID to the maximum ID + 1
        setNewMachine(prevState => ({ ...prevState, id: maxId + 1 }));
    }, [machineList]);

    const itemsPerPage = 15;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state === 'Machines' ? machineList.slice(indexOfFirstItem, indexOfLastItem)
        : state === 'Employees' ? employeeList.slice(indexOfFirstItem, indexOfLastItem)
            : taskList.slice(indexOfFirstItem, indexOfLastItem);


    const fetchData = async () => {
        try {
            let url;
            switch (state) {
                case 'Tasks':
                    url = 'http://localhost:8000/getTasks';
                    break;
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
                } else if (state === 'Tasks') {
                    setTaskList(data);
                }
            }
        } catch (error) {
            console.error(`Error fetching ${state}:`, error);
        }
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
            const response = await fetch(`http://localhost:8000/deleteEmployee`, {
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

    const handleAddMachine = async () => {
        try {
            // Check if the newMachine ID already exists
            const idExists = machineList.some(machine => machine.machine_id === newMachine.id);
            if (idExists) {
                console.error('Error adding machine: ID already exists');
                return; // Exit the function if ID already exists
            }

            const response = await fetch('http://localhost:8000/addMachine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMachine) // Send newMachine data as JSON
            });

            if (!response.ok) {
                throw new Error('Failed to add machine');
            }

            // Clear the input fields after successful addition
            setNewMachine({ id: '', name: '', location: '' });
            // Refetch machine data to update the list
            await fetchData();
        } catch (error) {
            console.error('Error adding machine:', error);
        }
    };

    const handleDeleteMachine = async (machineId) => {
        try {
            const response = await fetch(`http://localhost:8000/deleteMachine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ machineId: machineId }) // Wrap employeeId in an object
            });

            if (!response.ok) {
                throw new Error(`Failed to delete machine with ID ${machineId}`);
            }

            // Filter out the deleted machine from the machineList based on machine_id
            setMachineList(prevMachineList => prevMachineList.filter(machine => machine.machine_id !== machineId));

        } catch (error) {
            console.error('Error deleting machine:', error);
        }
    };

    const renderMachineRows = () => {
        // Sort the machines by machine_id
        const sortedMachines = currentItems.sort((a, b) => a.machine_id - b.machine_id);
        return sortedMachines.map(machine => (
            <div className="table-row" key={machine.machine_id}>
                <div className="row-item">{machine.machine_id}</div>
                <div className="row-item">{machine.machine_name}</div>
                <div className="row-item">{machine.lab_name}</div>
                <div className="row-item"><div className='trashIcon' onClick={() => handleDeleteMachine(machine.machine_id)}></div></div>
            </div>
        ));
    };

    // Sort the tasks by ID
    const renderTaskRows = () => {
        // Sort the tasks by their index
        const sortedTasks = currentItems.sort((a, b) => a.Index - b.Index);
        console.log(sortedTasks);
        return sortedTasks.map(task => (
            <div className="table-row" key={task.Index}>
                <div className="row-item">{task.Index}</div>
                <div className="row-item">{task.Task}</div>
                <div className="row-item">{task['Invoice ID']}</div>
                <div className="row-item">{new Date(task.Date).toLocaleDateString()}</div>
                <div className="row-item">{task['Invoice File Name']}</div>
                <div className="row-item">{task['Task Description']}</div>
                <div className="row-item">{task['Customer Name']}</div>
                <div className="row-item">{task['Customer Email']}</div>
                <div className="row-item">{task.Cost}</div>
                <div className="row-item">{task['Initial Approval'] ? 'Approved' : 'Not Approved'}</div>
                <div className="row-item">{task['Completion Status'] ? 'Completed' : 'Not Completed'}</div>
                <div className="row-item">{task['Invoice Approval'] ? 'Approved' : 'Not Approved'}</div>
                <div className="row-item">{task['Payment Status'] ? 'Paid' : 'Not Paid'}</div>
            </div>
        ));
    };

    const renderPaginationButtons = () => {
        const shouldDisplayButtons = state === 'Machines' ? machineList.length > itemsPerPage
            : state === 'Employees' ? employeeList.length > itemsPerPage
                : taskList.length > itemsPerPage;

        if (!shouldDisplayButtons) {
            return null;
        }

        return (
            <div className="pagination-buttons">
                <button onClick={() => handleClick('prev')} disabled={currentPage === 1}>Previous</button>
                <button onClick={() => handleClick('next')} disabled={state === 'Machines' ? indexOfLastItem >= machineList.length
                    : state === 'Employees' ? indexOfLastItem >= employeeList.length
                        : indexOfLastItem >= taskList.length}>Next</button>
            </div>
        );
    };


    const tables = {
        Tasks: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Task ID</div>
                    <div className="row-item">Task Name</div>
                    <div className="row-item">Invoice ID</div>
                    <div className="row-item">Date</div>
                    <div className="row-item">Invoice File Name</div>
                    <div className="row-item">Task Description</div>
                    <div className="row-item">Customer Name</div>
                    <div className="row-item">Customer Email</div>
                    <div className="row-item">Cost</div>
                    <div className="row-item">Initial Approval</div>
                    <div className="row-item">Completion Status</div>
                    <div className="row-item">Invoice Approval</div>
                    <div className="row-item">Payment Status</div>
                    <div className="row-item">Action</div>
                </div>

                {renderTaskRows()}
                {renderPagiationButtons()}
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
                <div className='table-row'>
                    <div className="row-item">
                        <input type="text" placeholder="ID" name="id" value={newMachine.id} onChange={(e) => setNewMachine({ ...newMachine, id: e.target.value })} />
                    </div>
                    <div className="row-item">
                        <input type="text" placeholder="Name" name="name" value={newMachine.name} onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })} />
                    </div>
                    <div className="row-item">
                        <input type="text" placeholder="Location" name="location" value={newMachine.location} onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })} />
                    </div>
                    <div className="row-item">
                        <div className='plusIcon' onClick={handleAddMachine}></div>
                    </div>
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
                    <div className="row-item">
                        <input
                            type="text"
                            placeholder="ID"
                            name="id"
                            value={newEmployee.id}
                            onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                        />
                    </div>
                    <div className="row-item">
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        />
                    </div>
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
