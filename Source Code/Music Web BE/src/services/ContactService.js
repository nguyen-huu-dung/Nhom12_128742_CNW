const { ContactRepository } = require("../repositories");
const mongoose = require('mongoose');
class ContactService {

    constructor() {
        this.contactRepository = ContactRepository;
    }

    async asyncCreateContact(payload) {
        return this.contactRepository.create(payload);
    }

    async asyncGetAllContact(payload) {
        return this.contactRepository.findAll(payload);
    }

    async asyncDeleteContact(contactId) {
        await this.contactRepository.update({ option: { _id: mongoose.Types.ObjectId(contactId) }, data: { status: "deleted", updatedAt: Date.now() } });
    }

    async asyncFindContact(contactId) {
        return this.contactRepository.findOne({ _id: mongoose.Types.ObjectId(contactId), status: "active" });
    }

    async asyncUpdateContact(option, data) {
        return this.contactRepository.update({ option, data });
    }
}

module.exports = new ContactService();