const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

const access = {

    login: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        connection.query(
            `call login('${username}', '${password}')`,
            (err, results) => {
                if (err) {
                    res.send(err);
                } else {
                    if (results.length > 0) {
                        const user = results[0];
                        const admin = results[0][0].admin;
                        const token = jwt.sign(
                            { "username": username, "password": password }, 
                            process.env.SECRET_KEY,  
                            { expiresIn: '10s' }
                        );
                        res.cookie('token', token, { httpOnly: true });
                        res.json({ token, user, admin });
                    } else {
                        res.send('Invalid username or password');
                    }
                }
            }
        );
    },
    logout: (req, res) => {
        res.clearCookie('token');
        res.send('Logged out successfully');
    },

    signup: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        console.log(username);


        connection.query(
            `call findUser('${username}')`,
            (err, results) => {
                console.log(results);
                if (err) {
                    res.send(err);
                } else {
                    if (results[0].length > 0) {
                        res.send('Username already exists');
                    } else {
                        connection.query(
                            `call signup('${username}', '${password}')`,
                            (err, results2) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.send('User created successfully');
                                }
                            }
                        );
                    }
                }
            });
    },

    verifyAdmin: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/');
        } else {
            const {username, password} = jwt.decode(token);
            connection.query(
                `call findAdmin('${username}', '${password}')`,
                (err, results) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        if (results[0].length > 0) {
                            next();
                        } else {
                            res.redirect('/home');
                        }
                    }
                }
            );
        }
    },

    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/');
        } else {
            try {
                jwt.verify(token, process.env.SECRET_KEY)
                next();
            } catch (err) {
                res.clearCookie('token');
                return res.redirect('/');
            }
        }
    },
    addQue: (req, res) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const subject = req.body.subject;
        const comment = req.body.comment;
        connection.query(
            `call createContact('${firstName}', '${lastName}', '${email}', '${subject}', '${comment}')`,
            (err, results) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.status(200).send('Question added successfully');
                }
            }
        );
    },
    getQue: (req, res) => {
        connection.query(
            `call getContact()`,
            (err, results) => {
                if (err) {
                    res.status(500).send
                }
                else {
                    res.status(200).send(results[0]);
                }
            }
        );
    },
    getQueById: (req, res) => {
        const id = req.params.id;
        connection.query(
            `call getContactById('${id}')`,
            (err, results) => {
                if (err) {
                    res.status(500).send
                }
                else {
                    res.status(200).send(results[0]);
                }
            }
        );
    }

}

module.exports = access;