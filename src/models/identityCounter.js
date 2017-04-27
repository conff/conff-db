const shortId = require('shortid');
const mongoose = require('mongoose');

const IdentityCounter = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  model: {
    type: String,
    required: true,
    index: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1000,
  },
});

mongoose.model('IdentityCounter', IdentityCounter);
