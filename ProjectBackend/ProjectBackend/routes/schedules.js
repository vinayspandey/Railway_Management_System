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

// GET all schedules
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Schedule`;
    connection.query(queryText, (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(result);
        } else {
            console.error(error);
            res.status(500).json({ error: "Database error" });
        }
        connection.end();
    });
});

// GET schedule by TrainNo
app.get("/train/:TrainNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Schedule WHERE TrainNo = ?`;
    connection.query(queryText, [req.params.TrainNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.status(404).json({ error: "No schedule found for this TrainNo" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// GET schedule by StationNo
app.get("/station/:StationNo", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Schedule WHERE StationNo = ?`;
    connection.query(queryText, [req.params.StationNo], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.status(404).json({ error: "No schedule found for this StationNo" });
            }
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// ADD a new schedule
app.post("/", (req, res) => {
    const { ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;

    if (!ScheduleId || !TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        INSERT INTO Schedule (ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime)
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(
        queryText,
        [ScheduleId, TrainNo, StationNo, ArrivalTime, DepartureTime],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                res.json({ success: true, data: result });
            } else {
                console.error(error);
                res.status(500).json({ error: "Database error" });
            }
            connection.end();
        }
    );
});

// UPDATE schedule by ScheduleId
app.put("/:ScheduleId", (req, res) => {
    const { TrainNo, StationNo, ArrivalTime, DepartureTime } = req.body;
    const ScheduleId = req.params.ScheduleId;

    if (!TrainNo || !StationNo || !ArrivalTime || !DepartureTime) {
        return res.status(400).json({ error: "All fields are required for update" });
    }

    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        UPDATE Schedule SET TrainNo = ?, StationNo = ?, ArrivalTime = ?, DepartureTime = ?
        WHERE ScheduleId = ?
    `;
    connection.query(
        queryText,
        [TrainNo, StationNo, ArrivalTime, DepartureTime, ScheduleId],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                if (result.affectedRows > 0) {
                    res.json({ success: true, message: "Schedule updated successfully" });
                } else {
                    res.status(404).json({ error: "Schedule not found" });
                }
            } else {
                console.error(error);
                res.status(500).json({ error: "Database error" });
            }
            connection.end();
        }
    );
});

module.exports = app;
