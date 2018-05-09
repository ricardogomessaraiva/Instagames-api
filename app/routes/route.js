var postsController = require('../controller/postsController');
var usersController = require('../controller/usersController');

module.exports = function (express, app) {
    var router = express.Router();

    /********** Entity Post *********/
    router.route('/posts')
        .get(function (req, res) {
            postsController.getPosts(req, res);
        })

        .post(function (req, res) {            
            postsController.save(req, res);
        });

    router.route('/posts/comment')
        .put(function (req, res) {
            postsController.comment(req, res);
        });

    router.route('/posts/feedback')
        .put(function (req, res) {
            postsController.feedback(req, res);
        });   

    /********** Entity User *********/
    router.route('/user')
        .post(function (req, res) {
            usersController.validation(req, res)
        });

    router.route('/user/new')
        .post(function (req, res) {
            usersController.add(req, res);
        });


    app.use('/api', router);
    return router;
};