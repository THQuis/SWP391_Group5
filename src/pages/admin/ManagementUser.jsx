// body trang
import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    InputGroup,
    FormControl,
    Dropdown,
    Button,
    Table,
    Modal,
    Form
} from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ManagementUser = () => {
    // state
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Member / Coach');
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: '' });
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(''); // 'success' | 'error'



    // 1) Lấy danh sách users mỗi khi searchTerm hoặc filterRole thay đổi
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/api/users', {
                    params: {
                        search: searchTerm,
                        role: filterRole !== 'Member / Coach' ? filterRole : undefined
                    }
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Fetch users failed:', err);
            }
        };
        fetchUsers();
    }, [searchTerm, filterRole]);

    // 2) Thêm user mới
    const handleAddUser = async () => {
        if (newUser.password !== newUser.confirm) {
            setMessageType('error');
            setMessage('❗ Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const res = await axios.post('/api/users', newUser);

            setMessageType('success');
            setMessage('✅ Thêm người dùng thành công.');

            setUsers(prev => [...prev, res.data]); // lấy user trả về từ BE
            setNewUser({ username: '', email: '', role: '', password: '', confirm: '' });

            // Optionally ẩn modal sau 1s
            setTimeout(() => {
                setShowModal(false);
                setMessage(null);
            }, 1500);
        } catch (err) {
            console.error('Add user failed:', err);
            setMessageType('error');
            setMessage('❌ Thêm thất bại. Vui lòng kiểm tra dữ liệu hoặc kết nối.');
        }
    };


    return (
        <div className="user-management">
            {/* ROW 1: Search + Filter + Add Button */}
            <Row className="align-items-center mb-4 controls">
                <Col md="4">
                    <InputGroup className="search-input">
                        <FormControl
                            placeholder="Tìm kiếm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Col>
                <Col md="3">
                    <Dropdown className="role-dropdown">
                        <Dropdown.Toggle variant="light" block>
                            {filterRole}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {['Member', 'Coach', 'Member / Coach'].map(r => (
                                <Dropdown.Item
                                    key={r}
                                    active={r === filterRole}
                                    onClick={() => setFilterRole(r)}
                                >
                                    {r}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md="5" className="d-flex justify-content-end">
                    <Button
                        className="add-user-btn"
                        variant='primary'
                        onClick={() => setShowModal(true)}
                    >
                        <FaPlus /> Thêm người dùng
                    </Button>
                </Col>
            </Row>

            {/* ROW 2: Table trong Card */}
            <Row>
                <Col>
                    <Card className="user-table">
                        <Card.Header>
                            <h5>Danh sách người dùng</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên tài khoản</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Gói</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Thành tích</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>
                                            <td>{u.package}</td>
                                            <td>{u.status}</td>
                                            <td>{u.registerDate}</td>
                                            <td>{u.achievements}</td>
                                            <td className="text-center">
                                                <Button variant="link" size="sm" onClick={() => {/* edit action */ }}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="link" size="sm" onClick={() => {/* delete action */ }}>
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

            {/* Modal Thêm Người Dùng (giữ nguyên) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="p-3">
                    <Modal.Title className="w-100 text-center">Thêm người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Họ và tên:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    value={newUser.username}
                                    onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Email:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="email"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Role:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    as="select"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="">Chọn vai trò</option>
                                    <option value="Member">Member</option>
                                    <option value="Coach">Coach</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Mật khẩu:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    value={newUser.password || ''}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-4">
                            <Form.Label column sm={4} className="text-sm-right">
                                Xác nhận mật khẩu:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    value={newUser.confirm || ''}
                                    onChange={e => setNewUser({ ...newUser, confirm: e.target.value })}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                    {message && (
                        <div className={`mt-3 alert alert-${messageType === 'success' ? 'success' : 'danger'}`} role="alert">
                            {message}
                        </div>
                    )}

                </Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagementUser;