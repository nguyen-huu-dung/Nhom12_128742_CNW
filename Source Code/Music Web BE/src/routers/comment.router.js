const express = require('express');
const CommentRouter = express.Router();
const {CommentController} = require('../controllers')

CommentRouter.get('/:musicId', CommentController.asyncGetAllComment.bind(CommentController));
CommentRouter.post('/:musicId', CommentController.asyncCreateNewComment.bind(CommentController));
CommentRouter.put('/:commentId', CommentController.asyncUpdateComment.bind(CommentController));
CommentRouter.delete('/:commentId', CommentController.asyncDeleteComment.bind(CommentController));

module.exports = CommentRouter;