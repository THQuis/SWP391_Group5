import React from 'react';
import { Navbar, Nav, Container, Dropdown, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import "../header/header.scss";
import { toast } from 'react-toastify';
import NotificationBell from '../../components/Notification/NotificationBell';

const handleLogout = async () => {
  try {
    const response = await fetch('/api/Auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      }
    });

    if (response.ok) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('coachId');
      localStorage.removeItem('profilePicture');
      toast.success('Đăng xuất thành công! Hẹn gặp lại bạn.', {
        autoClose: 500,
        onClose: () => {
          window.location.href = '/';
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
  const userName = localStorage.getItem('userName');
  const profilePicture = localStorage.getItem('profilePicture');

  // Avatar fallback function
  const getAvatarUrl = () => {
    if (profilePicture) return profilePicture;
    const defaultName = userName || 'User';
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(defaultName)}&backgroundColor=4CAF50&textColor=ffffff`;
  };

  return (
    <Navbar expand="lg" className="sticky-navbar">
      <Container>
        {/* Modern Brand */}
        <Navbar.Brand as={Link} to={ROUTERS.USER.HOME} className="modern-navbar-brand">
          <Image
            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/logo.png?raw=true"
            alt="Breath Again Logo"
          />
          <span className="brand-text">BreathAgain</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="modern-navbar-nav" />

        <Navbar.Collapse id="modern-navbar-nav" className="justify-content-between">
          {/* Navigation Links */}
          <Nav className="me-auto modern-nav">
            {(!isLoggedIn || userRole === "2") && (
              <>
                {isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">
                      🏠 Trang chủ
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.PROGRESS} className="nav-item-custom">
                      📊 Tiến trình
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.QUITPLAN} className="nav-item-custom">
                      📋 Kế hoạch
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.BLOG} className="nav-item-custom">
                      👥 Cộng đồng
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.MILESTONES} className="nav-item-custom">
                      📖 Cẩm nang
                    </Nav.Link>
                    <Nav.Link as={Link} to={ROUTERS.USER.CHALENGE} className="nav-item-custom">
                      🎯 Thử Thách
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.USER.HOME} className="nav-item-custom">
                      🏠 Trang chủ
                    </Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">
                      📊 Dashboard
                    </Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">
                      📋 Kế hoạch
                    </Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">
                      👥 Cộng đồng
                    </Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">
                      📊 Tiến trình
                    </Nav.Link>
                    <Nav.Link onClick={() => window.location.href = ROUTERS.AUTH.LOGIN} className="nav-item-custom">
                      🎯 Thử Thách
                    </Nav.Link>
                  </>
                )}
              </>
            )}

            {userRole === "3" && (
              <>
                <Nav.Link as={Link} to={ROUTERS.USER.HOME} className="nav-item-custom">
                  🏠 Trang chủ
                </Nav.Link>
                <Nav.Link as={Link} to={ROUTERS.COACH.MEMBER} className="nav-item-custom">
                  👥 Quản lý thành viên
                </Nav.Link>
                <Nav.Link as={Link} to={ROUTERS.COACH.BOOKING} className="nav-item-custom">
                  📅 Lịch tư vấn
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* User Section */}
          <Nav className="modern-user-section">
            {isLoggedIn && (
              <div className="notification-bell">
                <NotificationBell />
              </div>
            )}

            {isLoggedIn ? (
              <Dropdown align="end" className="user-dropdown">
                <Dropdown.Toggle id="dropdown-user">
                  <Image
                    src={getAvatarUrl()}
                    width={28}
                    height={28}
                    roundedCircle
                    className="user-avatar"
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName || 'User')}&backgroundColor=4CAF50&textColor=ffffff`;
                    }}
                  />
                  {userName || 'Tài khoản'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {userRole === "2" && (
                    <>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PROFILE}>
                        👤 Hồ sơ cá nhân
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.RANKING}>
                        🏆 Bảng xếp hạng
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.COACH}>
                        🧑‍⚕️ Coach
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PACKAGE}>
                        💎 Gói thành viên
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.ACHIVE}>
                        🏅 Huy hiệu và thành tích
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.MYCONSUL}>
                        📅 Lịch tư vấn
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to={ROUTERS.USER.HOME}>
                        ℹ️ Về Chúng Tôi
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as="button" onClick={handleLogout}>
                        🚪 Đăng xuất
                      </Dropdown.Item>
                    </>
                  )}
                  {(userRole === "3" || userRole === "1") && (
                    <>
                      <Dropdown.Item as={Link} to={ROUTERS.USER.PROFILE}>
                        👤 Hồ sơ Coach
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.MANAGE}>
                        👥 Quản lý thành viên
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.SCHEDULE}>
                        📅 Lịch tư vấn
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to={ROUTERS.COACH.HOME}>
                        ℹ️ Về Chúng Tôi
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as="button" onClick={handleLogout}>
                        🚪 Đăng xuất
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button as={Link} to={ROUTERS.AUTH.LOGIN} className="login-button">
                🔐 Đăng nhập
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;