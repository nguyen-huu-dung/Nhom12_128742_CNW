const BaseController = require('./BaseController');
const { loggerStart, loggerError, loggerEnd } = require("../utils/helpers/supports");
const { CommentService, AccountService } = require("../services");
const { commentValidate } = require('../utils/validates/comment.validate');
const { Error400 } = require('../core/httpError');
const mongoose = require('mongoose');
class CommentController extends BaseController {

    constructor() {
        super();
        this.commentService = CommentService;
        this.accountService = AccountService;
    }
    
    // [GET] /comment/:musicId
    async asyncGetAllComment(req, res, next) {
        const LOG_TITLE = "Get all comment";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { musicId } = req.params;
            // check existed music
            const existedMusic = await this.commentService.asyncFindMusic(musicId);
            if(!existedMusic) {
                ret = new Error400("Không tồn tại bài hát");
                return;
            }
            ret = await this.commentService.asyncGetAllComment(musicId);
            ret = { comments: ret, totalComment: ret.length  };
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

    // [POST] /comment/:musicId
    async asyncCreateNewComment(req, res, next) {
        const LOG_TITLE = "New comment";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {   
            const { error, value } = commentValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            const {id:accountId} = res.locals.decoded;
            const {musicId} = req.params;

            ret =  await this.commentService.asyncCreateNewComment({ ...req.body,accountId,musicId,createdAt: Date.now() });
            const accountInfo = await this.accountService.asyncFindAccount({ _id: mongoose.Types.ObjectId(accountId) });
            ret = { ...ret._doc, accountId: {...accountInfo._doc, password: null} };
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
            this.processHTTPResponse(res, ret, "Đã thêm bình luận mới");
        }
    }

    // [PUT] /comment/:commentId
    async asyncUpdateComment(req, res, next) {
        const LOG_TITLE = "Update comment";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = commentValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            const { commentId } = req.params;
            // kiểm tra comment có tồn tại ?
            const existedComment = await this.commentService.asyncFindComment(commentId);
            if(!existedComment) {
                ret = new Error400("Bình luận không tồn tại");
                return;
            }

            // check người dùng
            const { id: accountId } = res.locals.decoded;
            if(accountId !== String(existedComment.accountId._id)) {
                ret = new Error400("Không phải bình luận của bạn");
                return;
            }
            ret = await this.commentService.asyncUpdateComment({ _id: mongoose.Types.ObjectId(commentId) },  { ...value, updatedAt: Date.now()});
            ret = { ...existedComment._doc, ...value, updatedAt: ret.updatedAt}
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
            this.processHTTPResponse(res, ret, "Cập nhật bình luận thành công");
        }
    }

    // [DELETE] /comment/:commentId
    async asyncDeleteComment(req, res, next) {
        const LOG_TITLE = "Delete comment";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { commentId } = req.params;
            // kiểm tra comment có tồn tại ?
            const existedComment = await this.commentService.asyncFindComment(commentId);
            if(!existedComment) {
                ret = new Error400("Bình luận không tồn tại");
                return;
            }

            // check người dùng
            const { id: accountId, role } = res.locals.decoded;
            if(accountId !== String(existedComment.accountId._id) && role !== "admin") {
                ret = new Error400("Bạn không có quyền xóa");
                return;
            }
            await this.commentService.asyncUpdateComment({ _id: mongoose.Types.ObjectId(commentId) },  { status: "deleted", updatedAt: Date.now()});
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
            this.processHTTPResponse(res, ret, "Đã xóa bình luận");
        }
    }



}

module.exports = new CommentController();