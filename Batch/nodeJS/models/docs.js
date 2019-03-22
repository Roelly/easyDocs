const mongoose = require('mongoose');
const Joi = require('joi');

const { publicUserSchema } = require('../models/users');
const { typeSchema } = require('../models/types');
const { clientSchema } = require('../models/clients');

const docSchema = new mongoose.Schema({
    title:          { type: String, minlength: 3, required: true },
    body:           { type: String, minlength: 25, required: true },
    type:           { type: typeSchema, required: true },
    client:         { type: clientSchema },
    date:           { type: Date, default: Date.now() },
    isOutdated:     { type: Boolean, default: false }, //will be handled on frontend
    modified:       { type: Date },
    user:           { type: publicUserSchema, required: true },
    modified_user:  { type: publicUserSchema },
    checkCount:     { type: Number, default: 0 },
    checkedBy:      { type: Array, default: [] }
})
// outdated

const Document = mongoose.model('documents', docSchema);

const validateDoc = function(doc){
    const schema = {    // date, modif, isvalid, validuntil
        title : Joi.string().required().min(4),
        body: Joi.string().required().min(25),
        typeID: Joi.string().required(),
        clientID: Joi.string().required(),
        userID : Joi.string().required(),
        modified: Joi.date()
    };
    return Joi.validate(doc, schema);
}

exports.Document = Document;
exports.validateDoc = validateDoc;