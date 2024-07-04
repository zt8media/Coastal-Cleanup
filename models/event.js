const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'events'
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Events table has been synced successfully.');
    })
    .catch(err => {
        console.error('Unable to sync the events table:', err);
    });

module.exports = Event;
