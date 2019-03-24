const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => winston.info(`Connected to ${db}...`));
}