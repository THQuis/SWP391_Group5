import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const notificationTypeOptions = [
    { value: 'advice', label: 'Tư vấn' },
    { value: 'reminder', label: 'Nhắc nhở' },
    { value: 'achievement', label: 'Thành tích' },
    { value: 'feedback', label: 'Phản hồi' },
];

const notifyToOptions = [
    { value: 'coach', label: 'Coach' },
    { value: 'member', label: 'Member' },
];

const repeatOptions = [
    { value: 'daily', label: 'theo ngày' },
    { value: 'monthly', label: '1 lần theo tháng' },
];

const ManagementNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newNotification, setNewNotification] = useState({
        name: '',
        type: '',
        description: '',
        condition: '',
        notifyTo: '',
        repeat: '',
        date: '',
    });

    // Gắn API lấy danh sách ở đây
    useEffect(() => {
        // --------------------Giả lập dữ liệu thông báo--------------------
        setNotifications([
            {
                id: 1,
                name: 'Nhắc nhở học tập',
                type: 'reminder',
                description: 'Nhắc nhở hoàn thành bài tập về nhà',
                condition: 'Nộp bài trước 21h',
                notifyTo: 'member',
                repeat: 'daily',
                date: '2025-06-11'
            },
            {
                id: 2,
                name: 'Chúc mừng thành tích',
                type: 'achievement',
                description: 'Chúc mừng bạn đạt điểm cao',
                condition: 'Điểm > 9',
                notifyTo: 'member',
                repeat: 'monthly',
                date: '2025-06-10'
            },
            {
                id: 3,
                name: 'Tư vấn khóa học mới',
                type: 'advice',
                description: 'Khuyến khích đăng ký khóa học nâng cao',
                condition: 'Hoàn thành khóa cơ bản',
                notifyTo: 'coach',
                repeat: 'monthly',
                date: '2025-06-09'
            },
            {
                id: 4,
                name: 'Phản hồi ý kiến',
                type: 'feedback',
                description: 'Gửi phản hồi về trải nghiệm',
                condition: 'Sau khi hoàn thành khóa học',
                notifyTo: 'member',
                repeat: 'daily',
                date: '2025-06-08'
            }
        ]);
        // -----------------end of giả lập dữ liệu-------------------------- 
        // Gọi API để lấy dữ liệu thông báo từ server
        // Ví dụ: axios.get('/api/notifications').then(response => setNotifications(response.data));
        // fetchNotifications();
    }, []);

    // Gắn API thêm thông báo ở đây
    const handleAddNotification = async () => {
        // await axios.post('/api/notifications', newNotification);
        setShowModal(false);
    };

    // Gắn API sửa/xóa ở đây
    const handleEdit = (item) => { };
    const handleDelete = (id) => { };

    return (
        <div>
            <h2 className="text-center text-success"> Quản lý thông báo </h2>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button variant="outline-primary" onClick={() => setShowModal(true)}>
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
                                <th>Loại thông báo</th>
                                <th>Mô tả</th>
                                <th>Điều kiện</th>
                                <th>Thông báo cho</th>
                                <th>Lặp</th>
                                <th>Ngày gửi</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((item, idx) => (
                                <tr key={item.id}>
                                    <td>{idx + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{notificationTypeOptions.find(opt => opt.value === item.type)?.label}</td>
                                    <td>{item.description}</td>
                                    <td>{item.condition}</td>
                                    <td>{notifyToOptions.find(opt => opt.value === item.notifyTo)?.label}</td>
                                    <td>{repeatOptions.find(opt => opt.value === item.repeat)?.label}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <Button variant="link" size="sm" onClick={() => handleEdit(item)}><FaEdit /></Button>
                                        <Button variant="link" size="sm" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal Bootstrap hiển thị giữa màn hình */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="lg"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h3" style={{ fontWeight: 700 }}>
                        Thêm thông báo
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
                                    value={newNotification.name}
                                    onChange={e => setNewNotification({ ...newNotification, name: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="notificationType">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Loại:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Select
                                    value={newNotification.type}
                                    onChange={e => setNewNotification({ ...newNotification, type: e.target.value })}
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
                        <Form.Group as={Row} className="mb-3" controlId="notificationDescription">
                            <Form.Label column sm={3} className="fst-italic fw-semibold">
                                Mô tả:
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Nhập mô tả"
                                    value={newNotification.description}
                                    onChange={e => setNewNotification({ ...newNotification, description: e.target.value })}
                                    className="rounded-pill px-4 py-2"
                                    style={{ resize: 'none' }}
                                />
                            </Col>
                        </Form.Group>
                        {/* thêm các trường khác như Thông báo cho, Lặp, Ngày gửi thì bổ sung tương tự ở đây */}
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