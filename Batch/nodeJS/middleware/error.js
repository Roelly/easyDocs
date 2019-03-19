

module.exports = function(err,req,res,next){
    console.log(`Error:  ${err}`);

    // winston.log('error', err.message);

    res.status(500).send('Something failed.');
};