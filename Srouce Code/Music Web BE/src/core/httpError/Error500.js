const BaseError = require("./BaseError");

class Error500 extends BaseError {

    constructor(message){
        super(message);
    }
}

module.exports = Error500;