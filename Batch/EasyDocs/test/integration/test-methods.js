const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { User } = require('../../models/users');
const { Document } = require('../../models/docs');
const { Msg } = require('../../models/msgs');

const getToken = () => {      // generate token wwith test1's id
    return jwt.sign({ _id: '5c8d0b92afbb4312bdd415be' }, config.get('jwt'));
}

const populateDB = async () => {    // creating test users
    const password = '12345678';    
    const salt = await bcrypt.genSalt(10);
    const pass =  await bcrypt.hash(password,salt);
    await User.collection.insertMany([
        { _id: mongoose.Types.ObjectId('5c8d0b92afbb4312bdd415be'), email: 'test1@easydocs.com', firstName: 'test1', lastName: 'test1', password: pass },
        { email: 'test2@easydocs.com', firstName: 'test2', lastName: 'test2', password: pass }
    ])
};

const populateDB_docs = async () => {   // create test documents
    await Document.collection.insertMany([
        { title: 'SB37', body: 'Space issue', type: { name: 'errc' }, client: { name: 'company1' }, user:'1' },
        { title: 'OJCV', body: 'Variable substitution has failed', type: { name: 'errc' }, client: { name: 'company1' }, user:'1' },
        { title: 'zIPL', body: 'Implement IPL', type: { name: 'proc' }, client: { name: 'company1' }, user:'2' },
        { title: 'Spool', body: 'Clear out SPOOL', type: { name: 'errc' }, client: { name: 'company2' }, user:'2' }
    ]);
};

const populateDB_msgs = async () => {   // create test documents
    await Msg.collection.insertMany([
        { title: 'New not 1', body: 'Beware of IPL on Saturday', client: { name: 'company1' }, user: { name: 'Tamas'} },
        { title: 'New not 2', body: 'Beware of updated documents', client: { name: 'company1' }, user: { name: 'Roland' } },
        { title: 'New not 3', body: 'Please contact oncall if any SAP Belgian job fails', client: { name: 'company1' }, user: { name: 'Tamas'} },
        { title: 'New not 4', body: 'Change on FLZ1 from 18.00-20.00', client: { name: 'company2' }, user: { name: 'Roland'} }
    ]);
}

const deleteFromDB = async () => {
    await Msg.deleteMany({});
    await User.deleteMany({});
    await Document.deleteMany({});
}

exports.getToken = getToken;        //generate an auth token
exports.populateDB = populateDB;    //prepopulate test-DB users
exports.populateDB_docs = populateDB_docs; // prepopulate test-DB docs
exports.populateDB_msgs = populateDB_msgs; // prepopulate test-DB msgs
exports.deleteFromDB = deleteFromDB; //delete all from DBs