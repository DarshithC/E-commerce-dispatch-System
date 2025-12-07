import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    products: [{ productId: '', quantity: 1 }],
    paymentStatus: 'pending'
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const calculateTotal = () => {
    return formData.products.reduce((total, item) => {
      const product = products.find(p => p._id === item.productId);
      return total + (product ? product.sellingPrice * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderProducts = formData.products.map(item => {
        const product = products.find(p => p._id === item.productId);
        return {
          productId: item.productId,
          name: product.name,
          quantity: parseInt(item.quantity),
          price: product.sellingPrice
        };
      });

      await axios.post(`${API_URL}/orders`, {
        ...formData,
        products: orderProducts,
        totalAmount: calculateTotal()
      });
      
      setShowForm(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        products: [{ productId: '', quantity: 1 }],
        paymentStatus: 'pending'
      });
      fetchOrders();
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <div className="orders">
      <div className="page-header">
        <h2>Orders</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Order'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Customer Email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Customer Phone"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          />
          <textarea
            placeholder="Customer Address"
            value={formData.customerAddress}
            onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
            required
          />
          
          {formData.products.map((item, index) => (
            <div key={index} className="product-row">
              <select
                value={item.productId}
                onChange={(e) => {
                  const newProducts = [...formData.products];
                  newProducts[index].productId = e.target.value;
                  setFormData({ ...formData, products: newProducts });
                }}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.sellingPrice}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => {
                  const newProducts = [...formData.products];
                  newProducts[index].quantity = e.target.value;
                  setFormData({ ...formData, products: newProducts });
                }}
                required
              />
            </div>
          ))}
          
          <div className="total">Total: ₹{calculateTotal()}</div>
          <button type="submit" className="btn-primary">Create Order</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </td>
                <td>
                  <span className={`status status-${order.paymentStatus}`}>{order.paymentStatus}</span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;