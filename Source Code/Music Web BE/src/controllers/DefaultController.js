const multer = require('multer');
const { uploadCloudImage, uploadCloudMusic } = require('../core/config/upload.config');

class DefaultController {

    /*
        Đăng music
        [POST] /music
    */
        uploadMusic(req, res) {
            uploadCloudMusic(req, res, async err => {
                if(err instanceof multer.MulterError) return res.status(401).json({error: { message: err.field}, success: false});
                if(err) return res.status(400).json({data: {}, message: "Only .mp3, .ogg format allowed!", success: false});
                if(!req.file) return res.status(400).json({data: {}, message: "Music file is required", success: false});
                
                res.status(200).json({
                    data: {
                        path: req.file.path
                    },
                    success: true,
                    message: "Đăng music thành công"
                })
            }) 
        }

    /*
        Đăng ảnh
        [POST] /image
    */
    uploadImage(req, res) {
        uploadCloudImage(req, res, async err => {
            if(err instanceof multer.MulterError) return res.status(401).json({error: { message: err.field}, success: false});
            if(err) return res.status(400).json({data: {}, message: "Only .png, .jpg and .jpeg format allowed!", success: false});
            if(!req.file) return res.status(400).json({data: {}, message: "Image is required", success: false});
            
            res.status(200).json({
                data: {
                    path: req.file.path
                },
                success: true,
                message: "Đăng ảnh thành công"
            })
        }) 
    }
}

module.exports = new DefaultController();