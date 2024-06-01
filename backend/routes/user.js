const express = require('express');

const userController = require('../controllers/user')

const route = express.Router();

route.post('/sign-up',userController.signUp);

route.post('/login',userController.loginUser)


module.exports = route;