import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = ({ state }) => {
    const [machineList, setMachineList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1); // Reset page when state changes

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

        fetchData();
    }, [state]);

    const itemsPerPage = 15;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = state === 'Machines' ? machineList.slice(indexOfFirstItem, indexOfLastItem) : employeeList.slice(indexOfFirstItem, indexOfLastItem);

    const renderMachineRows = () => {
        return currentItems.map(machine => (
            <div className="table-row" key={machine.machine_id}>
                <div className="row-item">{machine.machine_id}</div>
                <div className="row-item">{machine.machine_name}</div>
                <div className="row-item">{machine.lab_name}</div>
            </div>
        ));
    };

    const renderEmployeeRows = () => {
        return currentItems.map(employee => (
            <div className="table-row" key={employee.employee_id}>
                <div className="row-item">{employee.employee_id}</div>
                <div className="row-item">{employee.name}</div>
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
                {renderPaginationButtons()}
            </>
        ),
        Employees: (
            <>
                <div className="table-row heading">
                    <div className="row-item">Employee ID</div>
                    <div className="row-item">Employee Name</div>
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
