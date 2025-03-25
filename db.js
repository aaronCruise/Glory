// Use the MariaDB Node.js Connector
var mariadb = require('mariadb');

// Create a connection pool
var pool =
  mariadb.createPool({
    host: "127.0.0.1",
    port: 3306,
    user: "glory",
    password: "your_password",
    database: "customer"
  });

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool
});
