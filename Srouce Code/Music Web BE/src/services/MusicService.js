const mongoose = require("mongoose");
const { Error500, Error400 } = require("../core/httpError");
const { MusicRepository, CategoryRepository } = require("../repositories");


class MusicService {

    constructor() {
        this.musicRepository = MusicRepository;
        this.categoryRepository = CategoryRepository;
    }

    async asyncCreateMusic(payload) {
        try {
            const { name, category, author, singer, lyrics } = payload;

            // Kiểm tra có thể loại đó không?
            const existedCategory = await this.categoryRepository.findOne({category, status: "active"});
            if(!existedCategory) return new Error400("Không có thể loại yêu cầu");

            // khởi tạo viewer
            const viewer = Math.ceil(Math.random() * 10000 + 1);

            // tạo mới music
            const ret = await this.musicRepository.create({ name, categoryId: existedCategory._id, author, singer, lyrics, viewer, createdAt: Date.now() });
            return { ...ret._doc, categoryId: existedCategory};
        } catch (error) {
            return new Error500(err.message);
        }
    }

    async asyncUpdateInfoMusic({ musicId }, payload) {
        try {
            const { name, category, author, singer, lyrics } = payload;

            // Kiểm tra xem có bài hát đó không?
            const existedMusic = await this.musicRepository.findOne({_id: mongoose.Types.ObjectId(musicId), status: "active"});
            if(!existedMusic) return new Error400("Bài hát không tồn tại");

            // Kiểm tra có thể loại đó không?
            const existedCategory = await this.categoryRepository.findOne({category, status: "active"});
            if(!existedCategory) return new Error400("Không có thể loại yêu cầu");

            // update music
            const ret = await this.musicRepository.update({ option: { _id: mongoose.Types.ObjectId(musicId) }, 
            data: { name, categoryId: existedCategory._id, author, singer, lyrics, updatedAt: Date.now() } });
            return { ...ret._doc, categoryId: existedCategory};
        } catch (error) {
            return new Error500(err.message);
        }
    }

    async asyncFindMusic(payload) {
        return this.musicRepository.findOne(payload);
    }

    async asyncUpdateMusic(option, data) {
        return this.musicRepository.update({ option, data });
    }

    async asyncGetAll(option) {
        return this.musicRepository.findAll(option);
    }

    async asyncFindCategory(option) {
        return this.categoryRepository.findOne(option);
    }

    async asyncDeleteMusic(musicId) {
        try {
            // Kiểm tra xem có bài hát đó không?
            const existedMusic = await this.musicRepository.findOne({_id: mongoose.Types.ObjectId(musicId), status: "active"});
            if(!existedMusic) return new Error400("Bài hát không tồn tại");

            // update music
            await this.musicRepository.update({ option: { _id: mongoose.Types.ObjectId(musicId) }, 
            data: { status: "deleted", updatedAt: Date.now() }}); 
        } catch (error) {
            return new Error500(err.message);
        }
    }
}

module.exports = new MusicService();