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

// GET all admins
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `SELECT * FROM Admin`;

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

// GET admin by AdminId
app.get("/:AdminId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `SELECT * FROM Admin WHERE AdminId = ?`;

    connection.query(queryText, [req.params.AdminId], (error, result) => {
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

// POST new admin
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `INSERT INTO Admin (Name, EmailId, Password) VALUES (?, ?, ?)`;

    connection.query(queryText, [req.body.Name, req.body.EmailId, req.body.Password], (error, result) => {
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

// PUT update admin
app.put("/:AdminId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `UPDATE Admin SET Name = ?, EmailId = ?, Password = ? WHERE AdminId = ?`;

    connection.query(queryText, [req.body.Name, req.body.EmailId, req.body.Password, req.params.AdminId], (error, result) => {
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

// DELETE admin by AdminId
app.delete("/:AdminId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();
    const queryText = `DELETE FROM Admin WHERE AdminId = ?`;

    connection.query(queryText, [req.params.AdminId], (error, result) => {
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
