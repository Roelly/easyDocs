const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const config = require('config');

const publicUserSchema = new mongoose.Schema({
    firstName:  { type: String, minlength: 4, required: true },
    lastName:   { type: String, minlength: 4, required: true },
    email:      { type: String, minlength: 11, required: true }
});

const userSchema = new mongoose.Schema({
    firstName:  { type: String, minlength: 4, required: true },
    lastName:   { type: String, minlength: 4, required: true },
    email:      { type: String, minlength: 11, required: true },
    password:   { type: String, minlength: 10, required: true }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this.id }, config.get('jwt'));
    return token;
};

userSchema.methods.hash = async function (password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
};

const User = mongoose.model('users',userSchema);

const validateUser = (user) => {
    const schema = {
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(3),
        email: Joi.string().required().min(11).email(),
        password: Joi.string().required().min(8)
    };
    return Joi.validate(user,schema);
}

exports.User = User;
exports.publicUserSchema = publicUserSchema;
exports.validateUser = validateUser;
