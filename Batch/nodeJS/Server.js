const express = require('express');
const app = express();

require('./startup/log')();         // logging to file log.json
require('./startup/routes')(app);   // routes defined here
require('./startup/dbinit')();      // db initialization


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
})

module.exports = server; // exporting for supertest