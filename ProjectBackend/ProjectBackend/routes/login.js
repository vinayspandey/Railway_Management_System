const mysql = require('mysql2');
const express = require('express');
const config = require('config'); // Import the config module

const app = express.Router();

// Middleware to parse JSON
app.use(express.json());

// Define connection details using config.get
const connectionDetails = {
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
};

// Create a connection to the MySQL database
const connection = mysql.createConnection(connectionDetails);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Login Route
app.post("/", (request, response) => {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
        return response.status(400).send({ error: "Email and password are required" });
    }

    // SQL query to fetch user details
    const statement = `
        SELECT AdminId AS Id, Name, EmailId, Password, 'admin' AS UserType FROM admin WHERE EmailId = ? 
        UNION 
        SELECT UserId AS Id, Name, EmailId, Password, 'user' AS UserType FROM user WHERE EmailId = ?;
    `;

    // Execute query
    connection.query(statement, [email, email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return response.status(500).send({ error: "Internal server error" });
        }

        // Check if user exists
        if (results.length === 0) {
            return response.status(404).send({ error: "No user found with the provided email" });
        }

        const user = results[0]; // Get the first user from the results
        console.log("User retrieved:", user);

        // Check if the password matches
        if (password === user.Password) {
            // Respond with user details
            return response.status(200).send({
                success: true,
                data: {
                    id: user.Id,
                    name: user.Name,
                    email: user.EmailId,
                    userType: user.UserType,
                },
            });
        } else {
            // Password mismatch
            return response.status(401).send({ error: "Invalid credentials" });
        }
    });
});

module.exports = app;
