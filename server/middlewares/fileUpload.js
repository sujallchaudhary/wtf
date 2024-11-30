// uploadMiddleware.js

const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config();
const cdnEndpoint='https://tf-storage.blr1.cdn.digitaloceanspaces.com/'
const spacesEndpoint = new AWS.Endpoint('https://blr1.digitaloceanspaces.com');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY
});
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('file');
const uploadFile = (req, res, next) => {
    upload(req, res, function (err) {

        if(!req.file){
            return next();
        }

        if (err) {
            return res.status(400).json({ error: 'File upload error', details: err.message });
        }
        const fileKey = `profile/${Date.now()}${path.extname(req.file.originalname)}`;
        const params = {
            Bucket: process.env.DO_SPACE_NAME,  // Your DigitalOcean Space name
            Key: fileKey,                       // File name in the Space
            Body: req.file.buffer,              // File content from multer
            ACL: 'public-read',                 // Public read access
            ContentType: req.file.mimetype      // File MIME type
        };
        s3.upload(params, (error, data) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to upload file', details: error.message });
            }
            req.body.file= cdnEndpoint+fileKey;
            next();
        });
    });
};

module.exports = uploadFile;
