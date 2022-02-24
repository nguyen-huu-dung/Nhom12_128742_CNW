const BaseError = require("./BaseError");

class Error400 extends BaseError {

    constructor(message){
        super(message);
    }
}

module.exports = Error400;