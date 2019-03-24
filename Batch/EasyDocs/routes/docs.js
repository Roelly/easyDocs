const express   = require('express');
const router    = express.Router();
const _         = require('lodash');

const { Document, 
        validateDoc }   = require('../models/docs');
const { User }          = require('../models/users');
const { Type }          = require('../models/types');
const { Client }        = require('../models/clients');

router.get('/:client/:type', async (req,res) => {
    const query = req.query;
    query['client.name'] = req.params.client
    query['type.name'] = req.params.type

    const doc = await Document.find(query);
    if(!doc[0]) return res.status(404).send('Document was not found');

    res.status(200).send(doc);
});

router.post('/', async (req,res) => {

    const { error } = validateDoc(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(400).send('Invalid user!');

    const type = await Type.findById(req.body.typeID);
    if(!type) return res.status(400).send('Invalid type!');

    const client = await Client.findById(req.body.clientID);
    if(!client) return res.status(400).send('Invalid client!');

    const doc = new Document({
        title: req.body.title,
        body: req.body.body,
        type: _.pick(type, ['_id','name']),
        client: _.pick(client,['_id','name']),
        user: _.pick(user,['_id','firstName','lastName','email'])
    });

    await doc.save();

    res.status(200).send(doc);
});

module.exports = router;