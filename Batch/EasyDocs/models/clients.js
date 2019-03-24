const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, minlength: 6, required: true }
});

const Client = mongoose.model('clients', clientSchema);

exports.clientSchema = clientSchema;
exports.Client = Client;