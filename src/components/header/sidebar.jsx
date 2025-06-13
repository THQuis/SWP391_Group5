// src/components/sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../header/sidebar.scss';

const Sidebar = () => {
    return (

        <div className="sidebar d-flex flex-column p-3">
            <img src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/logo.png?raw=true"
                alt="Logo" className="logoSibar mb-4" />
            <Nav className="flex-column  w-100">
                <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link> {/* Chỉnh sửa từ href thành Link */}
                <Nav.Link as={Link} to="/admin/users">Quản lý người dùng</Nav.Link> {/* Đảm bảo sử dụng Link */}
                <Nav.Link href="#">Gói thành viên</Nav.Link>
                <Nav.Link as={Link} to="/admin/ManagementBlog">Quản lý blog</Nav.Link>
                <Nav.Link href="#">Thành tích - huy hiệu</Nav.Link>
                <Nav.Link href="#">Thông báo</Nav.Link>
                <Nav.Link href="#">Quản lý tiến trình</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;