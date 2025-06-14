import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const notificationTypeOptions = [
    { value: 'System', label: 'Hệ thống' },
    { value: 'advice', label: 'Tư vấn' },
    { value: 'reminder', label: 'Nhắc nhở' },
    { value: 'achievement', label: 'Thành tích' },
    { value: 'feedback', label: 'Phản hồi' },
];
const notifyToOptions = [
    { value: 'All Users', label: 'Tất cả người dùng' },
    { value: 'coach', label: 'Coach' },
    { value: 'member', label: 'Member' },
];

const ManagementNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newNotification, setNewNotification] = useState({
        notificationName: '',
        message: '',
        notificationType: '',
        condition: '',
        notificationFor: '',
        notificationDate: '',
    });

    // Lấy danh sách thông báo từ API
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch('/api/NotificationAdmin/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setNotifications(data);
            } catch {
                setNotifications([]);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    // Thêm mới: GỬI THÔNG BÁO qua API /api/NotificationAdmin/send
    const handleAddNotification = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const body = {
                toAllUsers: newNotification.notificationFor === 'All Users',
                toRole: newNotification.notificationFor !== 'All Users' ? newNotification.notificationFor : undefined,
                email: "", // nếu gửi cho email cụ thể, có thể bổ sung thêm trường input
                notificationID: 0, // tạo mới thì để 0
                userID: 0,
                message: newNotification.message,
                notificationDate: newNotification.notificationDate
                    ? new Date(newNotification.notificationDate).toISOString()
                    : new Date().toISOString(),
                sentAt: new Date().toISOString(),
                notificationType: newNotification.notificationType,
                notificationName: newNotification.notificationName,
                condition: newNotification.condition,
                notificationFor: newNotification.notificationFor,
                createdBy: userInfo.name || userInfo.username || "Admin"
            };

            const res = await fetch('/api/NotificationAdmin/send', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error();
            setShowModal(false);

            // Reload lại danh sách
            const reload = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/NotificationAdmin/list', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setNotifications(data);
                } catch {
                    setNotifications([]);
                }
                setLoading(false);
            };
            reload();
        } catch {
            alert("Tạo và gửi thông báo thất bại!");
        }
    };

    // Xử lý edit (mở modal, điền dữ liệu cũ)
    const handleEdit = (item) => {
        setNewNotification({
            notificationName: item.notificationName,
            message: item.message,
            notificationType: item.notificationType,
            condition: item.condition,
            notificationFor: item.notificationFor,
            notificationDate: (item.notificationDate || '').slice(0, 10),
        });
        setShowModal(true);
    };

    // Xử lý xóa (gọi API xóa)
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa thông báo này?")) return;
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch(`https://localhost:7049/api/NotificationAdmin/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error();
            setNotifications(notifications.filter(n => n.notificationID !== id));
        } catch {
            alert("Xóa thông báo thất bại!");
        }
    };

    return (
        <div>
            <h2 className="text-center text-success"> Quản lý thông báo </h2>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button variant="outline-primary" onClick={() => {
                        setShowModal(true);
                        setNewNotification({
                            notificationName: '',
                            message: '',
                            notificationType: '',
                            condition: '',
                            notificationFor: '',
                            notificationDate: '',
                        });
                    }}>
                        Tạo thông báo <FaPlus />
                    </Button>
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên thông báo</th>
                                <th>Nội dung</th>
                                <th>Loại thông báo</th>
                                <th>Mô tả/Điều kiện</th>
                                <th>Thông báo cho</th>
                                <th>Ngày gửi</th>
                                <th>Người tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center">Đang tải...</td>
                                </tr>
                            ) : notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center text-secondary">Không có thông báo nào.</td>
                                </tr>
                            ) : (
                                notifications.map((item, idx) => (
                                    <tr key={item.notificationID}>
                                        <td>{idx + 1}</td>
                                        <td>{item.notificationName}</td>
                                        <td>{item.message}</td>
                                        <td>{notificationTypeOptions.find(opt => opt.value === item.notificationType)?.label || item.notificationType}</td>
                                        <td>{item.condition}</td>
                                        <td>{notifyToOptions.find(opt => opt.value === item.notificationFor)?.label || item.notificationFor}</td>
                                        <td>{(item.notificationDate || '').slice(0, 10)}</td>
                                        <td>{item.createdBy}</td>
                                        <td>
                                            <Button variant="link" size="sm" onClick={() => handleEdit(item)}><FaEdit /></Button>
                                            <Button variant="link" size="sm" onClick={() => handleDelete(item.notificationID)}><FaTrash /></Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal thêm/sửa thông báo */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h3" style={{ fontWeight: 700 }}>
                        {newNotification.notificationName ? "Sửa thông báo" : "Thêm thông báo"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="notificationName">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Tên thông báo:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên thông báo"
                                    value={newNotification.notificationName}
                                    onChange={e => setNewNotification({ ...newNotification, notificationName: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationMessage">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Nội dung:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Nội dung gửi"
                                    value={newNotification.message}
                                    onChange={e => setNewNotification({ ...newNotification, message: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                    style={{ resize: 'none' }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationType">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Loại:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select
                                    value={newNotification.notificationType}
                                    onChange={e => setNewNotification({ ...newNotification, notificationType: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                >
                                    <option value="">Chọn loại</option>
                                    {notificationTypeOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationCondition">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Điều kiện:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập điều kiện"
                                    value={newNotification.condition}
                                    onChange={e => setNewNotification({ ...newNotification, condition: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationFor">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Thông báo cho:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select
                                    value={newNotification.notificationFor}
                                    onChange={e => setNewNotification({ ...newNotification, notificationFor: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                >
                                    <option value="">Chọn đối tượng</option>
                                    {notifyToOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationDate">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Ngày gửi:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="date"
                                    value={newNotification.notificationDate}
                                    onChange={e => setNewNotification({ ...newNotification, notificationDate: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        className="rounded-pill px-4 fw-semibold"
                        onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4 fw-semibold"
                        onClick={handleAddNotification}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagementNotification;