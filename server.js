const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Data } = require('./models/data');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(fileUpload());
app.use(express.static('public'));

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost/profiler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 파일 업로드 처리
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  let inputFile = req.files.inputFile;
  const uploadPath = path.join(__dirname, 'uploads', 'inputFile.txt');

  // 파일 저장 및 처리
  inputFile.mv(uploadPath, function(err) {
    if (err) return res.status(500).send(err);

    processFile(uploadPath, res);
  });
});

// 파일 처리 및 통계 계산
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

// 통계 계산 함수
function calculateStats(values) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  let sum = values.reduce((a, b) => a + b, 0);
  let avg = sum / values.length;
  let stddev = Math.sqrt(values.map(v => (v - avg) ** 2).reduce((a, b) => a + b) / values.length);

  return { min, max, avg, stddev };
}

// 데이터베이스에 통계 데이터 저장
async function storeData(stats) {
  const data = new Data(stats);
  await data.save();
}

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 시작되었습니다.`);
});
