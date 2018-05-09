var Post = require('../models/post'),
    moment = require('moment'),
    helper = require('../../external_modules/helper');

module.exports.getPosts = function (req, res) {
    Post.find().sort({ createdAt: 'desc' }).exec(
        function (error, response) {
            if (error) {
                console.log('API get posts fail.');
                res.status(500).json({ message: 'Ocorreu um erro: ' + error, posts: null });
                return;
            }

            console.log('API get posts successful');
            res.status(200).json({ message: 'Busca realizada com sucesso!', posts: response });
        });
};

module.exports.save = function (req, res) {
    var response = helper.upload(req.body);

    if (response.error) {
        return res.status(500).json({ message: 'Ocorreu um erro: ' + response.message });
    }

    var imageName = response.imageName;
    var date = new Date();
    date.setHours(date.getHours() - 3);
    date = moment(date).format('DD-MM-YYYY HH:mm');//To represent datetime from Brazil in production

    var post = new Post({
        name: req.body.name,
        username: req.body.username,
        platform: req.body.platform,
        title: req.body.title,
        description: req.body.description,
        imageURL: 'https://s3.amazonaws.com/instagames/images/' + imageName,
        // createdAt: moment(new Date()).format('DD-MM-YYYY'),
        createdAt: date,
        likes: 0,
        dislikes: 0,
        comments: []
    });

    console.log(post);
    post.save(function (error) {
        if (error) {
            res.status(500).json({ message: 'Ocorreu um erro: ' + error });
            return;
        }

        res.status(201).json({ message: 'Dados salvos com sucesso!' });
    })
};

module.exports.comment = function (req, res) {
    Post.findById(req.body.id, function (error, post) {
        if (error) {
            res.json(error);
        }

        var date = new Date();
        date.setHours(date.getHours() - 3);
        date = moment(date).format('DD-MM-YYYY HH:mm');//To represent datetime from Brazil in production

        post.comments.push({
            "name": req.body.author,
            "comment": req.body.comment,
            // "createdAt": moment(new Date()).format('DD-MM-YYYY HH:mm')
            "createdAt": date
        });

        console.log(post);

        post.save(function (error) {
            if (error) {
                res.status(500).json({ message: 'Ocorreu um erro: ' + error });
            }
        });


        console.log({ status: 201, message: 'Dados salvos com sucesso!' });
        res.status(201).json({ message: 'Dados salvos com sucesso!' });
    });
};

module.exports.feedback = function (req, res) {
    Post.findById(req.body.id, function (error, post) {
        if (error) {
            res.json(error);
        }

        if (req.body.feedback == "liked") {
            post.likes += 1;
        } else {
            post.dislikes += 1;
        }

        post.save(function (error) {
            if (error) {
                res.status(500).json({ message: 'Ocorreu um erro: ' + error });
            }
        });

        console.log({ status: 201, message: 'Dados salvos com sucesso!' });
        res.status(201).json({ message: 'Dados salvos com sucesso!' });
    });
};
