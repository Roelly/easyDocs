const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    firstName:  { type: String, minlength: 4, required: true },
    lastName:   { type: String, minlength: 4, required: true },
    email:      { type: String, minlength: 11, required: true }
});

const docSchema = new mongoose.Schema({
    title:          { type: String, minlength: 4, required: true },
    body:           { type: String, minlength: 25, required: true },
    type:           { type: String, minlength: 4, required: true },
    date:           { type: Date, default: Date.now() },
    modified:       { type: Date },
    user:           { type: userSchema },
    modified_user:  { type: userSchema }
})

const Document = mongoose.Schema('documents', docSchema);

const validateDoc = function(doc){
    const schema = {
        title : Joi.string().required().min(4),
        body: Joi.string().required().min(25),
        type: Joi.string().required().min(4),
        userId : Joi.objectId().required()
    };
    return Joi.validate(doc, schema);
}

exports.Document = Document;
exports.validateDoc = validateDoc;