const mongoose =  require("mongoose");
const { AVATAR_DEFAULT_URL, AVATAR_DEFAULT_NAME } = require("../core/constants");
const { Schema } = mongoose;

const AccountModel = new Schema({
    username: {
        type: String,
        min: 5,
        max: 100,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    name: {
        type: String,
        min: 4,
        max: 100,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: AVATAR_DEFAULT_URL,
        required: true
    },
    avatar_cloud_name: {
        type: String,
        default: AVATAR_DEFAULT_NAME
    },
    address: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
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
        enum: ['active', 'block'],
        default: 'active',
        required: true
    }
})

module.exports = mongoose.model('accounts', AccountModel);