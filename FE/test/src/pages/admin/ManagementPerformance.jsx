import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ManagementPerformance = () => {
    const [badges, setBadges] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBadge, setNewBadge] = useState({ name: '', image: '', condition: '', description: '' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);

    // Lấy dữ liệu huy hiệu từ API
    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const res = await axios.get('/api/badges');  // Gọi API lấy danh sách huy hiệu
                setBadges(res.data);
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };

        fetchBadges();
    }, []);

    // Thêm huy hiệu mới
    const handleAddBadge = async () => {
        try {
            const res = await axios.post('/api/badges', newBadge);  // Gửi API để thêm huy hiệu mới
            setBadges([...badges, res.data]);
            setShowModal(false);
            setNewBadge({ name: '', image: '', condition: '', description: '' });
        } catch (err) {
            console.error('Lỗi khi thêm huy hiệu:', err);
        }
    };

    // Sửa huy hiệu
    const handleEdit = (badge) => {
        setEditingBadge(badge); // Lưu thông tin huy hiệu cần sửa
        setShowEditModal(true);  // Mở modal chỉnh sửa
    };

    const handleSaveEdit = async () => {
        try {
            const res = await axios.put(`/api/badges/${editingBadge.id}`, editingBadge); // Gửi API để sửa huy hiệu
            setBadges(badges.map(b => (b.id === editingBadge.id ? res.data : b))); // Cập nhật danh sách huy hiệu
            setShowEditModal(false);  // Đóng modal sau khi sửa
        } catch (err) {
            console.error('Lỗi khi sửa huy hiệu:', err);
        }
    };

    // Xóa huy hiệu
    const handleDelete = async (badgeId) => {
        try {
            await axios.delete(`/api/badges/${badgeId}`); // Gửi API để xóa huy hiệu
            setBadges(badges.filter(b => b.id !== badgeId));  // Xóa huy hiệu khỏi danh sách
        } catch (err) {
            console.error('Lỗi khi xóa huy hiệu:', err);
        }
    };

    return (
        <div className="badge-management">
            <h2 className="text-center text-success">Quản lý Thành tích - Huy hiệu</h2>

            {/* Bảng huy hiệu */}
            <Row className="mb-4">
                <Col className="d-flex justify-content-end">
                    <Button variant="outline-primary" onClick={() => setShowModal(true)}>
                        <FaPlus /> Tạo huy hiệu
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên huy hiệu</th>
                                        <th>Mô tả</th>
                                        <th>Biểu tượng</th>
                                        <th>Điều kiện</th>
                                        <th>Số người đạt được</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {badges.map((badge, index) => (
                                        <tr key={badge.id}>
                                            <td>{index + 1}</td>
                                            <td>{badge.name}</td>
                                            <td>{badge.description}</td>
                                            <td><img src={badge.image} alt={badge.name} width="50" /></td>
                                            <td>{badge.condition}</td>
                                            <td>{badge.achievedCount}</td>
                                            <td>{badge.status}</td>
                                            <td>
                                                <Button variant="link" size="sm" onClick={() => handleEdit(badge)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="link" size="sm" onClick={() => handleDelete(badge.id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal tạo huy hiệu */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo huy hiệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Tên huy hiệu:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBadge.name}
                                onChange={e => setNewBadge({ ...newBadge, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Ảnh:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBadge.image}
                                onChange={e => setNewBadge({ ...newBadge, image: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCondition">
                            <Form.Label>Điều kiện:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBadge.condition}
                                onChange={e => setNewBadge({ ...newBadge, condition: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Mô tả:</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newBadge.description}
                                onChange={e => setNewBadge({ ...newBadge, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddBadge}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chỉnh sửa huy hiệu */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa huy hiệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Tên huy hiệu:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBadge?.name}
                                onChange={e => setEditingBadge({ ...editingBadge, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Ảnh:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBadge?.image}
                                onChange={e => setEditingBadge({ ...editingBadge, image: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCondition">
                            <Form.Label>Điều kiện:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBadge?.condition}
                                onChange={e => setEditingBadge({ ...editingBadge, condition: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Mô tả:</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editingBadge?.description}
                                onChange={e => setEditingBadge({ ...editingBadge, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagementPerformance;
