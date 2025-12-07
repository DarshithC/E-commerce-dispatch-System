const express = require('express');
const router = express.Router();
const Dispatch = require('../models/Dispatch');
const Order = require('../models/Order');

// Get all dispatches
router.get('/', async (req, res) => {
  try {
    const dispatches = await Dispatch.find().populate('orderId').sort({ dispatchDate: -1 });
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create dispatch
router.post('/', async (req, res) => {
  try {
    const trackingNumber = 'TRK' + Date.now();
    const dispatch = new Dispatch({ ...req.body, trackingNumber });
    await dispatch.save();
    
    // Update order status
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: 'dispatched',
      dispatchedAt: new Date()
    });
    
    res.status(201).json(dispatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update dispatch
router.put('/:id', async (req, res) => {
  try {
    const dispatch = await Dispatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (req.body.status === 'delivered') {
      await Order.findByIdAndUpdate(dispatch.orderId, {
        status: 'delivered',
        deliveredAt: new Date()
      });
    }
    
    res.json(dispatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;