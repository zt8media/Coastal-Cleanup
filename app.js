const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const Event = require('./models/event');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

// API endpoint to get all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// API endpoint to add a new event
app.post('/events', async (req, res) => {
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
});

// API endpoint to update an event
app.put('/events/:id', async (req, res) => {
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
});

// API endpoint to delete an event
app.delete('/events/:id', async (req, res) => {
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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
