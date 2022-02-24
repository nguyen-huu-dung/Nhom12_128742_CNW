const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactModel = new Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        required: true
    },
    updatedAt: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    }
})

module.exports = mongoose.model('contacts', ContactModel);