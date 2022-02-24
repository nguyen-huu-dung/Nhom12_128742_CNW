const { uploadCloudImage, cloudinary, uploadCloudMusic } = require('../core/config/upload.config');
const { Error400 } = require('../core/httpError');
const { MusicService } = require('../services');
const { loggerStart, loggerEnd, loggerError, removeVietnameseTones } = require("../utils/helpers/supports");
const { musicValidate } = require('../utils/validates/music.validate');
const BaseController = require('./BaseController');
const mongoose = require('mongoose');
const { IMAGE_MUSIC_DEFAULT_NAME, MUSIC_DEFAULT_NAME } = require('../core/constants');

class MusicController extends BaseController {

    constructor() {
        super();
        this.musicService = MusicService;
    }

    // [GET] /music   ( get all music or get with keySearch or get with category)
    async asyncGetAllMusic(req, res, next) {
        const LOG_TITLE = "Get All Music";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {   
            const { slugCategory, keySearch } = req.query;

            if(keySearch !== "" && keySearch !== undefined) {
                ret = await this.musicService.asyncGetAll({ status: "active" });
                const key = removeVietnameseTones(keySearch);
                ret = ret.filter((music) => {
                    const name = removeVietnameseTones(music.name).toLowerCase();
                    const singer = removeVietnameseTones(music.singer).toLowerCase();
                    return name.includes(key) || singer.includes(key);
                })
                return;
            }

            if(slugCategory === "all") {
                ret = await this.musicService.asyncGetAll({ status: "active" });
            }
            else {
                // check existed slug category
                const existedCategory = await this.musicService.asyncFindCategory({ slug_category: slugCategory });
                if(!existedCategory) {
                    ret = new Error400("Thể loại không tồn tại");
                    return;
                }

                ret = await this.musicService.asyncGetAll({ status: "active", categoryId: existedCategory._id });
            }
        } catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally{
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "Thành công");
        }
    }

    // [POST] /music
    async asyncCreateMusic(req, res, next) {
        const LOG_TITLE = "Create music";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = musicValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret = await this.musicService.asyncCreateMusic(req.body);
        } catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally{
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "Đã thêm bài hát mới");
        }
    }

    // [PUT] /music/:musicId/play_music
    async asyncPlayMusic(req, res, next) {
        const LOG_TITLE = "Play music";
        loggerStart(LOG_TITLE);

        let ret = null;
        let existedMusic = null;
        try {
            const { musicId } = req.params;
            
            // check existed musicId
            existedMusic = await this.musicService.asyncFindMusic({ _id: mongoose.Types.ObjectId(musicId)});
            if(!existedMusic) {
                ret = new Error400('Bài hát không tồn tại');
                return;
            }
            ret = await this.musicService.asyncUpdateMusic({_id: mongoose.Types.ObjectId(musicId)}, { viewer: existedMusic.viewer + 1, updatedAt: Date.now() });
            ret = { ...ret._doc, categoryId: existedMusic.categoryId }
        } catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally{
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "");
        }
    }


    // [PUT] /music/:musicId
    async asyncUpdateInfoMusic(req, res, next) {
        const LOG_TITLE = "Update music";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = musicValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret = await this.musicService.asyncUpdateInfoMusic(req.params, value);
        } catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally{
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "Cập nhật bài hát thành công");
        }
    }

    // [PUT] /music/:musicId/change_image
    async asyncChangeImage(req, res, next) {
        uploadCloudImage(req, res, async err => {
            const LOG_TITLE = "Change image";
            loggerStart(LOG_TITLE);

            let ret = null;
            try {
                const { musicId } = req.params;
                // Kiểm tra xem music có tồn tại không?
                const existedMusic = await this.musicService.asyncFindMusic({_id: mongoose.Types.ObjectId(musicId), status: 'active'});
                if(!existedMusic) {
                    ret = new Error400("Bài hát không tồn tại");
                    return;
                } 

                if(err) {
                    ret = new Error400("Only .png, .jpg and .jpeg format allowed!");
                    return;
                }
                if(!req.file) {
                    ret = new Error400("Image file là bắt buộc");
                    return;
                }

                if(existedMusic.image_cloud_name !== IMAGE_MUSIC_DEFAULT_NAME) {
                    await cloudinary.uploader.destroy(existedMusic.image_cloud_name);
                }

                ret = await this.musicService.asyncUpdateMusic({_id: mongoose.Types.ObjectId(musicId)}, { image: req.file.path, image_cloud_name: req.file.filename, updatedAt: Date.now() });
                ret = { ...ret._doc, categoryId: existedMusic.categoryId }
            } catch (error) {
                loggerError(LOG_TITLE, error.message);
                res.status(500).json({
                    data: null,
                    success: false,
                    message: error.message
                })
            }
            finally{
                loggerEnd(LOG_TITLE);
                // xử lý response trả về
                this.processHTTPResponse(res, ret, "Cập nhật ảnh bài hát thành công");
            }
        })
    }

    // [PUT] /music/:musicId/change_music
    async asyncChangeMusic(req, res, next) {
        uploadCloudMusic(req, res, async err => {
            const LOG_TITLE = "Change music";
            loggerStart(LOG_TITLE);

            let ret = null;
            try {
                const { musicId } = req.params;
                // Kiểm tra xem music có tồn tại không?
                const existedMusic = await this.musicService.asyncFindMusic({_id: mongoose.Types.ObjectId(musicId), status: 'active'});
                if(!existedMusic) {
                    ret = new Error400("Bài hát không tồn tại");
                    return;
                } 

                if(err) {
                    ret = new Error400("Only .mp3, .ogg format allowed!");
                    return;
                }
                if(!req.file) {
                    ret = new Error400("Music file là bắt buộc");
                    return;
                }

                if(existedMusic.music_cloud_name !== MUSIC_DEFAULT_NAME) {
                    await cloudinary.uploader.destroy(existedMusic.music_cloud_name);
                }

                ret = await this.musicService.asyncUpdateMusic({_id: mongoose.Types.ObjectId(musicId)}, { music_path: req.file.path, music_cloud_name: req.file.filename, updatedAt: Date.now() });
                ret = { ...ret._doc, categoryId: existedMusic.categoryId }
            } catch (error) {
                loggerError(LOG_TITLE, error.message);
                res.status(500).json({
                    data: null,
                    success: false,
                    message: error.message
                })
            }
            finally{
                loggerEnd(LOG_TITLE);
                // xử lý response trả về
                this.processHTTPResponse(res, ret, "Cập nhật source bài hát thành công");
            }
        })
    }
    
    // [DELETE] /music/:musicId
    async asyncDeleteMusic(req, res, next) {
        const LOG_TITLE = "Delete music";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { musicId } = req.params;
            await this.musicService.asyncDeleteMusic(musicId);
        } catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally{
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "Xóa bài hát thành công");
        }
    } 
}

module.exports = new MusicController();