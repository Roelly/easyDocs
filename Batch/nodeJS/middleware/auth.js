const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = async (req,res,next) => {
    try {
        const token = req.header('x-auth-token');

        if(!token) 
            return res.status(401).send('You are not authorized for this operation.');

        const decoded = jwt.verify(token, config.get('jwt'));

        req.user = decoded;

        next();
    }
    catch(ex){
        return res.status(400).send('Invalid token.');
    }

}