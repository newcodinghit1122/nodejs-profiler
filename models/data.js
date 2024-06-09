const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  min: Number,
  max: Number,
  avg: Number,
  stddev: Number,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = { Data };
