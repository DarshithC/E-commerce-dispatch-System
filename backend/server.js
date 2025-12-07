// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_dispatch')/*, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})*/
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err));

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const dispatchRoutes = require('./routes/dispatch');
const profitRoutes = require('./routes/profit');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/profit', profitRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce Dispatch System API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});