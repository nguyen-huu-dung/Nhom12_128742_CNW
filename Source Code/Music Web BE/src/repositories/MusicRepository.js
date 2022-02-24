const { MusicModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class MusicRepository extends BaseRepository {

    constructor() {
        super();
        this.model = MusicModel;
    }

    findAll(option) {
        return this.model.find(option).sort({ viewer: '-1' }).populate({path: "categoryId"})
    }

    findOne(option) {
        return this.model.findOne(option).populate({path: "categoryId"})
    }
}

module.exports = new MusicRepository();