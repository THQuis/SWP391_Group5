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
    Form,
    Pagination
} from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
// import '../admin/ManagementUser.scss';

// Số lượng user trên mỗi trang
const PAGE_SIZE = 5;

const ManagementUser = () => {
    // state
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Member / Coach');
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: '' });
    const [showEditModal, setShowEditModal] = useState(false); // Modal để chỉnh sửa
    const [editingUser, setEditingUser] = useState(null); // Dữ liệu người dùng đang chỉnh sửa

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pagedUsers, setPagedUsers] = useState([]);

    // 1) Lấy danh sách users mỗi khi searchTerm hoặc filterRole thay đổi
    useEffect(() => {
        // dữ liệu giả lập -----------------------------
        const fakeData = [
            { id: 1, username: 'John Doe', email: 'johndoe@example.com', role: 'Member', package: 'Basic', status: 'Active', registerDate: '2022-01-01', achievements: 'None' },
            { id: 2, username: 'Jane Smith', email: 'janesmith@example.com', role: 'Coach', package: 'Premium', status: 'Active', registerDate: '2021-11-15', achievements: '5 Stars' },
            { id: 3, username: 'Emily Davis', email: 'emilydavis@example.com', role: 'Member', package: 'Standard', status: 'Inactive', registerDate: '2022-03-22', achievements: 'Beginner' },
            { id: 4, username: 'Mike Tyson', email: 'miketyson@example.com', role: 'Member', package: 'Premium', status: 'Active', registerDate: '2022-04-01', achievements: 'Champion' },
            { id: 5, username: 'Bruce Lee', email: 'brucelee@example.com', role: 'Coach', package: 'Standard', status: 'Active', registerDate: '2022-05-01', achievements: 'Legend' },
            { id: 6, username: 'Anna Bell', email: 'annabell@example.com', role: 'Member', package: 'Basic', status: 'Inactive', registerDate: '2022-05-10', achievements: 'Silver' },
            { id: 7, username: 'Chris Red', email: 'chrisred@example.com', role: 'Coach', package: 'Premium', status: 'Active', registerDate: '2022-06-01', achievements: 'Gold' },
            { id: 8, username: 'Sara Lane', email: 'saralane@example.com', role: 'Member', package: 'Basic', status: 'Active', registerDate: '2022-07-01', achievements: 'Bronze' },
            { id: 9, username: 'Tom Hanks', email: 'tomhanks@example.com', role: 'Coach', package: 'Standard', status: 'Inactive', registerDate: '2022-08-01', achievements: 'Oscar' },
            { id: 10, username: 'Mary Jane', email: 'maryjane@example.com', role: 'Member', package: 'Premium', status: 'Active', registerDate: '2022-09-01', achievements: 'Diamond' }
        ];
        // Lọc theo searchTerm và filterRole
        let filtered = fakeData.filter(u =>
            (filterRole === 'Member / Coach' || u.role === filterRole) &&
            (u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setUsers(filtered);
        setCurrentPage(1); // reset về trang 1 mỗi lần search/filter
    }, [searchTerm, filterRole]);

    // Phân trang mỗi khi users hoặc currentPage thay đổi
    useEffect(() => {
        const pageCount = Math.ceil(users.length / PAGE_SIZE) || 1;
        setTotalPages(pageCount);
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setPagedUsers(users.slice(start, end));
    }, [users, currentPage]);

    // 2) Thêm user mới
    const handleAddUser = async () => {
        try {
            // await axios.post('/api/users', newUser);
            setShowModal(false);
            setUsers(prev => [...prev, { ...newUser, id: prev.length + 1 }]);
            setNewUser({ username: '', email: '', role: '' });
        } catch (err) {
            console.error('Add user failed:', err);
        }
    };
    // Modal chỉnh sửasửa
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };
    // xử lý người dùng
    const handleSaveEdit = async () => {
        try {
            // await axios.put(`/api/users/${editingUser.id}`, editingUser);
            setShowEditModal(false);
            setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
        } catch (err) {
            console.error('Edit user failed:', err);
        }
    };
    // xóa người dùng
    const handleDelete = async (userId) => {
        try {
            // await axios.delete(`/api/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            console.error('Delete user failed:', err);
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="user-management">
            <h2 className="text-center text-success"> Quản lý người dùng </h2>
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
                            <Dropdown.Item
                                active={'Member / Coach' === filterRole}
                                onClick={() => setFilterRole('Member / Coach')}
                            >
                                Member / Coach
                            </Dropdown.Item>
                            {['Member', 'Coach', 'Admin'].map(r => (
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
                                    {pagedUsers.map(u => (
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
                                                <Button variant="link" size="sm" onClick={() => handleEdit(u)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="link" size="sm" onClick={() => handleDelete(u.id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pagedUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center text-secondary">
                                                Không có người dùng nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            {/* Pagination */}
                            <div className="d-flex justify-content-center my-3">
                                <Pagination>
                                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <Pagination.Item
                                            key={idx + 1}
                                            active={currentPage === idx + 1}
                                            onClick={() => handlePageChange(idx + 1)}
                                        >
                                            {idx + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                </Pagination>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Thêm Người Dùng  */}
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