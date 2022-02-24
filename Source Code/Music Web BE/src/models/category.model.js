const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const slugOptions = require('../core/config/slug.config');
mongoose.plugin(slug, slugOptions);
const { Schema } = mongoose;

const CategoryModel = new Schema({
    category: {
        type: String,
        required: true
    },
    slug_category: {
        type: String,
        slug: ["category"],
        unique: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    }
})

module.exports = mongoose.model('categories', CategoryModel);