import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router'; // hoặc AdminDashboard nếu bạn test riêng

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
