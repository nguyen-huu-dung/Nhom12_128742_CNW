const { AccountModel } = require("../models");
const BaseRepository = require("./BaseRepository");

class AccountRepository extends BaseRepository {

    constructor() {
        super();
        this.model = AccountModel;
    }

    async paginate({ limit, options, page }) {
        const count = await this.getCount(options);
        const perPage = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
        const currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
        const totalPage = Math.ceil(count / perPage);
        currentPage = currentPage > totalPage && totalPage > 0 ? totalPage : currentPage;
        const skip = (currentPage - 1) * perPage;
        const data = await this.model
            .find()
            .where(options)
            .skip(skip)
            .limit(perPage)
            .sort({ ...sort, 'createdAt': -1 });
        
        return {
            data,
            paging: {
                totalPage,
                total: count,
                pageSize: perPage,
                currentPage: parseInt(currentPage)
            }
        }
    }

    findAll(option) {
        return this.model.find(option).select("-password");
    }
} 


module.exports = new AccountRepository();