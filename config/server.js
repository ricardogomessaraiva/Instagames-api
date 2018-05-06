//const PORT = process.env.PORT;

module.exports = function () {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');    
    var mongoose = require('mongoose'),
        es6Promise = require('es6-promise');
    mongoose.Promise = es6Promise.Promise;

    mongoose.connect('mongodb://admin:245182@ds014648.mlab.com:14648/posts');


    //MIDDLEWARES
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());    

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader("Access-Control-Allow-Credentials", true);

        next();
    });

    app.listen(5001);
    console.log("API Server is up on port 5001 at " + Date());

    require('../app/routes/route')(express, app);


};