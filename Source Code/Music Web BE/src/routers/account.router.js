const express = require('express');
const { AccountController } = require('../controllers');
const AccountRouter = express.Router();

AccountRouter.get('/', AccountController.asyncGetAllAccount.bind(AccountController));
AccountRouter.get('/:accountId', AccountController.asyncGetAccount.bind(AccountController));
AccountRouter.post('/', AccountController.asyncCreateAccount.bind(AccountController));
AccountRouter.put('/', AccountController.asyncUpdateInfoAccount.bind(AccountController));
AccountRouter.put('/change_password', AccountController.asyncChangePassword.bind(AccountController));
AccountRouter.put('/change_avatar', AccountController.asyncChangeAvatar.bind(AccountController));
AccountRouter.put('/:accountId/block_account', AccountController.asyncBlockAccount.bind(AccountController));
AccountRouter.put('/:accountId/unblock_account', AccountController.asyncUnBlockAccount.bind(AccountController));

module.exports = AccountRouter;