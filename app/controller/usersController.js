var Users = require('../models/users');

module.exports.validation = function (req, res) {    
    console.log('API user validation');    
    
    var User = new Users({
        username: req.body.username,
        password: req.body.password
    });

    Users.findOne({ 'username': req.body.username, 'password': req.body.password },
        function (err, _user) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Ocorreu um erro: ' + err, user: null });
                
            }

            if (_user == null) {
                return res.status(404).json({ message: 'Usuário/senha inválido.', user: null });
                
            }

            res.status(200).json({ message: 'Usuário validado com sucesso!', user: _user });

        });
};

module.exports.add = function(req, res){
    console.log('chegou no add')
    Users.findOne({ 'username': req.body.username }, function (err, _user) {
        if (err) {            
            return res.status(500).json({ message: 'Falha ao consultar existência do usuário: '+err, user: null });            
        }

        if (_user != undefined) {
            return res.status(409).json({ message: 'Já existe um cadastro com estes usuário.', user: null });                        
        }        

    });

    var User = new Users({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        createdAt: new Date()
    });

    User.save(function (error, _user) {
        if (error) {
            return res.status(500).json({ message: 'Falha ao adicionar usuario: '+err, user: null });                         
        }                

        return res.status(200).json({ message: 'Usuário criado com sucesso!', user: _user });

    });
};