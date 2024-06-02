const express = require('express');

const chatController = require('../controllers/chat')

const auth = require('../middleware/auth')

const route = express.Router();

route.post('/add-chat',auth.authenticate,chatController.addChat)

route.get('/get-chat',chatController.getChats)

module.exports = route;