const express = require('express');

const chatController = require('../controllers/chat')

const auth = require('../middleware/auth')
module.exports = (io) => {
    const router = express.Router();
    const chatCtrl = chatController(io);
  
    router.post('/add-chat/:groupId',auth.authenticate, chatCtrl.addChat);
    router.get('/get-chat/:groupId',auth.authenticate, chatCtrl.getChats);
  
    return router;
  };