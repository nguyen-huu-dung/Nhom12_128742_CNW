const express = require('express');
const ContactRouter = express.Router();
const { ContactController } = require('../controllers');

ContactRouter.get('/', ContactController.asyncGetAllContact.bind(ContactController));
ContactRouter.post('/', ContactController.asyncCreateNewContact.bind(ContactController));
ContactRouter.put('/:contactId/is_seen', ContactController.asyncSeenContact.bind(ContactController));
ContactRouter.delete('/:contactId', ContactController.asyncDeleteContact.bind(ContactController));

module.exports = ContactRouter;