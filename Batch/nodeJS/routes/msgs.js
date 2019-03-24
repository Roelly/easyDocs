const express   = require('express');
const router    = express.Router();
const _         = require('lodash');

const { Msg, 
        validateMsg }   = require('../models/msgs');
const { Client }        = require('../models/clients');
const { User }          = require('../models/users');

router.get('/', async (req,res) => {
    const query = req.query;
    
    const msgs = await Msg.find(query);
        if(!msgs || msgs == '') return res.status(404).send(`No document was found!`);

    res.send(msgs);
});

router.get('/:client', async (req,res) => {
    const query = req.query;
    query['client.name'] = req.params.client;

    const msgs = await Msg.find(query);
        if(!msgs || msgs =='') return res.status(404).send('No document was found!');

    res.status(200).send(msgs);
});

router.post('/', async (req,res) => {
    const { error } = validateMsg(req.body);
        if(error) res.status(400).send(error.details[0].message);
        
    const client = await Client.findById(req.body.clientID);
        if(!client) return res.status(400).send('Invalid client!');

    const user = await User.findById(req.user._id, '-password');
        if(!user) return res.status(400).send('Invalid user!');

    const msg = new Msg({
        title: req.body.title,
        body: req.body.body,
        client: _.pick(client,['_id','name']),
        user:  _.pick(user,['_id','firstName','lastName','email'])
    });

    await msg.save();

    res.status(200).send(msg);
});

module.exports = router;