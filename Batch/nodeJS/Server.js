const express = require('express');
const app = express();

require('./startup/routes')(app);   // routes defined here
require('./startup/dbinit')();      // db initialization
require('./startup/log')();         // logging to file log.json

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
})