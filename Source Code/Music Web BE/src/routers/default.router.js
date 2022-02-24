const express = require('express');
const { DefaultController } = require('../controllers');
const DefaultRouter = express.Router();

DefaultRouter.post('/image', DefaultController.uploadImage.bind(DefaultController));
DefaultRouter.post('/music', DefaultController.uploadMusic.bind(DefaultController));

module.exports = DefaultRouter;