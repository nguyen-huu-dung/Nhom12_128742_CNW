const { CommentRepository, MusicRepository } = require("../repositories");
const mongoose = require('mongoose');
class CommentService {

    constructor() {
        this.commentRepository = CommentRepository;
        this.musicRepository = MusicRepository;
    }

    async asyncCreateNewComment(payload) {
        return this.commentRepository.create(payload);
    }

    async asyncGetAllComment(musicId) {
        return this.commentRepository.findAll({ musicId:  mongoose.Types.ObjectId(musicId), status: "active"});
    }

    async asyncUpdateComment(option, data) {
        return this.commentRepository.update({ option, data });
    }
    
    async asyncFindMusic(musicId) {
        return this.musicRepository.findOne({ _id:  mongoose.Types.ObjectId(musicId), status: "active"});
    }

    async asyncFindComment(commentId) {
        return this.commentRepository.findOne({  _id:  mongoose.Types.ObjectId(commentId), status: "active"});
    }
}

module.exports = new CommentService();