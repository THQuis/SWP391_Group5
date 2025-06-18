import React from 'react';
import { Navbar, Nav, Container, Dropdown, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import "../header/header.scss";

const handleLogout = async () => {
  try {
    // Gửi yêu cầu đăng xuất đến máy chủ
    const response = await fetch('/api/Auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken')}` // Gửi token xác thực nếu cần
      }
    });

    if (response.ok) {
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');

      alert('🚪 Đăng xuất thành công!');
      window.location.href = '/'; // Chuyển hướng về trang chủ
    } else {
      alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!');
    }
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    alert('Không thể kết nối với máy chủ. Vui lòng thử lại sau!');
  }
};

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('userToken');

  return (
    <Navbar expand="lg" bg="light" className="shadow-sm border-bottom" style={{ backgroundColor: '#C1DCDC' }}>
      <Container>
        <Navbar.Brand as={Link} to={ROUTERS.USER.HOME}>
          <Image
            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/logo.png?raw=true"
            alt="Logo"
            width="80"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto gap-3 align-items-center">
            <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to={ROUTERS.USER.TEST} className="nav-item-custom">Dashboard</Nav.Link>
            <Nav.Link as={Link} to={ROUTERS.USER.QUITPLAN} className="nav-item-custom">Kế hoạch</Nav.Link>
            <Nav.Link as={Link} to={ROUTERS.USER.BLOG} className="nav-item-custom">Cộng đồng</Nav.Link>
            <Nav.Link as={Link} to={ROUTERS.USER.MILESTONES} className="nav-item-custom">Tiến trình</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-user">
                  <Image
                    src="https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true"
                    width={30}
                    height={30}
                    roundedCircle
                    className="me-2"
                  />
                  Tài khoản
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={ROUTERS.USER.PROFILE}> Xem Profile</Dropdown.Item>
                  <Dropdown.Item href="/User/ranking"> Thành Tích</Dropdown.Item>
                  <Dropdown.Item href="/User/coach">Coach</Dropdown.Item>
                  <Dropdown.Item href="/User/coachdashboard">Dashboard</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#settings">Cài đặt</Dropdown.Item>
                  <Dropdown.Item href="/User/package"> Mua Gói</Dropdown.Item>
                  <Dropdown.Item href="#support">Hỗ trợ</Dropdown.Item>
                  <Dropdown.Item href="#about">Về Chúng Tôi</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
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