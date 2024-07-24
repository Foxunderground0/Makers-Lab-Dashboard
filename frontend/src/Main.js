import React, { useState, useEffect } from 'react';
import './Main.css';

const Main = ({ state, user }) => {

	// const startDate = '2021-01-01';
	// const endDate = '2024-12-31';
	const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
	const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);


	const [taskList, setTaskList] = useState([]);
	const [machineList, setMachineList] = useState([]);
	const [employeeList, setEmployeeList] = useState([]);
	const [logList, setLogList] = useState([]);
	const [logListTaskDropdown, setLogListTaskDropdown] = useState([]);
	const [logListMachineDropdown, setLogListMachineDropdown] = useState([]);
	const [hrConsumption, setHRConsumption] = useState([]);
	const [machineConsumption, setMachineConsumption] = useState([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [newEmployee, setNewEmployee] = useState({ id: '', name: '' }); // State to store new employee data
	const [newMachine, setNewMachine] = useState({ id: '', name: '', location: '' }); // State to store new machine data
	const [newTask, setNewTask] = useState({ id: "", name: "", invoiceId: "", date: "", invoiceFileName: "", taskDescription: "", customerName: "", customerEmail: "", cost: "", initialApproval: "", completionStatus: "", invoiceApproval: "", paymentStatus: "" });
	const [newLog, setNewLog] = useState({ id: '', employeeName: user, date: '', taskId: '', hours: '', machine: "", machineHours: '', notes: '' });

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

	useEffect(() => {
		const maxId = machineList.reduce((max, machine) => (machine.machine_id > max ? machine.machine_id : max), 0);
		// Set the default ID to the maximum ID + 1
		setNewMachine(prevState => ({ ...prevState, id: maxId + 1 }));
	}, [machineList]);

	//find the maximum ID from the taskList array
	useEffect(() => {
		const maxId = taskList.reduce((max, task) => (task.Index > max ? task.Index : max), 0);
		// Set the default ID to the maximum ID + 1
		setNewTask(prevState => ({ ...prevState, id: maxId + 1 }));
		// Set the default date to the current date
		setNewTask(prevState => ({ ...prevState, date: new Date().toISOString().split('T')[0] }));
	}, [taskList]);

	// Find the maximum ID from the logList array
	useEffect(() => {
		const maxId = logList.reduce((max, log) => (log.id > max ? log.id : max), 0);
		// Set the default ID to the maximum ID + 1
		setNewLog(prevState => ({ ...prevState, id: maxId + 1 }));
		// Set the default date to the current date
		setNewLog(prevState => ({ ...prevState, date: new Date().toISOString().split('T')[0] }));
	}, [logList]);


	useEffect(() => {
		fetchData();
	}, [state, startDate, endDate]);

	let itemsPerPage;
	if (state === 'Tasks') {
		itemsPerPage = 8;
	} else {
		itemsPerPage = 15;
	}

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	// Function to get current items based on the state
	const getCurrentItems = () => {
		const listMap = {
			'Machines': machineList,
			'Employees': employeeList,
			'Tasks': taskList,
			'Logs': logList
		};

		const currentList = listMap[state] || [];
		return currentList.slice(indexOfFirstItem, indexOfLastItem);
	};

	// Get the current items
	const currentItems = getCurrentItems();

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
				case 'Logs':
					url = `http://localhost:8000/getLogs?user=${user}`;
					break;
				case "HR Consumption":
					url = `http://localhost:8000/getHRConsumption?startDate=${startDate}&endDate=${endDate}`;
					break;
				case "Machine Consumption":
					url = `http://localhost:8000/getMachineConsumption?startDate=${startDate}&endDate=${endDate}`;
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
				} else if (state === 'Logs') {
					setLogList(data.logs);
					setLogListTaskDropdown(data.invoiceID);
					setLogListMachineDropdown(data.machinesList);
				} else if (state === 'HR Consumption') {
					setHRConsumption(data);
				} else if (state === 'Machine Consumption') {
					setMachineConsumption(data);
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

	const handleAddTask = async () => {

		try {
			// Check if the newTask ID already exists
			const idExists = taskList.some(task => task.Index === newTask.id);
			if (idExists) {
				console.error('Error adding task: ID already exists');
				return; // Exit the function if ID already exists
			}

			const response = await fetch('http://localhost:8000/addTask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newTask) // Send newTask data as JSON
			});

			if (!response.ok) {
				throw new Error('Failed to add task');
			}

			// Clear the input fields after successful addition
			setNewTask({ id: "", name: "", invoiceId: "", date: "", invoiceFileName: "", taskDescription: "", customerName: "", customerEmail: "", cost: "", initialApproval: "", completionStatus: "", invoiceApproval: "", paymentStatus: "" });
			// Refetch task data to update the list
			await fetchData();
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const handleDeleteTask = async (taskId) => {
		try {
			const response = await fetch(`http://localhost:8000/deleteTask`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ taskId: taskId }) // Wrap taskId in an object
			});

			if (!response.ok) {
				throw new Error(`Failed to delete task with ID ${taskId}`);
			}

			// Filter out the deleted task from the taskList based on Index
			setTaskList(prevTaskList => prevTaskList.filter(task => task.Index !== taskId));

		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	const renderTaskRows = () => {
		// Sort the tasks by their index
		const sortedTasks = currentItems.sort((a, b) => a.Index - b.Index);
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
				<div className="row-item">
					<input type="checkbox" checked={task['Initial Approval']} className={`disabled-checkbox${task.Index}`} />
				</div>
				<div className="row-item">
					<input type="checkbox" checked={task['Completion Status']} className={`disabled-checkbox${task.Index}`} />
				</div>
				<div className="row-item">
					<input type="checkbox" checked={task['Invoice Approval']} className={`disabled-checkbox${task.Index}`} />
				</div>
				<div className="row-item">
					<input type="checkbox" checked={task['Payment Status']} className={`disabled-checkbox${task.Index}`} />
				</div>
				{/*
				<div className="row-item">
					<div className='pencilIcon' onClick={() => {
						// Construct the class name
						const className = `.disabled-checkbox${task.Index}`;
						// Get all elements with the constructed class name
						const checkboxes = document.querySelectorAll(className);
						// Remove the class from all these elements
						checkboxes.forEach((checkbox) => {
							checkbox.classList.remove(`disabled-checkbox${task.Index}`);
							console.log(checkbox);
						});
					}}>
					</div>

					<div className='trashIcon' onClick={() => handleDeleteTask(task.Index)}></div>
				</div>
				*/}
			</div >
		));
	};

	const handleAddLog = async () => {
		try {
			// Check if the newLog ID already exists
			const idExists = logList.some(log => log.id === newLog.id);
			if (idExists) {
				console.error('Error adding log: ID already exists');
				return; // Exit the function if ID already exists
			}

			const response = await fetch('http://localhost:8000/addLog', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newLog) // Send newLog data as JSON
			});

			if (!response.ok) {
				throw new Error('Failed to add log');
			}

			// Clear the input fields after successful addition
			setNewLog({ id: '', employeeName: user, date: '', taskId: '', hours: '', machine: "", machineHours: '', notes: '' });
			// Refetch log data to update the list
			await fetchData();
		} catch (error) {
			console.error('Error adding log:', error);
		}

	};

	const handleDeleteLog = async (logId) => {
		try {
			const response = await fetch(`http://localhost:8000/deleteLog`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ logId: logId }) // Wrap logId in an object
			});

			if (!response.ok) {
				throw new Error(`Failed to delete log with ID ${logId}`);
			}

			// Filter out the deleted log from the logList based on log_id
			setLogList(prevLogList => prevLogList.filter(log => log.id !== logId));

		} catch (error) {
			console.error('Error deleting log:', error);
		}
	};

	const renderLogsRows = () => {
		// Sort the logs by their log_id
		var sortedLogs = currentItems.sort((a, b) => a.id - b.id);
		// Filter out the logs in which the user is equal to the current user, only if user is not "Admin"
		console.log(sortedLogs);

		var userSortedLogs = sortedLogs;
		// If the user is not "Admin" then only show the logs of the current user
		if (user !== 'Admin') {
			userSortedLogs = userSortedLogs.filter(log => log.employeeName === user);
		}

		return userSortedLogs.map(log => (
			<div className="table-row" key={log.id}>
				<div className="row-item">{log.id}</div>
				<div className="row-item">{log.employeeName}</div>
				<div className="row-item">{new Date(log.date).toLocaleDateString()}</div>
				<div className="row-item">{log.taskId}</div>
				<div className="row-item">{log.hours}</div>
				<div className="row-item">{log.machine}</div>
				<div className="row-item">{log.machineHours}</div>
				<div className="row-item">{log.notes}</div>
				<div className="row-item">
					<div className='trashIcon' onClick={() => handleDeleteLog(log.id)}></div>
				</div>
			</div>
		));
	}


	const renderPaginationButtons = () => {
		const shouldDisplayButtons = state === 'Machines' ? machineList.length > itemsPerPage
			: state === 'Employees' ? employeeList.length > itemsPerPage
				: state === 'Tasks' ? taskList.length > itemsPerPage
					: state === 'Logs' ? logList.length > itemsPerPage
						: state === 'HR Consumption' ? hrConsumption.length > itemsPerPage
							: state === 'Machine Consumption' ? machineConsumption.length > itemsPerPage
								: false;

		if (!shouldDisplayButtons) {
			return null;
		}

		// Calculate total number of pages
		const totalPageCount = Math.ceil((state === 'Machines' ? machineList.length
			: state === 'Employees' ? employeeList.length
				: state === 'Tasks' ? taskList.length
					: state === 'Logs' ? logList.length
						: state === 'HR Consumption' ? hrConsumption.length
							: state === 'Machine Consumption' ? machineConsumption.length
								: 0) / itemsPerPage);

		return (
			<div>
				<div className="pagination-buttons">
					<button onClick={() => handleClick('prev')} disabled={currentPage === 1}>Previous</button>
					<button onClick={() => handleClick('next')} disabled={
						state === 'Machines' ? indexOfLastItem >= machineList.length
							: state === 'Employees' ? indexOfLastItem >= employeeList.length
								: state === 'Tasks' ? indexOfLastItem >= taskList.length
									: state === 'Logs' ? indexOfLastItem >= logList.length
										: state === 'HR Consumption' ? indexOfLastItem >= hrConsumption.length
											: state === 'Machine Consumption' ? indexOfLastItem >= machineConsumption.length
												: true}>Next</button>
				</div>
				<div className="page-number">{currentPage} / {totalPageCount}</div>
			</div>
		);
	};

	const tables = {
		'HR Consumption': (
			<>
				<div className="table-row heading">
					<div className="row-item">Employee Name</div>
					<div className="row-item">Total Hours</div>
				</div>
				{hrConsumption.map((item) => (
					<div className="table-row" key={item.employeeName}>
						<div className="row-item">{item.employeeName}</div>
						<div className="row-item">{item.totalHours}</div>
					</div>
				))}
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
					<div style={{ marginRight: '10px' }}>
						<label style={{ marginRight: '5px' }}>Start Date:</label>
						<input
							type="date"
							value={startDate}
							onChange={(e) => { setStartDate(e.target.value); fetchData(); }}
						/>
					</div>
					<div>
						<label style={{ marginRight: '5px' }}>End Date:</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => { setEndDate(e.target.value); fetchData(); }}
						/>
					</div>
				</div>
			</>
		),
		'Machine Consumption': (
			<>
				<div className="table-row heading">
					<div className="row-item">Machine Name</div>
					<div className="row-item">Total Hours</div>
				</div>
				{machineConsumption.map((item) => (
					<div className="table-row" key={item.machine}>
						<div className="row-item">{item.machine}</div>
						<div className="row-item">{item.totalMachineHours}</div>
					</div>
				))}
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
					<div style={{ marginRight: '10px' }}>
						<label style={{ marginRight: '5px' }}>Start Date:</label>
						<input
							type="date"
							value={startDate}
							onChange={(e) => { setStartDate(e.target.value); fetchData(); }}
						/>
					</div>
					<div>
						<label style={{ marginRight: '5px' }}>End Date:</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => { setEndDate(e.target.value); fetchData(); }}
						/>
					</div>
				</div>
			</>
		),
		Logs: (
			<>
				<div className="table-row heading">
					<div className="row-item">Log ID</div>
					<div className="row-item">Name</div>
					<div className="row-item">Date</div>
					<div className="row-item">TaskID</div>
					<div className="row-item">Hours</div>
					<div className="row-item">Machine</div>
					<div className="row-item">Machine Hours</div>
					<div className="row-item">Notes</div>
					<div className="row-item">Action</div>
				</div>

				<div className='table-row'>
					<div className="row-item">

						{/* If the user is not Admin then make this field uneditable and have the value as the newLog.id */}

						<input
							type="text"
							placeholder="ID"
							value={newLog.id}
							onChange={(e) => setNewLog({ ...newLog, id: e.target.value })}
							readOnly={user !== 'Admin'} // Make the field read-only if the user is not "Admin"
							name="id"
						/>

						{/* <input type="text" placeholder="ID" name="id" value={newLog.id} onChange={(e) => setNewLog({ ...newLog, id: e.target.value })} /> */}


					</div>

					{/* // If the user is not "Admin" then make this field uneditable
					// Assuming you have a variable `userRole` that contains the current user's role */}

					<div className="row-item">
						<input
							type="text"
							placeholder={user}
							name="name"
							value={newLog.employeeName}
							onChange={(e) => setNewLog({ ...newLog, employeeName: e.target.value })}
							readOnly={user !== 'Admin'} // Make the field read-only if the user is not "Admin"
						/>
					</div>


					{/* <div className="row-item">
						<input type="text" placeholder={user} name="name" value={newLog.employeeName} onChange={(e) => setNewLog({ ...newLog, employeeName: e.target.value })} />
					</div> */}

					<div className="row-item">
						<input type="date" name="date" value={newLog.date} onChange={(e) => setNewLog({ ...newLog, date: e.target.value })} />
					</div>
					<div className="row-item">
						<select name="taskId" value={newLog.taskId} onChange={(e) => setNewLog({ ...newLog, taskId: e.target.value })}>
							<option value="">Select Task</option>
							{logListTaskDropdown.map((task) => (
								<option key={task['Invoice ID']} value={task['Invoice ID']}>
									{task['Invoice ID']}
								</option>
							))}
						</select>

					</div>
					<div className="row-item">
						<input type="text" placeholder="Hours" name="hours" value={newLog.hours} onChange={(e) => setNewLog({ ...newLog, hours: e.target.value })} />
					</div>
					<div className="row-item">

						<select name="machine" value={newLog.machine} onChange={(e) => setNewLog({ ...newLog, machine: e.target.value })}>
							<option value="">Select Machine</option>
							{logListMachineDropdown.map((machine) => (
								<option key={machine['machine_name']} value={machine['machine_name']}>
									{machine['machine_name']}
								</option>
							))}
						</select>


					</div>
					<div className="row-item">
						<input type="text" placeholder="Machine Hours" name="machineHours" value={newLog.machineHours} onChange={(e) => setNewLog({ ...newLog, machineHours: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Notes" name="notes" value={newLog.notes} onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })} />
					</div>
					<div className="row-item">
						<div className='plusIcon' onClick={() => { handleAddLog() }}></div>
					</div>

				</div>

				{renderLogsRows()}
				{renderPaginationButtons()}

			</>
		),
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

				<div className='table-row'>
					<div className="row-item">
						<input type="text" placeholder="ID" name="id" value={newTask.id} onChange={(e) => setNewTask({ ...newTask, id: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Task Name" name="name" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Invoice ID" name="invoiceId" value={newTask.invoiceId} onChange={(e) => setNewTask({ ...newTask, invoiceId: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="date" name="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Invoice File Name" name="invoiceFileName" value={newTask.invoiceFileName} onChange={(e) => setNewTask({ ...newTask, invoiceFileName: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Task Description" name="taskDescription" value={newTask.taskDescription} onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Customer Name" name="customerName" value={newTask.customerName} onChange={(e) => setNewTask({ ...newTask, customerName: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Customer Email" name="customerEmail" value={newTask.customerEmail} onChange={(e) => setNewTask({ ...newTask, customerEmail: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="text" placeholder="Cost" name="cost" value={newTask.cost} onChange={(e) => setNewTask({ ...newTask, cost: e.target.value })} />
					</div>
					<div className="row-item">
						<input type="checkbox" checked={newTask.initialApproval} onChange={(e) => setNewTask({ ...newTask, initialApproval: e.target.checked })} />
					</div>
					<div className="row-item">
						<input type="checkbox" checked={newTask.completionStatus} onChange={(e) => setNewTask({ ...newTask, completionStatus: e.target.checked })} />
					</div>
					<div className="row-item">
						<input type="checkbox" checked={newTask.invoiceApproval} onChange={(e) => setNewTask({ ...newTask, invoiceApproval: e.target.checked })} />
					</div>
					<div className="row-item">
						<input type="checkbox" checked={newTask.paymentStatus} onChange={(e) => setNewTask({ ...newTask, paymentStatus: e.target.checked })} />
					</div>
					<div className="row-item">
						<div className='plusIcon' onClick={() => { handleAddTask(); }}></div>
					</div>
				</div>

				{renderTaskRows()}
				{renderPaginationButtons()}
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
		<div className="main-container" >
			<div className="table-container">
				{tables[state]}
			</div>
		</div >
	);
};

export default Main;
