const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  _id: false,
  type: {
    type: String,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
    validate: {
      validator: v => v.length === 2,
    },
  },
});

exports = Schema;
module.exports = Schema;
