const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcrypt');

const { User }  = require('../models/users')

router.post('/', async (req,res) => {
    const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(400).send('Invalid email or password');
    
    const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid) return res.status(400).send('Invalid password');

    const token = user.generateAuthToken();

    res.status(200).send({token: token});
});

module.exports = router;