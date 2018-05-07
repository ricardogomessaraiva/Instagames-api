var fs = require('file-system');
module.exports.uploadFile = function (imgName, originalPath, applicationFolder) {
    var time_stamp = new Date().getTime();
    imgName = time_stamp + '_' + imgName;

    var path = require('path');
    var appDir = path.dirname(require.main.filename);
    var _destinationPath = appDir + '/app/' + applicationFolder + '/' + imgName;

    console.log(_destinationPath);
    var response = { error: false, message: null, name: imgName, destinationPath: _destinationPath };

    console.log('destino -> ' + _destinationPath);
    console.log('original path: ' + originalPath);


    fs.createReadStream(originalPath).pipe(fs.createWriteStream(_destinationPath), function (error) {
        if (error) {
            console.log('Falha ao fazer upload do arquivo: ' + error);
            response = { error: true, message: error };
        }
    });

    console.log(response);
    return response;
};
