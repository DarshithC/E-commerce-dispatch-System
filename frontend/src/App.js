import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Dispatch from './pages/Dispatch';
import ProfitAnalytics from './pages/ProfitAnalytics';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'dispatch':
        return <Dispatch />;
      case 'profit':
        return <ProfitAnalytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>E-Commerce Dispatch System</h1>
        <ul>
          <li onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>
            Dashboard
          </li>
          <li onClick={() => setCurrentPage('products')} className={currentPage === 'products' ? 'active' : ''}>
            Products
          </li>
          <li onClick={() => setCurrentPage('orders')} className={currentPage === 'orders' ? 'active' : ''}>
            Orders
          </li>
          <li onClick={() => setCurrentPage('dispatch')} className={currentPage === 'dispatch' ? 'active' : ''}>
            Dispatch
          </li>
          <li onClick={() => setCurrentPage('profit')} className={currentPage === 'profit' ? 'active' : ''}>
            Profit Analytics
          </li>
        </ul>
      </nav>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;