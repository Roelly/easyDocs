const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:  { type: String, minlength: 4, required: true },
    lastName:   { type: String, minlength: 4, required: true },
    email:      { type: String, minlength: 11, required: true },
    password:   { type: String, minlength: 10, required: true }
});

userSchema.methods.generateAuthToken = function(){
    // return jwt.sign({ })
};

userSchema.methods.hash = async function (password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
};

userSchema.methods.compare = function(password){
    return bcrypt.compare(password, user.password);
}

userSchema.methods.validateUser = function(user){
    const schema = {
        firstName:  Joi.required().min(4).String(),
        lastName:   Joi.required().min(4).String(),
        email:      Joi.required().min(11).email(),
        password:   Joi.required().min(8).String(),
    };
    
    return Joi.validate(user,schema);
}

const User = mongoose.model('users',userSchema);



exports.User = User;