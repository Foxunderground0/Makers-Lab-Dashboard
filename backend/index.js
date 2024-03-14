const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Use cors middleware with origin set to the frontend service name
app.use(cors());

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

// Start the server on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
