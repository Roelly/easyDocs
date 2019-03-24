const winston = require('winston');
require('winston-mongodb');

module.exports = function(){

    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.MongoDB({
            db: 'mongodb://localhost/batch_errors',
            level: 'info'
        })
    );
    
    process.on('unhandledRejection', (ex) => {
        throw new Error(ex);
    });

    winston.add(winston.transports.File, { filename: 'logfile.log' });
    winston.add(winston.transports.MongoDB, { 
        db: 'mongodb://localhost/batch_errors',
        level: 'info'
    });
}