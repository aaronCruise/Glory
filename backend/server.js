Cconst express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'LoginPage')));

// Create a connection to the  database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'glory',
    password: 'your_password',
    database: 'customer'
});

// Test the connection
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MariaDB database.');
});

// simple route to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'LoginPage', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('email:', email);
    console.log('password:', password);

    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';

    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ message: 'Internal server error' });
        }

        console.log('Query Results:', results);

        if (results.length > 0) {
            // User found
            res.send({ message: 'Login successful!' });
        } else {
            // No match found
            res.status(401).send({ message: 'Invalid email or password.' });
        }
    });
});




// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
