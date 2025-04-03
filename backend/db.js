// Use the MariaDB Node.js Connector
const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "glory",
    password: "your_password", // Change this to your actual password
    database: "customer",
    connectionLimit: 5 // Optional: Limits the number of connections
});

// Test the database connection
pool.getConnection()
    .then(conn => {
        console.log("✅ Database connected!");
        conn.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err);
    });

// Export the connection pool for use in other files
module.exports = Object.freeze({
    pool: pool
});

