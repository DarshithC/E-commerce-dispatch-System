const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get profit analytics
router.get('/analytics', async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' }).populate('products.productId');
    
    let totalRevenue = 0;
    let totalCost = 0;
    
    for (let order of orders) {
      totalRevenue += order.totalAmount;
      
      for (let item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          totalCost += product.costPrice * item.quantity;
        }
      }
    }
    
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0;
    
    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;