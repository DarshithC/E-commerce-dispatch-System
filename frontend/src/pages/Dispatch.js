import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dispatch() {
  const [dispatches, setDispatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    courier: '',
    estimatedDelivery: '',
    notes: ''
  });

  useEffect(() => {
    fetchDispatches();
    fetchOrders();
  }, []);

  const fetchDispatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/dispatch`);
      setDispatches(response.data);
    } catch (err) {
      console.error('Error fetching dispatches:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.filter(order => order.status === 'confirmed'));
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/dispatch`, formData);
      setShowForm(false);
      setFormData({ orderId: '', courier: '', estimatedDelivery: '', notes: '' });
      fetchDispatches();
      fetchOrders();
    } catch (err) {
      console.error('Error creating dispatch:', err);
    }
  };

  const updateDispatchStatus = async (id, status) => {
    try {
      const updateData = { status };
      if (status === 'delivered') {
        updateData.actualDelivery = new Date();
      }
      await axios.put(`${API_URL}/dispatch/${id}`, updateData);
      fetchDispatches();
    } catch (err) {
      console.error('Error updating dispatch:', err);
    }
  };

  return (
    <div className="dispatch">
      <div className="page-header">
        <h2>Dispatch Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Dispatch'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <select
            value={formData.orderId}
            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
            required
          >
            <option value="">Select Order</option>
            {orders.map(order => (
              <option key={order._id} value={order._id}>
                {order.orderNumber} - {order.customerName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Courier Service"
            value={formData.courier}
            onChange={(e) => setFormData({ ...formData, courier: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Estimated Delivery"
            value={formData.estimatedDelivery}
            onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <button type="submit" className="btn-primary">Create Dispatch</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Order #</th>
              <th>Customer</th>
              <th>Courier</th>
              <th>Dispatch Date</th>
              <th>Est. Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dispatches.map(dispatch => (
              <tr key={dispatch._id}>
                <td>{dispatch.trackingNumber}</td>
                <td>{dispatch.orderId?.orderNumber}</td>
                <td>{dispatch.orderId?.customerName}</td>
                <td>{dispatch.courier}</td>
                <td>{new Date(dispatch.dispatchDate).toLocaleDateString()}</td>
                <td>{dispatch.estimatedDelivery ? new Date(dispatch.estimatedDelivery).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <span className={`status status-${dispatch.status}`}>{dispatch.status}</span>
                </td>
                <td>
                  <select 
                    value={dispatch.status}
                    onChange={(e) => updateDispatchStatus(dispatch._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
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

export default Dispatch;