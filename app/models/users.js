var Schema = require('mongoose').Schema;

var Users = new Schema({
    name: String,
    username: String,
    password: String,
    createdAt: Date
});

module.exports = require('mongoose').model('Users',Users);