const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Data } = require('./models/data');

const app = express();
const PORT = 3000;

app.use(fileUpload());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/profiler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let inputFile = req.files.inputFile;
  const uploadPath = path.join(__dirname, 'uploads', 'inputFile.txt');

  inputFile.mv(uploadPath, function(err) {
    if (err) return res.status(500).send(err);

    processFile(uploadPath, res);
  });
});

function processFile(filePath, res) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    let lines = data.split('\n').map(line => parseFloat(line.trim())).filter(value => !isNaN(value));
    let stats = calculateStats(lines);

    storeData(stats).then(() => {
      res.json(stats);
    }).catch(err => {
      res.status(500).send(err);
    });
  });
}

function calculateStats(values) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  let sum = values.reduce((a, b) => a + b, 0);
  let avg = sum / values.length;
  let stddev = Math.sqrt(values.map(v => (v - avg) ** 2).reduce((a, b) => a + b) / values.length);

  return { min, max, avg, stddev };
}

async function storeData(stats) {
  const data = new Data(stats);
  await data.save();
}

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
