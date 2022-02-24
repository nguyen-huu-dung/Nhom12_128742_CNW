const BaseController = require('./BaseController');
const { ContactService } = require("../services");
const { loggerStart, loggerError, loggerEnd } = require("../utils/helpers/supports");
const { contactValidate } = require('../utils/validates/contact.validate');
const { Error400 } = require('../core/httpError');
const mongoose = require('mongoose');
class ContactController extends BaseController {

    constructor() {
        super();
        this.contactService = ContactService;
    }
    
    // [GET] /Contact
    async asyncGetAllContact(req, res, next) {
        const LOG_TITLE = "Get all contact";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { title } = req.query;
            if(title === "all") {
                ret = await this.contactService.asyncGetAllContact({ status: "active" });
            }
            else {
                ret = await this.contactService.asyncGetAllContact({ status: "active", title })
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
    
    // [POST] /Contact
    async asyncCreateNewContact(req, res, next) {
        const LOG_TITLE = "New contact";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {   
            const { error, value } = contactValidate(req.body);
            if(error) {
                ret = new Error400(error.details[0].message);
                return;
            }
            ret =  await this.contactService.asyncCreateContact({ ...value, createdAt: Date.now() });
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
            this.processHTTPResponse(res, ret, "Cảm ơn đã liên hệ với admin");
        }
    }

    // [PUT] /contact/:contactId/is_seen
    async asyncSeenContact(req, res, next) {
        const LOG_TITLE = "Seen contact";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            const { contactId } = req.params;
            // check existed contactId
            const existedContact = await this.contactService.asyncFindContact(contactId);
            if(!existedContact) {
                ret = new Error400("Liên hệ không tồn tại");
                return;
            }
            ret = await this.contactService.asyncUpdateContact({ _id: mongoose.Types.ObjectId(contactId) }, { isSeen: true, updatedAt: Date.now() });
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

    // [PUT] /contact/:contactId
    async asyncDeleteContact(req, res, next) {
        const LOG_TITLE = "Delete contact";
        loggerStart(LOG_TITLE);

        let ret = null;
        try {
            await this.contactService.asyncDeleteContact(req.params.contactId);
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
            this.processHTTPResponse(res, ret, "Đã xóa liên hệ");
        }
    }
}

module.exports = new ContactController();