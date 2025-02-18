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

// Get booking details by Booking ID
app.get('/booking/:BookingId', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM booking WHERE BookingId = ?`;
    connection.query(queryText, [req.params.BookingId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});
// Book a ticket
app.post('/ticket', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const { UserId, TrainNo, NoOfPassengers, TotalFare, BookingDate } = req.body;
    const bookingQuery = `
        INSERT INTO booking (UserId, TrainNo, NoOfPassengers, TotalFare, BookingDate) 
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(bookingQuery, [UserId, TrainNo, NoOfPassengers, TotalFare, BookingDate], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Ticket booked successfully", BookingId: result.insertId });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Cancel a booking
app.post('/cancellation', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const { BookingId, CancellationDate, RefundAmount, RefundStatus } = req.body;
    const queryText = `INSERT INTO cancellation (BookingId, CancellationDate, RefundAmount, RefundStatus) VALUES (?, ?, ?, ?)`;
    connection.query(queryText, [BookingId, CancellationDate, RefundAmount, RefundStatus], (error, result) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.status(201).json({ message: "Booking canceled successfully", CancellationId: result.insertId });
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// View payment details by Booking ID
app.get('/payment/:BookingId', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `SELECT * FROM payment WHERE BookingId = ?`;
    connection.query(queryText, [req.params.BookingId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});
// View train schedules
app.get("/schedules", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            train.TrainNo, 
            train.Source, 
            train.Destination, 
            schedule.ArrivalTime, 
            schedule.DepartureTime, 
            station.Name AS StationName 
        FROM 
            train 
        JOIN 
            schedule ON train.TrainNo = schedule.TrainNo 
        JOIN 
            station ON schedule.StationNo = station.StationNo
    `;
    connection.query(queryText, (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Check ticket status by User ID
app.get("/tickets/:UserId", (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            booking.BookingId, 
            booking.TrainNo, 
            train.Source, 
            train.Destination, 
            booking.TotalFare, 
            booking.NoOfPassengers, 
            booking.BookingDate 
        FROM 
            booking 
        JOIN 
            train ON booking.TrainNo = train.TrainNo 
        WHERE 
            booking.UserId = ?
    `;
    connection.query(queryText, [req.params.UserId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});
// View train route
app.get('/route/:TrainNo', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            route.RouteId, 
            route.TrainNo, 
            station.Name AS StationName 
        FROM 
            route 
        JOIN 
            station ON route.StationNo = station.StationNo 
        WHERE 
            route.TrainNo = ?
    `;
    connection.query(queryText, [req.params.TrainNo], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// View train schedule
app.get('/schedule/:TrainNo', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            schedule.ScheduleId, 
            schedule.TrainNo, 
            station.Name AS StationName, 
            schedule.ArrivalTime, 
            schedule.DepartureTime 
        FROM 
            schedule 
        JOIN 
            station ON schedule.StationNo = station.StationNo 
        WHERE 
            schedule.TrainNo = ?
    `;
    connection.query(queryText, [req.params.TrainNo], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Check seat availability by TrainNo and ClassId
app.get('/seats/:TrainNo/:ClassId', (req, res) => {
    const connection = mysql.createConnection(connectionDetails);
    connection.connect();

    const queryText = `
        SELECT 
            SeatId, 
            TrainNo, 
            ClassId, 
            SeatNo, 
            AvailabilityStatus 
        FROM 
            seat 
        WHERE 
            TrainNo = ? AND ClassId = ?
    `;
    connection.query(queryText, [req.params.TrainNo, req.params.ClassId], (error, results) => {
        res.setHeader("content-type", "application/json");
        if (!error) {
            res.json(results);
        } else {
            console.error(error);
            res.status(500).json(error);
        }
        connection.end();
    });
});

// Export the router
module.exports = app;
