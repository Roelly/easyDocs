require('express-async-errors');    // to avoid try - catch blocks on async functions

const express = require('express');

const sign = require('../routes/sign');
const auth = require('../routes/auth');
const docs = require('../routes/docs');
const msgs = require('../routes/msgs');
const plan = require('../routes/plan');
const user = require('../routes/user');
const admin = require('../routes/admin');

const error = require('../middleware/error');

module.exports = function(app){
    
    app.use(express.json());

    app.use('/api/sign', sign);
    app.use('/api/auth', auth);
    app.use('/api/docs', docs);
    app.use('/api/msgs', msgs);
    app.use('/api/plan', plan);
    app.use('/api/user', user);
    app.use('/api/admin', admin);

    app.use(error);
}