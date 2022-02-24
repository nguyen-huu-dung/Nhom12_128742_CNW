const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const slugOptions = require('../core/config/slug.config');
const { IMAGE_MUSIC_DEFAULT_URL, MUSIC_DEFAULT_URL, IMAGE_MUSIC_DEFAULT_NAME, MUSIC_DEFAULT_NAME } = require('../core/constants');
mongoose.plugin(slug, slugOptions);
const { Schema } = mongoose;

const MusicModel = new Schema({
    name: {
        type: String,
        required: true
    },
    slug_music: {
        type: String,
        slug: ['name'],
        unique: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    author: {
        type: String,
        default: null
    },
    singer: {
        type: String,
        default: null
    },
    lyrics: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: IMAGE_MUSIC_DEFAULT_URL
    },
    image_cloud_name: {
        type: String,
        default: IMAGE_MUSIC_DEFAULT_NAME
    },
    music_path: {
        type: String,
        default: MUSIC_DEFAULT_URL
    },
    music_cloud_name: {
        type: String,
        default: MUSIC_DEFAULT_NAME
    },
    viewer: {
        type: Number
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

module.exports = mongoose.model('musics', MusicModel);