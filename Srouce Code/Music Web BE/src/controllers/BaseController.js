const { Error400, Error401, Error404, Error500 } = require("../core/httpError");

class BaseController {

    constructor() {}

    processHTTPResponse(res, ret, messageSuccess) {
        if(ret instanceof Error400) return res.status(400).json({
            data: null, 
            success: false,
            message: ret.message
        })

        if(ret instanceof Error401) return res.status(401).json({
            data: null, 
            success: false,
            message: ret.message
        })

        if(ret instanceof Error404) return res.status(401).json({
            data: null, 
            success: false,
            message: ret.message
        })

        if(ret instanceof Error500) return res.status(500).json({
            data: null,
            success: false,
            message: ret.message
        })
        
        res.status(200).json({
            data: ret,
            success: true,
            message: messageSuccess
        })
    }

}

module.exports = BaseController;