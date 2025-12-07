import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ProfitAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/profit/analytics`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  return (
    <div className="profit-analytics">
      <h2>Profit Analytics</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p className="analytics-number">{analytics.totalOrders}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="analytics-number revenue">₹{analytics.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Total Cost</h3>
          <p className="analytics-number cost">₹{analytics.totalCost.toFixed(2)}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Total Profit</h3>
          <p className="analytics-number profit">₹{analytics.totalProfit.toFixed(2)}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Profit Margin</h3>
          <p className="analytics-number margin">{analytics.profitMargin}%</p>
        </div>
      </div>

      <div className="profit-breakdown">
        <h3>Profit Breakdown</h3>
        <div className="breakdown-bar">
          <div 
            className="breakdown-segment cost-segment" 
            style={{ width: `${(analytics.totalCost / analytics.totalRevenue * 100) || 0}%` }}
          >
            Cost
          </div>
          <div 
            className="breakdown-segment profit-segment" 
            style={{ width: `${(analytics.totalProfit / analytics.totalRevenue * 100) || 0}%` }}
          >
            Profit
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAnalytics;