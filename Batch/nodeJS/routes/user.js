const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const { User, validateUser } = require('../models/users');


router.get('/', auth, async (req,res) => {
    const users = await User.find();
    if(!users) return res.status(404).send('No user found');
    res.send(users);
});

router.post('/', auth, async (req,res) => {
    const { error } = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message); // -issue- skipped due to catching up error.middleware : UPDATE - the error was caused by "await"
    
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
            
    user.password = await user.hash(user.password);
    await user.save();
    
    res.send(user);
})

module.exports = router;