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

// ADD a new route
app.post("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `INSERT INTO Route (RouteId, TrainNo, StationNo) VALUES (?, ?, ?)`;
    connection.query(
        queryText,
        [req.body.RouteId, req.body.TrainNo, req.body.StationNo],
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

// GET all routes
app.get("/", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM Route`;
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

// UPDATE a route
app.put("/:RouteId", (req, res) => {
    const { TrainNo, StationNo } = req.body;
    const { RouteId } = req.params;

    if (!TrainNo || !StationNo) {
        return res.status(400).json({ error: "TrainNo and StationNo are required for update" });
    }

    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `UPDATE Route SET TrainNo = ?, StationNo = ? WHERE RouteId = ?`;
    connection.query(
        queryText,
        [TrainNo, StationNo, RouteId],
        (error, result) => {
            res.setHeader("content-type", "application/json");
            if (!error) {
                if (result.affectedRows > 0) {
                    res.json({ success: true, message: "Route updated successfully" });
                } else {
                    res.status(404).json({ error: "Route not found" });
                }
            } else {
                console.error(error);
                res.status(500).json(error);
            }
            connection.end();
        }
    );
});

module.exports = app;
