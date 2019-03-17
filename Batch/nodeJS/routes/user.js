const express = require('express');
const router = express.Router();

const { User, validateUser } = require('../models/users');


router.get('/', async (req,res) => {
    const users = await User.find({ _id: 1});
    res.send(users);
});

router.post('/', async (req,res) => {
    const { error } = await validateUser(req.body);
    if(error) return await console.log("smthing went wrong", error);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    console.log(user);
        
    // user.password = await user.hash(user.password);

    // await user.save();

    res.send(user);
})

module.exports = router;