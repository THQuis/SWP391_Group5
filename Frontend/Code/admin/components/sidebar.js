import React from 'react';
import { Nav } from 'react-bootstrap';
import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar d-flex flex-column p-3">
            <img src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/logo.png?raw=true"
                alt="Logo" className="logo mb-4" />
            <Nav className="flex-column">
                <Nav.Link href="#">Dashboard</Nav.Link>
                <Nav.Link href="#">Quản lý người dùng</Nav.Link>
                <Nav.Link href="#">Gói thành viên</Nav.Link>
                <Nav.Link href="#">Quản lý blog</Nav.Link>
                <Nav.Link href="#">Thành tích - huy hiệu</Nav.Link>
                <Nav.Link href="#">Thông báo</Nav.Link>
                <Nav.Link href="#">Quản lý tiến trình</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;
