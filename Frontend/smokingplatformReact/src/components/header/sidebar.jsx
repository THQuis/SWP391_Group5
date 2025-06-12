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
                <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/user">Quản lý người dùng</Nav.Link>
                <Nav.Link as={Link} to="/admin/package">Gói thành viên</Nav.Link>
                <Nav.Link as={Link} to="/admin/blog">Quản lý blog</Nav.Link>
                <Nav.Link as={Link} to="/admin/performance">Thành tích - huy hiệu</Nav.Link>
                <Nav.Link as={Link} to="/admin/notification">Thông báo</Nav.Link>
                <Nav.Link as={Link} to="/admin/plan">Quản lý tiến trình</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;