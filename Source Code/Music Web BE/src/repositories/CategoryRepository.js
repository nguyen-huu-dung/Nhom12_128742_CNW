const { CategoryModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class CategoryRepository extends BaseRepository {

    constructor() {
        super();
        this.model = CategoryModel;
    }
} 


module.exports = new CategoryRepository();