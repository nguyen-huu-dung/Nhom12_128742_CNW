const { CommentModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class CommentRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CommentModel;
    }

    findAll(option) {
        return this.model.find(option).populate({path: "accountId"}).sort({createdAt: -1});
    }

    findOne(option) {
        return this.model.findOne(option).populate({path: "accountId"});
    }
}

module.exports = new CommentRepository();