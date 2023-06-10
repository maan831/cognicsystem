const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
app.use(cors());
// Configure bodyParser to parse JSON data
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/TestLab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema for the grid data
const gridDataSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  sunday: Number,
  monday: Number,
  tuesday: Number,
  wednesday: Number,
  thursday: Number,
  friday: Number,
  saturday: Number,
});

const GridData = mongoose.model('GridData', gridDataSchema);

// API endpoint to save the grid data
app.post('/api/grid-data', (req, res) => {
  const gridData = new GridData(req.body);
  gridData
    .save()
    .then((savedGridData) => {
      res.status(200).json(savedGridData);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to save grid data.' });
    });
});

// API endpoint to get all grid data
app.get('/api/grid-data', (req, res) => {
  GridData.find()
    .populate('categoryId subCategoryId')
    .exec()
    .then((gridData) => {
      res.status(200).json(gridData);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch grid data.' });
    });
});

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
