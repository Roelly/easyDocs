const express   = require('express');
const app       = express();
const winston = require('winston');


require('./startup/config')();      // making sure that env variable is up
require('./startup/log')();         // logging to file log.json
require('./startup/validation')();
require('./startup/routes')(app);   // routes defined here
require('./startup/dbinit')();      // db initialization

const port      = process.env.PORT || 3000;
const server    = app.listen(port, () => { winston.info(`Listening to port ${port}...`) });

module.exports = server; // exporting for supertest

//dev:
// - isadmin -> users
// - blocking certain modification possibilites from normal users
// - angular http request to check if a document is outdated

//prod:
// - notes - before prod jwtprivatekey must be changed to a secret environment variable
// - validation that jwtprivatekey is defined before starting the server
// - find out plan-rota solution
