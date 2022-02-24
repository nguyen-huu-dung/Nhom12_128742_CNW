const BaseError = require("./BaseError");

class Error404 extends BaseError {

    constructor(message){
        super(message);
    }
}

module.exports = Error404;