import React from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';

const AdminLayout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div style={{ marginLeft: 220 }}> {/* Đẩy nội dung sang phải */}
                <Header />
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
