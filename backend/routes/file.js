const express = require('express');
const multer = require('multer');
const fileController = require('../controllers/file');
const auth = require('../middleware/auth')
const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add multer middleware to handle file uploads
router.post('/upload/:groupId',auth.authenticate, upload.array('files'), fileController.setURL);

module.exports = router;
