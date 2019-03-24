require('express-async-errors');
const express = require('express');

const sign = require('../routes/sign');
const docs = require('../routes/docs');
const msgs = require('../routes/msgs');
const plan = require('../routes/plan');
const users = require('../routes/users');
const admin = require('../routes/admin');

const error = require('../middleware/error');
const auth = require('../middleware/auth');

module.exports = function(app){
    
    app.use(express.json());

    app.use('/api/sign', sign); // login requests

    app.use(auth);              // authorization wall   >>>
    
    app.use('/api/docs', docs);
    app.use('/api/msgs', msgs);
    app.use('/api/plan', plan);
    app.use('/api/users', users);
    app.use('/api/admin', admin);

    app.use(error);             // catching up internal server errors (500)
}