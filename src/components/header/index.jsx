import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import '../header/header.scss';

const Header = () => {
  const menuToggleRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const authSectionRef = useRef(null);

  useEffect(() => {
    const menuToggle = menuToggleRef.current;
    const dropdownMenu = dropdownMenuRef.current;
    const authSection = authSectionRef.current;

    if (!menuToggle || !dropdownMenu || !authSection) return;

    const toggleMenu = (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      dropdownMenu.classList.toggle('active');
    };

    const handleClickOutside = (e) => {
      if (!authSection.contains(e.target)) {
        menuToggle.classList.remove('active');
        dropdownMenu.classList.remove('active');
      }
    };

    menuToggle.addEventListener('click', toggleMenu);
    document.addEventListener('click', handleClickOutside);

    return () => {
      menuToggle.removeEventListener('click', toggleMenu);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className='header_1'>
      <nav className="containerHeader">
        <div className="logo">
          <img
            src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/logo.png?raw=true"
            alt="Breath Again Logo"
          />
        </div>
        <ul className="nav-links">
          <li><Link to={ROUTERS.USER.HOME}>Trang chủ</Link></li>
          <li><a href="#blog">Kế hoạch</a></li>
          <li><a href="#rankings1">Cộng đồng</a></li>
          <li><a href="#progress">Tiến trình</a></li>
        </ul>
        <div className="auth-section" ref={authSectionRef}>
          <Link className="auth-button" to={ROUTERS.AUTH.LOGIN}>Đăng nhập / đăng ký</Link>

          <div className="menu-toggle" ref={menuToggleRef}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="dropdown-menu" ref={dropdownMenuRef}>
            <ul>
              <li><a href="#profile"><span className="icon">👤</span>Xem Profile</a></li>
              <li><a href="#achievements"><span className="icon">🏆</span>Thành Tích</a></li>
              <li><a href="#community"><span className="icon">🧑‍⚕️</span>Coach</a></li>
              <li><a href="#dashboard"><span className="icon">📊</span>Dashboard</a></li>
              <li><div className="divider"></div></li>
              <li><a href="#settings"><span className="icon">⚙️</span>Cài Đặt</a></li>
              <li><a href="#support"><span className="icon">💬</span>Hỗ Trợ</a></li>
              <li><a href="#about"><span className="icon">ℹ️</span>Về Chúng Tôi</a></li>
              <li><div className="divider"></div></li>
              <li><a href="#logout"><span className="icon">🚪</span>Đăng Xuất</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
