 const { CategoryRepository, MusicRepository } = require("../repositories");
const mongoose = require('mongoose');
const { Error500, Error404 } = require("../core/httpError");

class CategoryService {

    constructor() {
        this.categoryRepository = CategoryRepository;
        this.musicRepository = MusicRepository;
    }
    
    async asyncGetAllCategory() {
        return this.categoryRepository.findAll({ status: "active" });
    }

    async asyncUpdateCategory({ categoryId }, { category }) {
        try {
            const existedCategory = await this.categoryRepository.findOne({_id: mongoose.Types.ObjectId(categoryId), status: "active"});
            if(!existedCategory) return new Error404("Thể loại không tồn tại");
            return await this.categoryRepository.update({ option: { _id: existedCategory }, data: { category, updatedAt: Date.now() } });
        } catch (error) {
            return new Error500(error.message);
        }   
    }

    async asyncCreateCategory(payload) {
        return this.categoryRepository.create(payload);
    }

    async asyncDeleteCategory(categoryId) {

        await this.categoryRepository.update({ option: { _id: mongoose.Types.ObjectId(categoryId) }, data: { status: "deleted", updatedAt: Date.now() } });

        await this.musicRepository.updateMany({ option: { categoryId: mongoose.Types.ObjectId(categoryId) }, data: { status: "deleted", updatedAt: Date.now() }});

    }
}

module.exports = new CategoryService();