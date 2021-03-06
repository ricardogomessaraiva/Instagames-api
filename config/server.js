const PORT = (process.env.PORT || 5001);

module.exports = function () {
    var express = require('express'),
        app = express();

    global.CONFIG = require('config');

    var bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        es6Promise = require('es6-promise');
    mongoose.Promise = es6Promise.Promise;

    mongoose.connect('mongodb://admin:245182@ds014648.mlab.com:14648/posts');

    //MIDDLEWARES
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader("Access-Control-Allow-Credentials", true);

        next();
    });

    require('../app/routes/route')(express, app);

    console.log("API Server is up on port " + PORT + " at " + Date());
    app.listen(PORT);



};