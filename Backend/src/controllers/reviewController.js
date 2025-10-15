const FileReport = require('../models/FileReport');
const axios = require('axios');
const mammoth = require('mammoth');

async function extractDocxText(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error('Error extracting DOCX text:', err);
    return '';
  }
}


async function generateReviewWithOpenRouter(codeContent) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // console.log(apiKey)
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const data = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Review this code for readability, modularity, and potential bugs, then provide improvement suggestions:\n\n${codeContent}`
      }
    ],
    max_tokens: 1024,
    temperature: 0.4,
  };
// console.log('OPENROUTER_API_KEY (local):', process.env.OPENROUTER_API_KEY);

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const response = await axios({
  method: 'post',
  url: 'https://openrouter.ai/api/v1/chat/completions',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:8000',  // Optional, sometimes required
    'X-Title': 'Code Review Backend',          // Optional if OpenRouter requires title
  },
  data: {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Review this code for readability, modularity, and potential bugs, then provide improvement suggestions:\n\n${codeContent}`
      }
    ],
    max_tokens: 1024,
    temperature: 0.4,
  },
  validateStatus: () => true, // So you can inspect response in catch block
});
// console.log('OpenRouter Response Status:', response.status);
// console.log('OpenRouter Response:', response.data);
  return response.data.choices[0].message.content;
}

exports.uploadFiles = async (req, res) => {
  try {
    const codeFile = req.files['codeFile']?.[0];
    if (!codeFile) return res.status(400).json({ error: 'codeFile required' });
    // console.log('req.files:', req.files);
    // console.log('req.files:', req.files);
// console.log('req.body:', req.body);
    let reportBuffer;
    if (!req.files['reportFile']) {
      // const codeContent = codeFile.buffer.toString();
      let codeContent = '';

      if (
        codeFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        codeFile.originalname.toLowerCase().endsWith('.docx') ||
        codeFile.originalname.toLowerCase().endsWith('.doc')
      ) {
        codeContent = await extractDocxText(codeFile.buffer);
      } else {
        codeContent = codeFile.buffer.toString('utf8');
      }

      const reviewText = await generateReviewWithOpenRouter(codeContent);
      reportBuffer = Buffer.from(reviewText, 'utf-8');
    } else {
      reportBuffer = req.files['reportFile'][0].buffer;
    }

    const fileReport = new FileReport({
      filename: codeFile.originalname,
      originalFile: codeFile.buffer,
      originalFileType: codeFile.mimetype,
      reportFile: reportBuffer,
      reportFileType: "text/plain",
    });

    await fileReport.save();
    res.status(201).json({ message: "Files uploaded and review generated", id: fileReport._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listAllFiles = async (req, res) => {
  try {
    const files = await FileReport.find({}, 'filename uploadDate').sort({ uploadDate: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const fileReport = await FileReport.findById(req.params.id);
    if (!fileReport) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: fileReport._id,
      filename: fileReport.filename,
      codeFile: fileReport.originalFile.toString('base64'),
      codeFileType: fileReport.originalFileType,
      reportFile: fileReport.reportFile.toString('base64'),
      reportFileType: fileReport.reportFileType,
      uploadDate: fileReport.uploadDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadCodeFile = async (req, res) => {
  try {
    const fileReport = await FileReport.findById(req.params.id);
    if (!fileReport) return res.status(404).json({ error: 'Not found' });
    res.set('Content-Type', fileReport.originalFileType);
    res.set('Content-Disposition', `attachment; filename=${fileReport.filename}`);
    res.send(fileReport.originalFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadReportFile = async (req, res) => {
  try {
    const fileReport = await FileReport.findById(req.params.id);
    if (!fileReport) return res.status(404).json({ error: 'Not found' });

    // Always serve the report as a .txt, derived from the original code filename
    const originalName = fileReport.filename;
    const baseName = originalName.split('.').slice(0, -1).join('.') || 'review';
    const reportFileName = `${baseName}-review.txt`;

    res.set('Content-Type', 'text/plain');
    res.set('Content-Disposition', `attachment; filename=${reportFileName}`);
    res.send(fileReport.reportFile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFileReport = async (req, res) => {
  try {
    const deleted = await FileReport.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'File not found or already deleted' });
    }
    res.json({ message: 'File and report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
