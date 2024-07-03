const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const fs = require('fs');

require('dotenv').config();

const access = require('./server.access');

const app = express();

app.use(express.json());
app.use(express.static('server_test_public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.post('/login', access.login);

app.post('/signup', access.signup);

app.post('/user', access.verifyToken);

app.get('/home', access.verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/admin', access.verifyToken, access.verifyAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/logout', access.verifyToken, access.logout);

app.get('/addQue', access.addQue);

app.get('/getQue', access.getQue);

app.get('/getQueById', access.getQueById);

// app.get('/admin/adminGetUser', access.verifyToken, (req, res) => {
//     const searchUsername = req.query.searchUsername;

//     const token = req.cookies.token;
//     const {username, password} = jwt.decode(token);

//     connection.query(
//         `call findAdmin('${username}', '${password}')`,
//         (err, results) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 if (results.length > 0) {
//                     connection.query(
//                         `call findUser('${searchUsername}')`,
//                         (err, results) => {
//                             if (err) {
//                                 res.send(err);
//                             } else {
//                                 res.send(results);
//                             }
//                         }
//                     );
//                 } else {
//                     res.send('Unauthorized');
//                 }
//             }
//         }
//     )
// });

// app.post('/admin/adminDeleteUser', access.verifyToken, (req, res) => {
//     const searchUsername = req.body.searchUsername;

//     const token = req.cookies.token;
//     const {username, password} = jwt.decode(token);

//     connection.query(
//         `call findAdmin('${username}', '${password}')`,
//         (err, results) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 if (results.length > 0) {
//                     connection.query(
//                         `call deleteUser('${searchUsername}')`,
//                         (err, results) => {
//                             if (err) {
//                                 res.send(err);
//                             } else {
//                                 res.send(results);
//                             }
//                         }
//                     );
//                 } else {
//                     res.send('Unauthorized');
//                 }
//             }
//         }
//     )
// });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`is running on http://localhost:${PORT}`);
});