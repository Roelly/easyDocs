const express = require('express');
const router = express.Router();

const { User } = require('../models/users');

router.get('/', async (req,res) => {
    const users = await User.find();
})

router.post('/', async (req,res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    const isValid = await user.validateUser(user);
    if(!isValid)
        return res.status(400).send(err);
        
    user.password = await user.hash(user.password);

    await user.save();
    
    console.log(user);

    res.send(user);
})

module.exports = router;