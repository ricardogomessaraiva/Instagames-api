var Schema = require('mongoose').Schema;
var Post = new Schema({
    name: String,
    username:String,
    platform:String,
    title:String,
    description:String,
    imageURL: String,
    createdAt: String,
    likes: Number,
    dislikes: Number,
    comments : []
});

module.exports = require('mongoose').model('Post',Post);