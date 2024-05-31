const express = require('express');

const userController = require('../controllers/user')

const route = express.Router();

route.post('/sign-up',userController.signUp);

module.exports = route;