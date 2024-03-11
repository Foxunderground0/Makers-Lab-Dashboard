const express = require('express');
const cors = require('cors'); // Import cors package

const app = express();

// Use cors middleware with origin set to the frontend service name
app.use(cors());

// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Define a route handler for /getMachines endpoint
app.get('/getMachines', (req, res) => {
    // Assuming machines data is stored in an array
    const machines = [
        { id: 1, name: 'Machine 1', location: 'Operational' },
        { id: 2, name: 'Machine 2', location: 'Under Maintenance' },
        // Add more machine objects as needed
    ];
    console.log("asd");

    // Return the machines data as JSON
    res.json(machines);
});

// Start the server on port 8000
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
