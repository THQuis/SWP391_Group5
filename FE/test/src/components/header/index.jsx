import React from 'react';
import { Navbar, Nav, Container, Dropdown, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import "../header/header.scss";
import { toast } from 'react-toastify';

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
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      toast.success('Đăng xuất thành công! Hẹn gặp lại bạn.', {
        autoClose: 500, // Thông báo tự đóng sau 2 giây
        onClose: () => {
          window.location.href = '/'; // Chuyển hướng về trang chủ
        }
      });
    } else {
      const errorData = await response.json().catch(() => null);
      toast.error(errorData?.message || 'Có lỗi xảy ra khi đăng xuất.');
    }
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    toast.error('Không thể kết nối với máy chủ. Vui lòng thử lại!');
  }
};

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  return (
    <Navbar expand="lg" bg="light" className="shadow-sm border-bottom sticky-navbar" style={{ backgroundColor: '#C1DCDC' }}>
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
            {(!isLoggedIn || userRole === "2") && (
              <>
                {isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">Trang chủ</Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.PROGRESS} className="nav-item-custom">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.QUITPLAN} className="nav-item-custom">Kế hoạch</Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.BLOG} className="nav-item-custom">Cộng đồng</Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.MILESTONES} className="nav-item-custom">Tiến trình</Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.CHALENGE} className="nav-item-custom">Thử Thách</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.USER.HOME} className="nav-item-custom">Trang chủ</Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">Dashboard</Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">Kế hoạch</Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">Cộng đồng</Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">Tiến trình</Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">Thử Thách</Nav.Link>
                  </>
                )}
              </>
            )}

            {userRole === "3" && (
              <>
                <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">Trang chủ</Nav.Link>
                <Nav.Link as={Link} to={ROUTERS.COACH.DASHBOARD} className="nav-item-custom">Dashboard</Nav.Link>
                <Nav.Link as={Link} to={ROUTERS.COACH.MEMBER} className="nav-item-custom">Quản lý thành viên</Nav.Link>

                <Nav.Link as={Link} to={ROUTERS.COACH.BOOKING} className="nav-item-custom">Lịch tư vấn</Nav.Link>
                {/* ... */}
              </>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-user">
                  <Image
                    src="https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/492103928_1330450674698672_3871763749774199059_n.jpg?stp=c0.17.541.541a_dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_ohc=lGKKYzKkgfIQ7kNvwGljziI&_nc_oc=Adlzp7moIe-dlIJIUKv6w9Bnrw6RnjGfhXgcALsMpyR1Adhoq6Y3GFiIBErWQbrlblk&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=IGNMo7SfRU6hW7L9AAgIYA&oh=00_AfM8SSNbJD8nqna1KJT-WmasO6ZdzGrCrthnAEshqi87YQ&oe=685547F2"
                    width={30}
                    height={30}
                    roundedCircle
                    className="me-2"
                  />
                  Tài khoản
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {/* MENU CHO MEMBER */}
                  {userRole === "2" && (
                    <>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PROFILE}>Hồ sơ cá nhân</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.RANKING}>Bảng xếp hạng</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.COACH}>Coach</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.RANKING}>Dashboard</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PACKAGE}>Gói thành viên</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.MYCONSUL}>Lịch tư vấn</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to={ROUTERS.USER.RANKING}>Cài đặt</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.RANKING}>Hỗ trợ</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.HOME}>Về Chúng Tôi</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as="button" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </>
                  )}

                  {/* MENU CHO COACH */}
                  {userRole === "3" && (
                    <>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PROFILE}>Hồ sơ Coach</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.MANAGE}>Quản lý thành viên</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.SCHEDULE}>Lịch tư vấn</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.SETTINGS}>Cài đặt</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.HELP}>Hỗ trợ</Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.HOME}>Về Chúng Tôi</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as="button" onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </>
                  )}
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