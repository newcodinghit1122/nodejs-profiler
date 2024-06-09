const mongoose = require('mongoose');

// 데이터 스키마 정의
const dataSchema = new mongoose.Schema({
  min: Number,
  max: Number,
  avg: Number,
  stddev: Number,
});

// 데이터 모델 생성
const Data = mongoose.model('Data', dataSchema);

module.exports = { Data };
