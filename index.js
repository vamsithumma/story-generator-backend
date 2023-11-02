// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const cors = require('cors');
// Enable CORS for all routes
const app = express();
app.use(cors());
const port = process.env.PORT;
app.use(express.json());

const bodyParser = require("body-parser");
const { Configuration, OpenAI } = require("openai");

// MongoDB connection
mongodburl = process.env.MONGODB_CONNECT_URL;
mongoose.connect(mongodburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});


// API routes
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
