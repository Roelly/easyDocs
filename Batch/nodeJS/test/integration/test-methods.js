const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const { User } = require('../../models/users');
const { Document } = require('../../models/docs');

const getToken = async () => {
    return await jwt.sign({ _id: '5c8d0b92afbb4312bdd415be' }, config.get('jwt'));
}

const populateDB = async () => {
    const password = '12345678';    // creating user
    const salt = await bcrypt.genSalt(10);
    const pass =  await bcrypt.hash(password,salt);
    await User.collection.insertMany([
        { email: 'test1@easydocs.com', firstName: 'test1', lastName: 'test1', password: pass },
        { email: 'test2@easydocs.com', firstName: 'test2', lastName: 'test2', password: pass }
    ])
};

const populateDB_docs = async () => {
    await Document.collection.insertMany([
        { title: 'SB37', body: 'Space issue', type:'ERRC', user:'1' },
        { title: 'IPL', body: 'Implement IPL', type:'PROC', user:'2' }
    ]);
}

exports.getToken = getToken;        //generate an auth token
exports.populateDB = populateDB;    //prepopulate test-DB users
exports.populateDB_docs = populateDB_docs; // prepopulate test-DB docs