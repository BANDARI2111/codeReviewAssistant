const express = require('express');
const router = express.Router();
const multer = require('multer');
const reviewController = require('../controllers/reviewController');

// Setup multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint accepting codeFile and optional reportFile
router.post(
  '/upload',
  upload.fields([
    { name: 'codeFile', maxCount: 1 },
    { name: 'reportFile', maxCount: 1 }
  ]),
  reviewController.uploadFiles
);

// List files endpoint
router.get('/list', reviewController.listAllFiles);

// Download code file
router.get('/:id/code', reviewController.downloadCodeFile);

// Download report file
router.get('/:id/report', reviewController.downloadReportFile);

// Get file details
router.get('/:id', reviewController.getFiles);

// Delete file
router.delete('/:id', reviewController.deleteFileReport);

module.exports = router;
