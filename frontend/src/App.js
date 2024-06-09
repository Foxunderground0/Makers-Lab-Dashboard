import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import Sidebar from './Sidebar';
import Main from './Main';
import Auth from './Auth';

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [currentState, setCurrentState] = useState('Default');
	const [listOfUsers, setListOfUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const user = Cookies.get('user');

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleSidebarItemClick = (item) => {
		setCurrentState(item);
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const url = 'http://localhost:8000/getEmployees';
				const response = await fetch(url);
				const data = await response.json();
				const users = data.map(element => element.name);
				setListOfUsers(users);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching users:', error);
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	console.log(user);

	const isAdmin = user === 'Admin';
	const isValidUser = listOfUsers.includes(user);

	if (!isAdmin && !isValidUser) {
		return (
			<div className="App-Auth">
				<div className="topBar-Auth">
					<h1>Makers Lab Logging Software</h1>
				</div>
				<div className="mainArea-Auth">
					<Auth />
				</div>
			</div>
		);
	}

	return (
		<div className="App">
			<div className="topBar">
				<h1>Makers Lab Logging Software</h1>
			</div>
			<Sidebar isOpen={sidebarOpen} onItemClick={handleSidebarItemClick} />
			<div className="mainArea">
				<Main state={currentState} user={user} />
			</div>
		</div>
	);
}

export default App;
