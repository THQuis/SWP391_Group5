import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { FaHandsClapping } from 'react-icons/fa6';

const ManagementPerformance = () => {
    const [badges, setBadges] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBadge, setNewBadge] = useState({ achievementName: '', badgeImage: '', criteria: '', description: '', packageType: 'Basic' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [search, setSearch] = useState('');

    // Lấy dữ liệu huy hiệu từ API mới (ListAchievement)
    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.get('/api/Admin/ListAchievement', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setBadges(res.data);
        } catch (err) {
            console.error('Error fetching data', err);
        }
    };

    // Xử lý tìm kiếm
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            if (!search.trim()) {
                fetchBadges();
                return;
            }
            const res = await axios.get(`/api/Admin/Search`, {
                params: { keyword: search },
                headers: { Authorization: `Bearer ${token}` }
            });
            setBadges(res.data.data || []);
        } catch (err) {
            console.error('Lỗi khi tìm kiếm:', err);
        }
    };

    // Thêm huy hiệu mới
    const handleAddBadge = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.post('/api/Admin/AddAchivement', {
                achievementName: newBadge.achievementName,
                badgeImage: newBadge.badgeImage,
                criteria: newBadge.criteria,
                description: newBadge.description,
                packageType: newBadge.packageType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setBadges([...badges, res.data.data]);
            setShowModal(false);
            setNewBadge({ achievementName: '', badgeImage: '', criteria: '', description: '', packageType: 'Basic' });
        } catch (err) {
            console.error('Lỗi khi thêm huy hiệu:', err);
        }
    };

    // Sửa huy hiệu
    const handleEdit = (badge) => {
        setEditingBadge({ ...badge });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.put(
                `/api/Admin/UpdateAchievement/${editingBadge.achievementID}`,
                {
                    achievementName: editingBadge.achievementName,
                    description: editingBadge.description,
                    criteria: editingBadge.criteria,
                    badgeImage: editingBadge.badgeImage,
                    packageType: editingBadge.packageType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            // Cập nhật lại danh sách badge sau khi sửa
            await fetchBadges();
            setShowEditModal(false);
        } catch (err) {
            console.error('Lỗi khi sửa huy hiệu:', err);
        }
    };

    // Xóa huy hiệu
    const handleDelete = async (badgeId) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`/api/Admin/DeleteAchivement?id=${badgeId}`, {
                params: { id: badgeId },
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchBadges();
        } catch (err) {
            console.error('Lỗi khi xóa huy hiệu:', err);
        }
    };

    return (
        <div className="badge-management">
            <h2 className="text-center text-success">Quản lý Thành tích - Huy hiệu</h2>

            {/* Thanh tìm kiếm */}
            <Row className="mb-3">
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm theo tên, mô tả..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button variant="primary" type="submit">
                                <FaSearch />
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>

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
                                        <th>ID</th>
                                        <th>Tên huy hiệu</th>
                                        <th>Mô tả</th>
                                        <th>Biểu tượng</th>
                                        <th>Điều kiện</th>
                                        <th>Loại gói</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {badges.map((badge) => (
                                        <tr key={badge.achievementID}>
                                            <td>{badge.achievementID}</td>
                                            <td>{badge.achievementName}</td>
                                            <td>{badge.description}</td>
                                            <td>
                                                <FaHandsClapping color="#f7b801" size={22} title="Clap" />
                                            </td>
                                            <td>{badge.criteria}</td>
                                            <td>{badge.packageType}</td>
                                            <td>
                                                <Button variant="link" size="sm" onClick={() => handleEdit(badge)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="link" size="sm" onClick={() => handleDelete(badge.achievementID)}>
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
                                value={newBadge.achievementName}
                                onChange={e => setNewBadge({ ...newBadge, achievementName: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Ảnh:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBadge.badgeImage}
                                onChange={e => setNewBadge({ ...newBadge, badgeImage: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCondition">
                            <Form.Label>Điều kiện:</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBadge.criteria}
                                onChange={e => setNewBadge({ ...newBadge, criteria: e.target.value })}
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

                        <Form.Group controlId="formPackageType">
                            <Form.Label>Loại gói:</Form.Label>
                            <Form.Select
                                value={newBadge.packageType}
                                onChange={e => setNewBadge({ ...newBadge, packageType: e.target.value })}
                            >
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium</option>
                            </Form.Select>
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
                                value={editingBadge?.achievementName}
                                onChange={e => setEditingBadge({ ...editingBadge, achievementName: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formImage">
                            <Form.Label>Ảnh:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBadge?.badgeImage}
                                onChange={e => setEditingBadge({ ...editingBadge, badgeImage: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCondition">
                            <Form.Label>Điều kiện:</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingBadge?.criteria}
                                onChange={e => setEditingBadge({ ...editingBadge, criteria: e.target.value })}
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

                        <Form.Group controlId="formEditPackageType">
                            <Form.Label>Loại gói:</Form.Label>
                            <Form.Select
                                value={editingBadge?.packageType}
                                onChange={e => setEditingBadge({ ...editingBadge, packageType: e.target.value })}
                            >
                                <option value="Basic">Basic</option>
                                <option value="Premium">Premium</option>
                            </Form.Select>
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