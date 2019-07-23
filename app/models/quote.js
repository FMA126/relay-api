const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
  pickUpDate: {
    type: String,
    required: true
  },
  pickUpLocation: {
    type: String,
    required: true
  },
  dropOffLocation: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prices: {
    type: Array,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Quote', quoteSchema)
