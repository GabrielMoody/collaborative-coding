const {Schema, model} = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new Schema({
  _id: {type: String, required: true, default: uuidv4},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
})

const User = model('User', userSchema);

module.exports = {User};