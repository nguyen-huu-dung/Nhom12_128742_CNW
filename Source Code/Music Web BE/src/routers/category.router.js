const express = require('express');
const { CategoryController } = require('../controllers');
const CategoryRouter = express.Router();

CategoryRouter.get('/', CategoryController.asyncGetAllCategory.bind(CategoryController));
CategoryRouter.post('/', CategoryController.asyncCreateNewCategory.bind(CategoryController));
CategoryRouter.put('/:categoryId', CategoryController.asyncUpdateCategory.bind(CategoryController));
CategoryRouter.delete('/:categoryId', CategoryController.asyncDeleteCategory.bind(CategoryController));


module.exports = CategoryRouter;