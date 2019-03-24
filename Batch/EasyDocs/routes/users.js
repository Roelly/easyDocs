const express   = require('express');
const router    = express.Router();
const _         = require('lodash');

const { User, 
        validateUser } = require('../models/users');

router.get('/', async (req,res) => {
    const users = await User.find();
        if(!users) return res.status(404).send('No user found');

    res.send(users);
});

router.post('/', async (req,res) => {
    const { error } = validateUser(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
    const user = new User(_.pick(req.body, ['firstName','lastName','email','password']));

    user.password = await user.hash(user.password);
    await user.save();
    
    res.send(user);
})

module.exports = router;