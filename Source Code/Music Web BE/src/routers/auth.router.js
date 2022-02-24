const express = require('express');
const { AuthController } = require('../controllers');
const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.asyncLogin.bind(AuthController));
AuthRouter.post('/logout', AuthController.asyncLogout.bind(AuthController));

module.exports = AuthRouter;