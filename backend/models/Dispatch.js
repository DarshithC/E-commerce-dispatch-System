const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  trackingNumber: { type: String, unique: true },
  courier: String,
  dispatchDate: { type: Date, default: Date.now },
  estimatedDelivery: Date,
  actualDelivery: Date,
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered', 'failed'],
    default: 'pending'
  },
  notes: String
});

module.exports = mongoose.model('Dispatch', dispatchSchema);