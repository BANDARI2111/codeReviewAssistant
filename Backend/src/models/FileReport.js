const mongoose = require('mongoose');

const fileReportSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalFile: { type: Buffer, required: true },
  originalFileType: { type: String, required: true },
  reportFile: { type: Buffer, required: true },
  reportFileType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileReport', fileReportSchema);
