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
    var response = helper.uploadFile(req.body.imgName, req.body.imgPath, 'uploads');
    if (response.error) {
        res.status(500).json({ message: response.message });
        return;
    }
    var imageFinalPath = response.destinationPath;
    var imageName = response.name;

    var post = new Post({
        name: req.body.name,
        username: req.body.username,
        platform: req.body.platform,
        title: req.body.title,
        description: req.body.description,
        imageName: imageName,
        createdAt: moment(new Date()).format('DD-MM-YYYY HH:mm'),
        likes: 0,
        dislikes: 0,
        comments: []
    });

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

        post.comments.push({
            "name": req.body.author,
            "comment": req.body.comment,
            "createdAt": moment(new Date()).format('DD-MM-YYYY HH:mm')
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

module.exports.getImage = function (req, res) {    
    var fs = require('file-system');
    fs.readFile('./app/uploads/' + req.params.image, function (err, content) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.writeHead(200, { 'content-type': 'image/jpg' });
            res.end(content);
        }
    });
};
