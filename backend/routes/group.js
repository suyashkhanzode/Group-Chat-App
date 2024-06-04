const express = require('express');

const groupController = require('../controllers/group')

const auth = require('../middleware/auth')

const route = express.Router();

route.post('/add-group',auth.authenticate,groupController.addGroup)

route.get('/get-group',auth.authenticate,groupController.getGroup)

module.exports = route;