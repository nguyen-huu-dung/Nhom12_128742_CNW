const { Error400 } = require("../core/httpError");
const { CategoryService } = require("../services");
const { loggerStart, loggerError, loggerEnd } = require("../utils/helpers/supports");
const { categoryValidate } = require("../utils/validates/category.validate");
const BaseController = require('./BaseController');

class CategoryController extends BaseController {

    constructor() {
        super();
        this.categoryService = CategoryService;
    }
    
    // [GET] /category
    async asyncGetAllCategory(req, res, next) {
        const LOG_TITLE = "Get all category";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            ret = await this.categoryService.asyncGetAllCategory();
            ret = { categories: ret, totalCategory: ret.length  };
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

    // [POST] /category
    async asyncCreateNewCategory(req, res, next) {
        const LOG_TITLE = "New category";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {   
            const { error, value } = categoryValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret =  await this.categoryService.asyncCreateCategory({ ...value, createdAt: Date.now() });
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
            this.processHTTPResponse(res, ret, "Đã thêm thể loại mới");
        }
    }

    // [PUT] /category/:categoryId
    async asyncUpdateCategory(req, res, next) {
        const LOG_TITLE = "Update category";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { error, value } = categoryValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret = await this.categoryService.asyncUpdateCategory(req.params, value);
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
            this.processHTTPResponse(res, ret, "Cập nhật thành công");
        }
    }

    // [PUT] /category/:categoryId
    async asyncDeleteCategory(req, res, next) {
        const LOG_TITLE = "Delete category";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            await this.categoryService.asyncDeleteCategory(req.params.categoryId);
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
            this.processHTTPResponse(res, ret, "Đã xóa thể loại");
        }
    }

}

module.exports = new CategoryController();