const { ContactModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class ContactRepository extends BaseRepository {

    constructor() {
        super();
        this.model = ContactModel;
    }

    findAll(option) {
        return this.model.find(option).sort({ createdAt: '-1' });
    }
}

module.exports = new ContactRepository();