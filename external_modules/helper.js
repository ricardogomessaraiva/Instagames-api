module.exports.upload = function (body) {    
    var fs = require('file-system'),
        buffer = new Buffer(body.imageBuffer.data, 'base64'),
        imgName = new Date().getTime() + '_' + body.imgName,
        response = { error: false, imageName: imgName, message: 'Upload realizado com sucesso!' },
        params = {
            Bucket: CONFIG.get('AWS_S3.BUCKET_NAME'),
            Key: imgName,
            Body: buffer
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
