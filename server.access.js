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

    // Login endpoint
    login: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        connection.query(
            `call login('${username}', '${password}')`,
            (err, results) => {
                if (err) {
                    res.send(err);
                } else {
                    if (results[0].length > 0) {
                        const user = results[0];
                        const admin = results[0][0].admin;
                        const token = jwt.sign(
                            { "username": username, "password": password }, 
                            process.env.SECRET_KEY,  
                            { expiresIn: '1h' }
                        );
                        res.cookie('token', token, { httpOnly: true });
                        res.json({ token, user, admin });
                    } else {
                        res.status(401).json({message: 'Invalid username or password'});
                    }
                }
            }
        );
    },

    // Logout endpoint
    logout: (req, res) => {
        const token = req.cookies.token;
        if (token) {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out' });
        }
        else {
            res.status(400).json({ message: 'Already logged out' });
        }
    },

    // Signup endpoint
    signup: (req, res) => {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        connection.query(
            `call findUser('${username}')`,
            (err, results) => {
                if (err) {
                    res.send(err);
                } else {
                    if (results[0].length > 0) {
                        res.status(409).json({ message: 'Username already exists' });
                    } else {
                        connection.query(
                            `call signup('${email}', '${username}', '${password}')`,
                            (err, results2) => {
                                if (err) {
                                    res.status(500).json({ message: 'Internal server error' });
                                } else {
                                    if (results2[0].length > 0) {
                                    const user = results2[0];
                                    const admin = results2[0][0].admin;
                                    const token = jwt.sign(
                                        { "username": username, "password": password }, 
                                        process.env.SECRET_KEY,  
                                        { expiresIn: '1h' }
                                    );
                                    res.cookie('token', token, { httpOnly: true });
                                    res.json({ token, user, admin });
                                    } else {
                                        res.status(500).json({ message: 'Internal server error' });
                                    }
                                }
                            }
                        );
                    }
                }
            });
    },

    // Verify admin middleware
    verifyAdmin: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/home');
        } else {

            try {
                jwt.verify(token, process.env.SECRET_KEY)
            } catch (err) {
                res.clearCookie('token');
                return res.status(400).json({ message: 'Please login' });
            }

            const {username, password} = jwt.decode(token);
            connection.query(
                `call findAdmin('${username}', '${password}')`,
                (err, results) => {
                    if (err) {
                        console.log(err);
                        res.redirect('/home');
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

    // Verify token middleware
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'Please login' });
        } else {
            try {
                jwt.verify(token, process.env.SECRET_KEY)
                next();
            } catch (err) {
                res.clearCookie('token');
                return res.status(400).json({ message: 'Please login' });
            }
        }
    },

    // Add Que endpoint
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
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Sent' });
                }
            }
        );
    },

    // Delete Que endpoint
    deleteQue: (req, res) => {
        const id = req.body.id;
        connection.query(
            `call deleteContact('${id}')`,
            (err, results) => {
                if (err) {
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Deleted' });
                }
            }
        );
    },

    // Get all Ques endpoint
    getQue: (req, res) => {
        connection.query(
            `call getContacts()`,
            (err, results) => {
                if (err) {
                    res.status(500).send
                }
                else {
                    res.status(200).json({message: results[0]});
                }
            }
        );
    },

    // Get Que by ID endpoint
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
    },
    // Get all events endpoint
    getEvents: async (req, res) => {
        try {
            const events = await Event.findAll();
            res.json(events);
        } catch (err) {
            res.status(500).json({ message: 'Error getting events', error: err.message });
        }
    },
    // Create event endpoint
    createEvent: async (req, res) => {
        try {
            const event = await Event.create({
              title: req.body.title,
              start: req.body.start,
              end: req.body.end,
              description: req.body.description,
              location: req.body.location
            });
            res.status(201).json(event);
          } catch (err) {
            res.status(400).json({ message: 'Error creating event', error: err.message });
          }
    },
    // Update event by ID endpoint
    updateEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
              return res.status(404).json({ message: 'Event not found' });
            }
            await event.update({
              title: req.body.title,
              start: req.body.start,
              end: req.body.end,
              description: req.body.description,
              location: req.body.location
            });
            res.json(event);
          } catch (err) {
            res.status(400).json({ message: 'Error updating event', error: err.message });
          }
    },
    // Delete event by ID endpoint
    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
              return res.status(404).json({ message: 'Event not found' });
            }
            await event.destroy();
            res.status(204).end();
        } catch (err) {
            res.status(400).json({ message: 'Error deleting event', error: err.message });
        }
    }

}

module.exports = access;