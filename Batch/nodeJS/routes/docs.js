const express = require('express');
const router = express.Router();

/****MIDDLEWARE****/
const auth = require('../middleware/auth');
const validateObjId = require('../middleware/validateObjId');
/****MODELS****/
const { Document, validateDoc } = require('../models/docs');
const { User } = require('../models/users');
const { Type } = require('../models/types');
const { Client } = require('../models/clients');

router.get('/', auth, async (req,res) => { //continue here...
    const docs = await Document.find();
    if(!docs) return res.status(404).send('No document was found!');

    res.status(200).send(docs);
});

router.get('/:id', validateObjId, async (req,res) => {
    const doc = await Document.findById(req.params.id);
    if(!doc) return res.status(404).send('Document was not found');

    res.status(200).send(doc);

})

router.post('/', auth, async (req,res) => {
    const { error } = validateDoc(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userID).select('-password');
    if(!user) return res.status(400).send('Invalid user!');

    const type = await Type.findById(req.body.typeID);
    if(!type) return res.status(400).send('Invalid type!');

    const client = await Client.findById(req.body.clientID);
    if(!client) return res.status(400).send('Invalid client!');

    const doc = new Document({
        title: req.body.title,
        body: req.body.body,
        type: {
            _id: type._id,
            name: type.name
        },
        client: {
            _id: client._id,
            name: client.name
        },
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    });

    await doc.save();

    res.status(200).send(doc);
});

module.exports = router;