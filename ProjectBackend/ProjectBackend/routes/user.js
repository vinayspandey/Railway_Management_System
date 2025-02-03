const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

const connectionDetails = {
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
};

// GET all users
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `SELECT * FROM User`;

    connection.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// GET user by UserId
app.get("/:UserId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `SELECT * FROM User WHERE UserId = ?`;

    connection.query(queryText, [req.params.UserId], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// POST new user
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `INSERT INTO User (Name, Gender, Age, MobileNo, City, State, Pincode, EmailId, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(
        queryText,
        [
            req.body.Name, req.body.Gender, req.body.Age, 
            req.body.MobileNo, req.body.City, req.body.State, 
            req.body.Pincode, req.body.EmailId, req.body.Password
        ],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json(result);
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// DELETE user by UserId
app.delete("/:UserId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `DELETE FROM User WHERE UserId = ?`;

    connection.query(queryText, [req.params.UserId], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

module.exports = app;
