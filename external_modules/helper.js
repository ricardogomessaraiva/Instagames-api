module.exports.upload = function (imgName, originalPath) {
    imgName = new Date().getTime() + '_' + imgName;
    var response = { error: false, imageName: imgName, message: 'Upload realizado com sucesso!' }
        fileStream = require('file-system').createReadStream(originalPath),
        params = {
            Bucket: CONFIG.get('AWS_S3.BUCKET_NAME'),
            Key: imgName,
            Body: fileStream
        };

    var AWS = require('aws-sdk'),
        s3 = new AWS.S3({
            accessKeyId: CONFIG.get('AWS_S3.ACCESS_KEY'),
            secretAccessKey: CONFIG.get('AWS_S3.USER_SECRET'),
            Bucket: CONFIG.get('AWS_S3.BUCKET_NAME')
        });

    s3.putObject(params, function (err, data) {
        if (err) {
            response = { error: true, imageName: imgName, message: err.stack };
        }       
    });

    return response;
};
