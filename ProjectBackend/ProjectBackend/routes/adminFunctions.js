const express = require('express');
const mysql = require('mysql2');
const config = require('config');

const app = express.Router();
app.use(express.json());

// Database connection details
const connectionDetails = {
    host: config.get("host"),
    user: config.get("user"),
    password: config.get("password"),
    database: config.get("dbname"),
    port: config.get("port"),
};

// Add a new train
app.post("/train", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const { TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date } = req.body;
    const queryText = `INSERT INTO train (TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(queryText, [TrainNo, Source, Destination, ArrivalTime, DepartureTime, Date], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Train added successfully", TrainId: result.insertId });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// View train details by TrainNo
app.get("/train/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM train WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error, result) => {
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

// Add a new station
app.post("/station", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const { StationNo, Name, TrainNo } = req.body;
    const queryText = `INSERT INTO station (StationNo, Name, TrainNo) VALUES (?, ?, ?)`;
    connection.query(queryText, [StationNo, Name, TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Station added successfully", StationId: result.insertId });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// View stations by TrainNo
app.get("/station/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM station WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error, result) => {
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

// Delete a train by TrainNo
app.delete("/train/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `DELETE FROM train WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Train deleted successfully" });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Delete a station by StationNo
app.delete("/station/:StationNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `DELETE FROM station WHERE StationNo = ?`;
    connection.query(queryText, [req.params.StationNo], (error) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json({ message: "Station deleted successfully" });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Export the router
module.exports = app;
