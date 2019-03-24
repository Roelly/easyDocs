const config = require('config');

module.exports = () => {
    if(!config.get('jwt')) 
        throw new Error("FATAL ERROR: jwt is not defined!");
};

