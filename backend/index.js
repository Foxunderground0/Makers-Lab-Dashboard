const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Use cors middleware with origin set to the frontend service name
app.use(cors());

// Add middleware to parse JSON bodies
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'backend_user',
    host: 'database',
    database: 'Makers-Lab-DB',
    password: 'password', // Change to your actual password
    port: 5432 // Default PostgreSQL port
});

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define a route handler for /getMachines endpoint
app.get('/getMachines', async (req, res) => {
    try {
        // Query to select all rows from the machines table
        const query = 'SELECT * FROM machines';

        // Execute the query
        const { rows } = await pool.query(query);

        // Return the machines data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving machines:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route handler for /getEmployees endpoint
app.get('/getEmployees', async (req, res) => {
    try {
        // Query to select all rows from the employees table
        const query = 'SELECT * FROM employees';

        // Execute the query
        const { rows } = await pool.query(query);
        // Return the employee data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving employees:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route handler for deleting an employee using POST method
app.post('/deleteEmployee', async (req, res) => {
    console.log(req.body);
    const { employeeId } = req.body; // Extract employeeId from request body
    try {
        // Query to delete the employee with the given employeeId using parameterized query
        const query = 'DELETE FROM employees WHERE employee_id = $1';

        // Execute the parameterized query
        const result = await pool.query(query, [employeeId]);

        // Check if any rows were affected
        if (result.rowCount === 0) {
            // If no rows were affected, the employee with the provided ID doesn't exist
            return res.status(404).send('Employee not found');
        }

        // If the employee was successfully deleted, send success response
        res.send('Employee deleted successfully');
    } catch (error) {
        console.error(`Error deleting employee with ID ${employeeId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route handler for /addEmployee endpoint
app.post('/addEmployee', async (req, res) => {
    console.log(req.body);
    const { id, name } = req.body; // Extract id and name from request body
    try {
        // Validate id and name if needed

        // Query to insert a new employee into the employees table
        const query = 'INSERT INTO employees (employee_id, name) VALUES ($1,$2)';
        // Execute the query
        await pool.query(query, [id, name]);

        res.send('Employee added successfully');
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
