import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingDispatches: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders, profit] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/profit/analytics`)
      ]);
      
      setStats({
        totalProducts: products.data.length,
        totalOrders: orders.data.length,
        pendingDispatches: orders.data.filter(o => o.status === 'confirmed').length,
        revenue: profit.data.totalRevenue || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Dispatches</h3>
          <p className="stat-number">{stats.pendingDispatches}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;