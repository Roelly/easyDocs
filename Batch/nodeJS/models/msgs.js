const mongoose = require('mongoose');
const Joi = require('joi');

const { publicUserSchema } = require('./users');
const { clientSchema } = require('./clients');


const msgSchema = new mongoose.Schema({
    title:      { type: String, minlength: 4, required: true },
    body:       { type: String, minlength: 10, required: true },
    user:       { type: publicUserSchema },
    client:     { type: clientSchema },
    date:       { type: Date, default: Date.now() },
    modified:   { type: Date },
    valid:      { type: Date },
    isValid:    { type: Boolean, default: true }
});

const Msg = mongoose.model('messages', msgSchema);

const validateMsg = function(msg){
    const schema = { 
        title: Joi.string().min(4).required(),
        body: Joi.string().min(10).required(),
        userID: Joi.string().required(),
        clientID: Joi.string().required(),
        modified: Joi.date(),
        valid: Joi.date()
    };
    return Joi.validate(msg,schema);
}

exports.Msg = Msg;
exports.validateMsg = validateMsg;