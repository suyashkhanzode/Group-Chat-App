const express = require('express');

const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

const route = express.Router();

route.post('/add-member/:groupId',adminController.addMember);

route.post('/remove-member/:groupId',adminController.removeUser)

route.put('/promote-member/:groupId',adminController.promoteAdmin);

route.get('/is-admin/:groupId',auth.authenticate,adminController.isAdmin)

module.exports = route;
