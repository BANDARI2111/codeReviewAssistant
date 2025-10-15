require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('express');
const reviewRoutes = require('./routes/reviewRoutes');
require('./config/db');

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Backend is running! Use /api/review/ endpoints for API access.');
});
app.use('/api/review', reviewRoutes);

// Export app for Vercel
module.exports = app;

// Local development only: listen on port
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}
