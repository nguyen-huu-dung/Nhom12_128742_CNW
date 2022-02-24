const mongoose = require("mongoose");
const { uploadCloudImage, cloudinary } = require("../core/config/upload.config");
const { AVATAR_DEFAULT_NAME } = require("../core/constants");
const { Error400, Error404, Error401 } = require("../core/httpError");
const { AccountService } = require("../services");
const { loggerStart, loggerEnd, loggerError } = require("../utils/helpers/supports");
const { createAccountValidate, updateAccountValidate, passwordValidate } = require("../utils/validates/account.validate");
const BaseController = require("./BaseController");

class AccountController extends BaseController {

    constructor() {
        super();
        this.accountService = AccountService;
    }
    
    async asyncGetAllAccount(req, res, next) {
        const LOG_TITLE = "Get all account";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { status } = req.query;
            switch(status) {
                case "active": {
                    ret = await this.accountService.asyncGetAllAccount({ role: "user", status: "active" });
                    return;
                }
                case "block": {
                    ret = await this.accountService.asyncGetAllAccount({ role: "user", status: "block" });
                    return;
                }
                default: 
                    ret = await this.accountService.asyncGetAllAccount({ role: "user" });
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

    // [GET] /account/:accountId
    async asyncGetAccount(req, res, next) {
        const LOG_TITLE = "Get account info";
        loggerStart(LOG_TITLE);

        let ret = null, result = null;
        try {
            let { accountId } = req.params;
            if(accountId === "owner") {
                const { id } = res.locals.decoded;
                result = await this.accountService.asyncFindAccount({_id: mongoose.Types.ObjectId(id)});
                accountId = id;
            }
            else {
                result = await this.accountService.asyncFindAccount({_id: mongoose.Types.ObjectId(accountId)});
                if(!result) { 
                ret =  new Error404('Tài khoản không tồn tại');
                return;
                }
                if(result.status === "block") {
                    ret = new Error400("Tài khoản đã bị khóa");
                    return;
                }
            }
            const { username, name, role, email, avatar, address, country, status } = result;
            ret = { accountId, username, name, role, email, avatar, address, country, status}
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

    // [POST] /account
    async asyncCreateAccount(req, res, next) {
        const LOG_TITLE = "Create Account";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            // Validate req.body
            const { error, value } = createAccountValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            // Tạo tài khoản
            ret = await this.accountService.asyncCreateAccount(value);
        }
        catch (error) {
            loggerError(LOG_TITLE, error.message);
            res.status(500).json({
                data: null,
                success: false,
                message: error.message
            })
        }
        finally {
            loggerEnd(LOG_TITLE);
            // xử lý response trả về
            this.processHTTPResponse(res, ret, "Tạo tài khoản thành công");
        }
    }

    // [PUT] /account
    async asyncUpdateInfoAccount(req, res, next) {
        const LOG_TITLE = "Update account info";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = updateAccountValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret = await this.accountService.asyncUpdateInfoAccount({ accountId: res.locals.decoded.id }, value);
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
            this.processHTTPResponse(res, ret, "Cập nhật thông tin thành công");
        }
    }

    // [PUT] /account/change_avatar
    async asyncChangeAvatar(req, res, next) {
        uploadCloudImage(req, res, async err => {
            const LOG_TITLE = "Change avatar";
            loggerStart(LOG_TITLE);

            let ret = null;
            try {
                const { id : accountId } = res.locals.decoded;
                if(err) {
                    ret = new Error400("Only .png, .jpg and .jpeg format allowed!");
                    return;
                }
                if(!req.file) {
                    ret = new Error400("Image file là bắt buộc");
                    return;
                }
                // Lấy thông tin tài khoản
                const account = await this.accountService.asyncFindAccount({_id: mongoose.Types.ObjectId(accountId)});

                if(account.avatar_cloud_name !== AVATAR_DEFAULT_NAME) {
                    await cloudinary.uploader.destroy(account.avatar_cloud_name);
                }

                ret = await this.accountService.asyncUpdateAccount({_id: mongoose.Types.ObjectId(accountId)}, { avatar: req.file.path, avatar_cloud_name: req.file.filename, updatedAt: Date.now() })
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
                this.processHTTPResponse(res, ret, "Cập nhật avatar thành công");
            }
        })
    }


    // [PUT] /account/change_password
    async asyncChangePassword(req, res, next) {
        const LOG_TITLE = "Change password";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = passwordValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret = await this.accountService.asyncChangePassword({ accountId: res.locals.decoded.id }, value);
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
            this.processHTTPResponse(res, ret, "Đổi mật khẩu thành công");
        }
    }

    // [PUT] /account/:accountId/block_account
    async asyncBlockAccount(req, res, next) {
        const LOG_TITLE = "Block account";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { accountId } = req.params;
            const result = await this.accountService.asyncFindAccount({_id: mongoose.Types.ObjectId(accountId)});
            if(!result) { 
              ret =  new Error404('Tài khoản không tồn tại');
              return;
            }
            if(result.status === "block") {
                ret = new Error400("Tài khoản đã bị khóa");
                return;
            }
            ret = await this.accountService.asyncUpdateAccount({_id: mongoose.Types.ObjectId(accountId)}, { status: "block", updatedAt: Date.now() });
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
            this.processHTTPResponse(res, ret, "Đã khóa tài khoản");
        }
    }

    // [PUT] /account/:accountId/unblock_account
    async asyncUnBlockAccount(req, res, next) {
        const LOG_TITLE = "Un block account";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { accountId } = req.params;
            const result = await this.accountService.asyncFindAccount({_id: mongoose.Types.ObjectId(accountId)});
            if(!result) { 
              ret =  new Error404('Tài khoản không tồn tại');
              return;
            }
            if(result.status === "active") {
                ret = new Error400("Tài khoản không bị khóa");
                return;
            }
            ret = await this.accountService.asyncUpdateAccount({_id: mongoose.Types.ObjectId(accountId)}, { status: "active", updatedAt: Date.now() });
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
            this.processHTTPResponse(res, ret, "Đã bỏ khóa tài khoản");
        }
    }
}


module.exports = new AccountController();