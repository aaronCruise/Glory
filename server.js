const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Import mysql2 package
const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'LoginPage')));

// Create a connection to the MariaDB database
const connection = mysql.createConnection({
    host: 'localhost',       // Database host
    user: 'glory',   // Replace with your MariaDB username
    password: 'your_password', // Replace with your MariaDB password
    database: 'customer' // Replace with your database name
});

// Test the connection
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MariaDB database.');
});

// Define a simple route to serve the login page (if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'LoginPage', 'login.html'));
});

// Simple login route (POST request)
// Simple login route (POST request)
// Simple login route (POST request)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('email:', email);
    console.log('password:', password);

    // Simple query to check if the user exists with the provided email and password
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';

    // Query the database
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }

        // Log query results for debugging
        console.log('Query Results:', results);

        if (results.length > 0) {
            // User found, login successful
            res.send({ message: 'Login successful!' });
        } else {
            // No match found, either email or password is incorrect
            res.status(401).send({ message: 'Invalid email or password.' });
        }
    });
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

