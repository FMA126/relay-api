const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
  pickUpDate: {
    type: String,
    required: true
  },
  startZip: {
    type: String,
    required: true
  },
  endZip: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Quote', quoteSchema)
