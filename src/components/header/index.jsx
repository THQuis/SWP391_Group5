import React from 'react';
import { Navbar, Nav, Container, Dropdown, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import "../header/header.scss";

const handleLogout = () => {
  // SỬ DỤNG ĐÚNG TÊN KEY ĐÃ LƯU LÚC ĐĂNG NHẬP
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName'); // Đừng quên xóa cả userName

  alert('🚪 Đăng xuất thành công!');
  window.location.href = '/'; // Chuyển hướng về trang chủ
};

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('userToken');
  // const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  return (
    <Navbar expand="lg" bg="light" className="shadow-sm border-bottom" style={{ backgroundColor: '#C1DCDC' }}>
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to={ROUTERS.USER.HOME}>
          <Image
            src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/logo.png?raw=true"
            alt="Logo"
            width="80"
          />
        </Navbar.Brand>

        {/* Responsive toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          {/* Nav links */}
          <Nav className="me-auto gap-3 align-items-center">
            <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">Trang chủ</Nav.Link>
            <Nav.Link href="#blog" className="nav-item-custom">Kế hoạch</Nav.Link>
            <Nav.Link href="#rankings1" className="nav-item-custom">Cộng đồng</Nav.Link>
            <Nav.Link href="#progress" className="nav-item-custom">Tiến trình</Nav.Link>
          </Nav>


          {/* Auth section */}
          <Nav>
            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-user">
                  <Image
                    src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/user.png?raw=true"
                    width={30}
                    height={30}
                    roundedCircle
                    className="me-2"
                  />
                  Tài khoản
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/user/profile">👤 Xem Profile</Dropdown.Item>
                  <Dropdown.Item href="#achievements">🏆 Thành Tích</Dropdown.Item>
                  <Dropdown.Item href="#community">🧑‍⚕️ Coach</Dropdown.Item>
                  <Dropdown.Item href="#dashboard">📊 Dashboard</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#settings">⚙️ Cài đặt</Dropdown.Item>
                  <Dropdown.Item href="#support">💬 Hỗ trợ</Dropdown.Item>
                  <Dropdown.Item href="#about">ℹ️ Về Chúng Tôi</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={handleLogout}>🚪 Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to={ROUTERS.AUTH.LOGIN} variant="success">
                Đăng nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
