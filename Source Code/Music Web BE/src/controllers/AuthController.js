const { Error400 } = require("../core/httpError");
const { loggerStart, loggerError, loggerEnd } = require("../utils/helpers/supports");
const { loginValidate } = require("../utils/validates/auth.validate");
const BaseController = require('./BaseController');
const { AuthService } = require('../services');

class AuthController extends BaseController {

    constructor() {
        super();
        this.authService = AuthService;
    }

    async asyncLogin(req, res, next) {
        const LOG_TITLE = "Login";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            // validate req.body
            const { error, value } = loginValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            // đăng nhập
            ret = await this.authService.asyncLogin(value);
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
            this.processHTTPResponse(res, ret, "Đăng nhập thành công");
        }
    }

    async asyncLogout(req, res, next) {
        const LOG_TITLE = "Logout";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const token = req.header('token');
            await this.authService.asyncUpdateToken(token);
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
            this.processHTTPResponse(res, ret, "Đăng xuất thành công");
        }
    }
}

module.exports = new AuthController();