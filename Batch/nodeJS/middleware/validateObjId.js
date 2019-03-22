const mongoose = require('mongoose');

module.exports = (req,res,next) => {
    if(!mongoose.Types.ObjectId(req.params.id))
        res.status(404).send('Invalid ID');

    next();
}