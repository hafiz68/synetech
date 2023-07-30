const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('Email', {
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Email;