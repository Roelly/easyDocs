const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: { type: String, minlength: 4, required: true }
});

const Type = mongoose.model('types', typeSchema);

exports.typeSchema = typeSchema;
exports.Type = Type;