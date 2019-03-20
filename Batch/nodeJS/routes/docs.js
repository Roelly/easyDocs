const express = require('express');
const router = express.Router();

const { Document, validateDoc } = require('../models/docs');

router.get('/', auth ,async () => { //continue here...
    const docs = await Document.find();

    res.send(docs);
});

module.exports = router;