const mongoose = require('mongoose');
const baseSchema = require('./baseSchema');

const Schema = baseSchema.extend({
  name: {
    type: String,
  },
  location: {
    // eslint-disable-next-line global-require
    type: require('./point'),
    required: true,
  },
});

mongoose.model('GDG', Schema);
