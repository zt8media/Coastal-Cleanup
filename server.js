const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const fs = require('fs');

require('dotenv').config();

const access = require('./server.access');

const app = express();

 // to parse JSON bodies
app.use(express.json());

// to read cookies
app.use(cookieParser());

// redirect to home page
app.get('/', (req, res) => res.redirect('/home'));

// to serve static files
app.use(express.static('public'));

// to server static pictures
app.use('/public', express.static(path.join(__dirname, 'public')));

// to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


// user routes
app.post('/login', access.login);

app.post('/signup', access.signup);

app.get('/logout', access.logout);

// page routes
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home/', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/contact/', 'contact.html'));
});

app.get('/learn-more', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/learn-more/Html', 'learnmore.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/events/', 'events.html'));
});


// Que routes
app.post('/addQue', access.addQue);

app.get('/getQue', access.getQue);

app.get('/getQueById', access.getQueById);

app.delete('/deleteQue', access.deleteQue);

// event routes
app.get('/events', access.getEvents);

app.post('/events', access.verifyToken, access.createEvent);

app.put('/events/:id', access.updateEvent);

app.delete('/events/:id', access.deleteEvent);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`is running on http://localhost:${PORT}`);
});