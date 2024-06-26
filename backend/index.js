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

app.get('/getTasks', async (req, res) => {
    try {
        // Query to select all rows from the tasks table
        const query = 'SELECT * FROM tasks';

        // Execute the query
        const { rows } = await pool.query(query);

        // Return the tasks data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getLogs', async (req, res) => {
    const { user } = req.query; // Extract user from query parameters
    try {
        // Query to select logs for the specified user from the Logs table
        // When employeeName is Admin return all logs

        const query = 'SELECT * FROM Logs';

        // const query = 'SELECT * FROM Logs WHERE "employeeName" = $1';

        const getInvoiceID = 'SELECT "Invoice ID" FROM Tasks ORDER BY "Index" DESC';

        const getMachinesList = 'SELECT "machine_name" FROM Machines';


        // Execute the query to get the user logs
        // no parameter if admin
        const { rows } = await pool.query(query);
        // const { rows } = await pool.query(query, [user]);

        // Execute the query to get the latest Invoice ID
        const { rows: invoiceRows } = await pool.query(getInvoiceID);
        const invoiceID = invoiceRows.length > 0 ? invoiceRows : null;


        // Execute the query to get the list of machines
        const { rows: machineRows } = await pool.query(getMachinesList);
        const machinesList = machineRows.length > 0 ? machineRows : null;

        // Append the latest invoice ID to the logs
        const result = {
            logs: rows,
            invoiceID: invoiceID,
            machinesList: machinesList
        };

        // Return the logs data as JSON

        //console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error retrieving user logs:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route for get machine consumption and hr consumption
// http://localhost:8000/getMachineConsumption?startDate=${startDate}&endDate=${endDate}
app.get('/getMachineConsumption', async (req, res) => {
    const { startDate, endDate } = req.query; // Extract startDate and endDate from query parameters
    try {
        // Query to get machine consumption from logs
        const query = 'SELECT "machine", SUM("machineHours") AS "totalMachineHours" FROM Logs WHERE "date" >= $1 AND "date" <= $2 GROUP BY "machine"';

        // Execute the query
        const { rows } = await pool.query(query, [startDate, endDate]);

        // Return the machine consumption data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving machine consumption:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getHrConsumption', async (req, res) => {
    const { startDate, endDate } = req.query; // Extract startDate and endDate from query parameters
    try {
        // Query to get HR consumption from logs
        const query = 'SELECT "employeeName", SUM("hours") AS "totalHours" FROM Logs WHERE "date" >= $1 AND "date" <= $2 GROUP BY "employeeName"';

        // Execute the query
        const { rows } = await pool.query(query, [startDate, endDate]);

        // Return the HR consumption data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving HR consumption:', error);
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

// Define a route handler for /deleteMachine endpoint
app.post('/deleteMachine', async (req, res) => {
    const { machineId } = req.body; // Extract id from request parameters
    try {
        // Query to delete a machine from the machines table
        const query = 'DELETE FROM machines WHERE machine_id = $1';
        // Execute the query
        await pool.query(query, [machineId]);

        res.send('Machine deleted successfully');
    } catch (error) {
        console.error('Error deleting machine:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route handler for /addMachine endpoint
app.post('/addMachine', async (req, res) => {
    const { id, name, location } = req.body; // Extract id, name, and location from request body
    try {
        // Query to insert a new machine into the machines table
        const query = 'INSERT INTO machines (machine_id, machine_name, lab_name) VALUES ($1,$2,$3)';
        // Execute the query
        await pool.query(query, [id, name, location]);

        res.send('Machine added successfully');
    } catch (error) {
        console.error('Error adding machine:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/deleteTask', async (req, res) => {
    const { taskId } = req.body; // Extract id from request parameters
    try {
        // Query to delete a machine from the machines table
        const query = 'DELETE FROM tasks WHERE "Index" = $1';
        // Execute the query
        await pool.query(query, [taskId]);

        res.send('Task deleted successfully');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addTask', async (req, res) => {
    console.log("addTask called");
    console.log(req.body);
    var { id, name, invoiceId, date, invoiceFileName, taskDescription, customerName, customerEmail, cost, initialApproval, completionStatus, invoiceApproval, paymentStatus } = req.body; // Extract id, name, and location from request body

    // If Initial Approval, Completion Status, Invoice Approval, Payment Status are empty, set them to false.
    if (initialApproval == "") {
        initialApproval = false;
    }
    if (completionStatus == "") {
        completionStatus = false;
    }
    if (invoiceApproval == "") {
        invoiceApproval = false;
    }
    if (paymentStatus == "") {
        paymentStatus = false;
    }

    try {
        // Query to insert a new machine into the machines table
        const query = 'INSERT INTO tasks ("Index", "Task", "Invoice ID", "Date", "Invoice File Name", "Task Description", "Customer Name", "Customer Email", "Cost", "Initial Approval", "Completion Status", "Invoice Approval", "Payment Status") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)';

        // Execute the query
        await pool.query(query, [id, name, invoiceId, date, invoiceFileName, taskDescription, customerName, customerEmail, cost, initialApproval, completionStatus, invoiceApproval, paymentStatus]);

        res.send('Task added successfully');
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send('Internal Server Error');
    }
});

// setNewLog({ id: '', employeeName: user, date: '', taskId: '', hours: '', machine: "", machineHours: '', notes: '' });

// CREATE TABLE Logs (
//   "id" SERIAL PRIMARY KEY,
//   "employeeName" VARCHAR(255),
//   "date" DATE,
//   "taskId" INT,
//   "hours" NUMERIC,
//   "machine" VARCHAR(255),
//   "machineHours" NUMERIC,
//   "notes" TEXT
// );

app.post('/deleteLog', async (req, res) => {
    const { logId } = req.body; // Extract id from request parameters
    try {
        // Query to delete a log from the logs table
        const query = 'DELETE FROM logs WHERE id = $1';
        // Execute the query
        await pool.query(query, [logId]);

        res.send('Log deleted successfully');
    } catch (error) {
        console.error('Error deleting log:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addLog', async (req, res) => {
    console.log(req.body);
    const { employeeName, date, taskId, hours, machine, machineHours, notes } = req.body; // Extract id, name, and location from request body
    try {
        // Query to insert a new log into the logs table
        const query = 'INSERT INTO logs ("employeeName", "date", "taskId", "hours", "machine", "machineHours", "notes", "id") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)';
        // Execute the query
        console.log(query, [employeeName, date, taskId, hours, machine, machineHours, notes, req.body['id']]);
        await pool.query(query, [employeeName, date, taskId, hours, machine, machineHours, notes, req.body['id']]);

        res.send('Log added successfully');
    } catch (error) {
        console.error('Error adding log:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server on port 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
