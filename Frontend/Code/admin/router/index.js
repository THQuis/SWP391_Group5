import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import HomePage from '../pages/homePage'; // nhớ export default HomePage

const AppRouter = () => {
    return (
        <Routes>
            {/* Trang mặc định: AdminDashboard */}
            <Route path="/" element={<AdminDashboard />} />

            {/* Trang home khi bấm icon House */}
            <Route path="/home" element={<HomePage />} />
        </Routes>
    );
};

export default AppRouter;
