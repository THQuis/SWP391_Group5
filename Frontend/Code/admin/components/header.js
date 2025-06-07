import React, { useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Bell, House } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const Header = () => {
    const [showNotification, setShowNotification] = useState(false);

    const toggleNotification = () => {
        setShowNotification(!showNotification);
    };

    return (
        <div style={{ position: 'relative' }}>
            <Navbar bg="light" className="justify-content-end px-3">
                {/* Bell icon → toggle thông báo */}
                <button
                    onClick={toggleNotification}
                    style={{
                        background: 'none',
                        border: 'none',
                        marginRight: '1rem',
                        cursor: 'pointer',
                    }}
                >
                    <Bell size={20} />
                </button>

                {/* Home icon → chuyển trang */}
                <Link
                    to="/home"
                    style={{ color: 'black', textDecoration: 'none' }}
                >
                    <House size={20} />
                </Link>
            </Navbar>

            {/* Hộp thông báo nhỏ bên phải */}
            {showNotification && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50px',
                        right: '20px',
                        width: '200px',
                        backgroundColor: '#fff',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '10px',
                        zIndex: 999,
                    }}
                >
                    <strong>🔔 Thông báo</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        <li>Thông báo mới 1</li>
                        <li>Thông báo mới 2</li>
                        <li>Thông báo mới 3</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Header;
