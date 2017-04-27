const shortId = require('shortid');
const mongoose = require('../mongoose');

const IdentityCounter = mongoose.model('IdentityCounter');
const baseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  no: {
    type: Number,
    default: 0,
    required: true,
    index: true,
  },
}, { timestamps: true });

baseSchema.pre('save', function save(next) {
  const self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  if (!self.isNew) {
    next();
    return;
  }
  const q = { model: self.constructor.modelName };
  IdentityCounter.findOneAndUpdate(
    q,
    { $inc: { count: 1 } },
    { upsert: true },
    (err, counter) => {
      if (err) {
        next(err);
        return;
      }
      if (counter && counter.count) {
        self.no = counter.count;
      } else {
        self.no = 1;
      }
      next();
    });
});

module.exports = baseSchema;
