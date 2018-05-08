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
    var response = helper.upload(req.body.imgName, req.body.imgPath);    

    if (response.error) {
        return res.status(500).json({ message: 'Ocorreu um erro: ' + response.message });
    }

    var imageName = response.imageName;    

    var post = new Post({
        name: req.body.name,
        username: req.body.username,
        platform: req.body.platform,
        title: req.body.title,
        description: req.body.description,
        imageURL: 'https://s3.amazonaws.com/instagames/images/' + imageName,
        createdAt: moment(new Date()).format('DD-MM-YYYY HH:mm'),
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

module.exports.image = function (req, res) {
    console.log('Nome imagem -------> ' + req.params.image);
    var imageName = req.params.image;

    var fs = require('file-system'),
        AWS = require('aws-sdk'),
        s3 = new AWS.S3({
            accessKeyId: CONFIG.get('AWS_S3.ACCESS_KEY'),
            secretAccessKey: CONFIG.get('AWS_S3.USER_SECRET'),
            Bucket: CONFIG.get('AWS_S3.BUCKET_NAME')
        });

    var params = {
        Bucket: CONFIG.get('AWS_S3.BUCKET_NAME'),
        Key: imageName
    };

    var file = fs.createWriteStream('./app/uploads/' + imageName, function (error) {
        console.log('deu erro aqui professora')
    });

    // s3.getObject(params).createReadStream().pipe(file).on('error', error => {        
    //     console.log(error);
    // });

    fs.readFile('./app/uploads/1525739272646_samurai_shadown.jpeg', function (err, content) {
        if (err) {
            console.log(err);
            return res.end();
        } else {
            res.writeHead(200, { 'content-type': 'image/jpg' });
            return res.end(content);
        }
    });


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
    console.log('Nome imagem ->> ' + req.params.image);
    var imageName = req.params.image;

    var fs = require('file-system'),
        AWS = require('aws-sdk'),
        s3 = new AWS.S3({
            accessKeyId: CONFIG.get('AWS_S3.ACCESS_KEY'),
            secretAccessKey: CONFIG.get('AWS_S3.USER_SECRET'),
            Bucket: CONFIG.get('AWS_S3.BUCKET_NAME')
        });

    var params = {
        Bucket: CONFIG.get('AWS_S3.BUCKET_NAME'),
        Key: imageName
    };

    console.log(params);
    var file = fs.createWriteStream('./app/uploads/' + imageName);

    s3.getObject(params).createReadStream().pipe(file);

    fs.readFile('./app/uploads/1525732462318_samurai_shadown.jpeg', function (err, content) {
        //fs.readFile('./app/uploads/1525732462319_samurai_shadown.jpeg', function (err, content) {
        //fs.readFile('./app/uploads/' + imageName, function (err, content) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.writeHead(200, { 'content-type': 'image/jpg' });
            res.end(content);
        }
    });


};

