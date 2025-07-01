import React, { useEffect, useState } from "react";
import { Dropdown, Badge, Spinner } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import '../../styles/nottification.scss';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/user/notifications/my", {
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setNotifications(data);
                    } else if (Array.isArray(data.data)) {
                        setNotifications(data.data);
                    } else if (Array.isArray(data.notificationList)) {
                        setNotifications(data.notificationList);
                    } else {
                        setNotifications([]);
                    }
                } else {
                    setNotifications([]);
                }
            } catch (e) {
                setNotifications([]);
            }
            setLoading(false);
        };

        fetchNotifications(); // Lấy lần đầu khi mount
        intervalId = setInterval(fetchNotifications, 60000); // Lấy lại mỗi 15s

        return () => clearInterval(intervalId);
    }, []);

    const handleViewNotification = async (id) => {
        try {
            await fetch(`/api/user/notifications/${id}/read`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
                },
            });
        } catch (error) {
            // Có thể thêm xử lý lỗi nếu cần
        }
        // navigate(`/notification/${id}`); // Nếu muốn chuyển sang trang chi tiết
    };

    // Đếm số thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                variant="light"
                id="dropdown-notifications"
                className="notification-bell"
            >
                <BellFill size={20} />
                {unreadCount > 0 && (
                    <Badge bg="danger" pill className="notification-badge">
                        {unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: 320 }}>
                <Dropdown.Header>Thông báo</Dropdown.Header>
                {loading ? (
                    <div className="text-center p-3">
                        <Spinner animation="border" size="sm" /> Đang tải...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center p-3 text-muted">Không có thông báo</div>
                ) : (
                    notifications.map((n, idx) => (
                        <Dropdown.Item
                            key={n.notificationID ?? idx}
                            className="d-flex flex-column"
                            style={{ cursor: "pointer", fontWeight: !n.isRead ? "bold" : "normal" }}
                            onClick={() => handleViewNotification(n.notificationID)}
                        >
                            {/* Sửa tại đây: notificationName là tiêu đề, message là nội dung */}
                            <div>
                                <span style={{ fontWeight: 700 }}>{n.notificationName}</span>
                                <div style={{ fontWeight: 400 }}>{n.message}</div>
                            </div>
                            <small className="text-muted">{n.sentAt}</small>
                        </Dropdown.Item>
                    ))
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;