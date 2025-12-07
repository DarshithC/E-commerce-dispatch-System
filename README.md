# E-commerce Product Dispatch and Profit Management System

Full-stack web application for managing e-commerce operations including products, orders, dispatch, and profit analytics.

## Features
- Product Management (CRUD)
- Order Management
- Dispatch Tracking
- Profit Analytics
- Real-time Dashboard

## Tech Stack
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Axios
- **Database:** MongoDB

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB connection
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` file in backend folder:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce_dispatch
PORT=5000
```

