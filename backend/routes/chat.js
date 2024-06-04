const express = require('express');

const chatController = require('../controllers/chat')

const auth = require('../middleware/auth')

const route = express.Router();

route.post('/add-chat/:groupId',auth.authenticate,chatController.addChat)

route.get('/get-chat/:groupId',chatController.getChats)

module.exports = route;