var express = require('express');
var path = require('path')
var multer = require('multer');
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const app = express();

app.post('/upload', (req, res) => {
    var storageConfig = multer.diskStorage({
        destination: './uploads'
    });

    var upload = multer({ storage: storageConfig }).single('myFile');
    upload(req, res, (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        cloudinary.config({
            cloud_name: 'YOUR-CLOUD-NAME',
            api_key: 'YOUR-API-KEY',
            api_secret: 'YOUR-API-SECRET'
        })

        const path = req.file.path
        const uniqueFilename = new Date().toISOString()

        cloudinary.uploader.upload(
            path,
            { public_id: `blog/${uniqueFilename}`, tags: `blog` }, 
            function (err, image) {
                if (err) return res.send(err)
                console.log('file uploaded to Cloudinary')
                // remove file from server
                fs.unlinkSync(path)
                // return image details
                res.send(image)
            }
        )
    });
});

app.listen(3000, () => {
    console.log('listening to the port 3000');
});

