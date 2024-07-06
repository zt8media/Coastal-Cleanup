const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = express.Router();
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

//to server static pictures...
app.use('/public', express.static(path.join(__dirname, 'public')));

// to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// to use router
app.use('/api',router);

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

// user routes
router.post('/login', access.login);

router.post('/signup', access.signup);

router.get('/logout', access.logout);

// Que routes
router.post('/addQue', access.addQue);

router.get('/getQue', access.verifyAdmin, access.getQue);

router.get('/getQueById/:id', access.verifyAdmin, access.getQueById);

router.delete('/deleteQue/:id', access.verifyAdmin, access.deleteQue);

// event routes
router.get('/events', access.getEvents);

router.post('/events', access.verifyToken, access.createEvent);

router.put('/events/:id', access.verifyToken, access.updateEvent);

router.delete('/events/:id', access.verifyToken, access.deleteEvent);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`is running on http://localhost:${PORT}`);
});