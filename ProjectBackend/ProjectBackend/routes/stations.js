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

// ADD a new station
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `INSERT INTO Station (Name, TrainNo) VALUES (?, ?)`;
    connection.query(
        queryText,
        [req.body.Name, req.body.TrainNo],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ message: "Station added successfully!", result });
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// GET all stations
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Station`;
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

// GET station by StationNo
app.get("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Station WHERE StationNo = ?`;
    connection.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result[0]); // Return the station object if found
            } else {
                res.status(404).json({ message: "Station not found" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// UPDATE a station
app.put("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `UPDATE Station SET Name = ?, TrainNo = ? WHERE StationNo = ?`;
    connection.query(
        queryText,
        [req.body.Name, req.body.TrainNo, req.params.id],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ message: "Station updated successfully!", result });
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

// DELETE a station
app.delete("/:id", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `DELETE FROM Station WHERE StationNo = ?`;
    connection.query(queryText, [req.params.id], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Station deleted successfully!", result });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

module.exports = app;
