const { TokenModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class TokenRepository extends BaseRepository {

    constructor() {
        super();
        this.model = TokenModel;
    }
}

module.exports = new TokenRepository();