const BaseError = require("./BaseError");

class Error401 extends BaseError {

    constructor(message){
        super(message);
    }
}

module.exports = Error401;