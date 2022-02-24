class BaseRepository {

    constructor() {}

    create(data) {
        return this.model.create(data);
    }

    update({ option, data }) {
        return this.model.findOneAndUpdate(option, data, { new: true });
    }

    updateMany({ option, data }) {
        return this.model.updateMany(option, data);
    }

    delete(option) {
        return this.model.remove(option);
    }

    deleteMany(option) {
        return this.model.deleteMany(option);
    }

    findAll(condition) {
        return this.model.find(condition || {});
    }

    findOne(option) {
        return this.model.findOne(option);
    }

    getCount(option) {
        return this.model.countDocuments(option);
    }

    async paginate({ limit, options, page, populate, sort }) {
        const count = await this.getCount(options);
        const perPage = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
        const currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
        const totalPage = Math.ceil(count / perPage);
        currentPage = currentPage > totalPage && totalPage > 0 ? totalPage : currentPage;
        const skip = (currentPage - 1) * perPage;
        const data = await this.model
            .find()
            .where(options)
            .populate(populate)
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
}


module.exports = BaseRepository;