import React, { useState, useEffect, useMemo } from 'react';
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
// Giúp chuyển đổi giữa tên Role (ví dụ: 'Admin') và Role ID (ví dụ: '1')
const roleNameToIdMap = {
    'Admin': '1',
    'Member': '2',
    'Coach': '3'
};
const roleIdToNameMap = {
    '1': 'Admin',
    '2': 'Member',
    '3': 'Coach'
};

const ManagementUser = () => {
    // state
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('Tất cả vai trò');
    const [showModal, setShowModal] = useState(false);

    // *** CẢI TIẾN 1: Cập nhật state cho người dùng mới để bao gồm tất cả các trường trong form ***
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: "",
        registrationDate: '',
        status: '',
        roleID: '',


        confirm: '' // Thêm trường confirm password
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    // Hàm lấy danh sách người dùng, được tách ra để tái sử dụng
    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/Admin/ListUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
            });

            const usersWithRoles = res.data.map(user => ({
                ...user,
                // Giả sử API trả về user.role là ID, chúng ta chuyển nó thành tên
                roleName: roleIdToNameMap[user.role] || user.role
            }));
            // setUsers(res.data);
            setUsers(usersWithRoles);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách người dùng:', err);
            // Có thể thêm thông báo lỗi cho người dùng ở đây
        }
    };

    // 1) Lấy danh sách users khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- BẮT ĐẦU: LOGIC LỌC DỮ LIỆU ĐỂ TÌM KIẾM ---
    const filteredUsers = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

        return users.filter((user) => {
            // -- Điều kiện lọc theo Vai trò (Role) --
            // Match nếu người dùng chọn "Tất cả vai trò" HOẶC role của user khớp với role được chọn
            const roleMatch = filterRole === 'Tất cả vai trò' || user.roleName === filterRole;

            // Nếu vai trò không khớp, bỏ qua ngay, không cần kiểm tra tìm kiếm
            if (!roleMatch) {
                return false;
            }

            // -- Điều kiện lọc theo Ô tìm kiếm (Search Term) --
            // Nếu không có từ khóa tìm kiếm, coi như khớp
            if (!lowercasedSearchTerm) {
                return true;
            }

            // Kiểm tra khớp trên các trường ID, Tên, Gói
            const idMatch = user.userID.toString().includes(lowercasedSearchTerm);
            const nameMatch = user.fullName.toLowerCase().includes(lowercasedSearchTerm);
            const packageMatch = user.package && user.package.toLowerCase().includes(lowercasedSearchTerm);
            const roleNameMatch = user.roleName.toLowerCase().includes(lowercasedSearchTerm);

            // Chỉ trả về true nếu cả điều kiện role và điều kiện search đều khớp
            return idMatch || nameMatch || packageMatch || roleNameMatch;
        });
    }, [searchTerm, users, filterRole]);

    // *** CẢI TIẾN 2: Hoàn thiện hàm handleAddUser ***
    const handleAddUser = async () => {
        // a) Validation cơ bản
        if (!newUser.fullName || !newUser.email || !newUser.roleID || !newUser.password || !newUser.phoneNumber) {
            alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
            return;
        }

        if (newUser.password !== newUser.confirm) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        // b) Chuẩn bị payload để gửi lên API (loại bỏ trường 'confirm')
        const payload = {
            fullName: newUser.fullName, // Đảm bảo key khớp với API (ví dụ: fullName thay vì username)
            email: newUser.email,// Đảm bảo key và value khớp với API (ví dụ: 'Member' hoặc roleId)
            phoneNumber: newUser.phoneNumber,
            password: newUser.password,
            status: newUser.status,
            roleID: newUser.roleID

        };



        try {
            // c) Thêm Authorization Header vào request
            await axios.post('/api/Admin/AddUser', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                }
            });

            // d) Đóng modal và reset form
            setShowModal(false);
            setNewUser({ username: '', email: '', roleID: '', password: '', confirm: '' });

            // e) Lấy lại danh sách người dùng mới nhất từ server
            await fetchUsers();
            alert('Thêm người dùng thành công!');

        } catch (err) {
            // f) Xử lý lỗi và thông báo cho người dùng
            console.error('Add user failed:', err);
            const errorMessage = err.response?.data?.message || 'Thêm người dùng thất bại. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };

    // Modal chỉnh sửa
    const handleEdit = (user) => {
        setEditingUser(user); // Lưu thông tin người dùng đang được chỉnh sửa
        // Chuyển đổi tên vai trò hiện tại (ví dụ: "Admin") thành ID (ví dụ: "1") để hiển thị đúng trong dropdown
        const currentRoleId = roleNameToIdMap[user.roleName];
        setSelectedRoleId(currentRoleId);
        setSelectedStatus(user.status);
        setShowEditModal(true); // Mở modal chỉnh sửa
    };

    const handleSaveEdit = async () => {
        if (!editingUser) {
            alert('Không có thông tin người dùng để cập nhật.');
            return;
        }

        const originalRoleId = roleNameToIdMap[editingUser.roleName];
        const originalStatus = editingUser.status;

        // Tạo một mảng chứa các promise của các API call cần thực hiện
        const updatePromises = [];

        // 1. Kiểm tra nếu Role đã thay đổi thì thêm promise cập nhật Role
        if (selectedRoleId && selectedRoleId !== originalRoleId) {
            const updateRolePromise = axios.put(
                '/api/Admin/UpdateRole',
                selectedRoleId,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                        'Content-Type': 'application/json'
                    },
                    params: { id: editingUser.userID }
                }
            );
            updatePromises.push(updateRolePromise);
        }

        // 2. Kiểm tra nếu Status đã thay đổi thì thêm promise cập nhật Status
        if (selectedStatus && selectedStatus !== originalStatus) {
            const updateStatusPromise = axios.put(
                '/api/Admin/UpdateStatus',
                `"${selectedStatus}"`, // Gửi status dưới dạng một chuỗi JSON hợp lệ
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                        'Content-Type': 'application/json'
                    },
                    params: { id: editingUser.userID }
                }
            );
            updatePromises.push(updateStatusPromise);
        }

        // Nếu không có gì thay đổi, chỉ cần đóng modal
        if (updatePromises.length === 0) {
            setShowEditModal(false);
            return;
        }

        try {
            // Thực thi tất cả các promise cùng lúc
            await Promise.all(updatePromises);

            setShowEditModal(false);
            await fetchUsers(); // Tải lại dữ liệu mới
            alert('Cập nhật người dùng thành công!');

        } catch (err) {
            console.error('Lỗi khi cập nhật người dùng:', err);
            const errorMessage = err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };


    // xóa người dùng
    const handleDelete = async (userId) => {
        // Thêm xác nhận trước khi xóa
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                // Gọi API DELETE với URL và params chính xác
                await axios.delete('/api/Admin/DeleteUser', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                    },
                    params: { // Gửi ID dưới dạng query parameter
                        id: userId
                    }
                });

                // Cập nhật lại danh sách sau khi xóa thành công
                await fetchUsers();
                alert('Xóa người dùng thành công!');

            } catch (err) {
                // Xử lý lỗi và thông báo cho người dùng
                console.error('Delete user failed:', err);
                const errorMessage = err.response?.data?.message || 'Xóa người dùng thất bại. Vui lòng thử lại.';
                alert(errorMessage);
            }
        }
    };

    // Phần JSX giữ nguyên như của bạn
    return (
        <div className="user-management">
            <h2 className="text-center text-success"> Quản lý người dùng </h2>
            {/* ROW 1: Search + Filter + Add Button */}
            <Row className="align-items-center mb-4 controls">
                <Col md="4">
                    <InputGroup className="search-input">
                        <FormControl
                            placeholder="Tìm theo ID, Tên, Gói..."
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
                        <Dropdown.Toggle variant="light" >
                            {filterRole}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100">
                            <Dropdown.Item
                                key="all"
                                active={"Tất cả vai trò" === filterRole}
                                onClick={() => setFilterRole('Tất cả vai trò')}
                            >
                                Tất cả vai trò
                            </Dropdown.Item>
                            {['Admin', 'Member', 'Coach'].map(r => (
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
                                    {filteredUsers.map(u => (
                                        <tr key={u.userID}>
                                            <td>{u.userID}</td>
                                            <td>{u.fullName}</td>
                                            <td>{u.email}</td>
                                            <td> {u.role}</td>
                                            <td>{u.package}</td>
                                            <td>{u.status}</td>
                                            <td>{u.registrationDate}</td>
                                            <td>{u.achievements}</td>
                                            <td className="text-center">
                                                <Button variant="link" size="sm" onClick={() => handleEdit(u)}>
                                                    <FaEdit />
                                                </Button>
                                                {/* Cập nhật hàm xóa để truyền userID */}
                                                <Button variant="link" size="sm" onClick={() => handleDelete(u.userID)}>
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
                                    value={newUser.fullName}
                                    onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
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
                                    value={newUser.roleID}
                                    onChange={e => setNewUser({ ...newUser, roleID: e.target.value })}
                                >
                                    <option value="">Chọn vai trò</option>
                                    <option value="1">Admin</option>

                                    <option value="2">Member</option>
                                    <option value="3">Coach</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Phone:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    value={newUser.phoneNumber}
                                    onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm={4} className="text-sm-right">
                                Mật khẩu:
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="password"
                                    value={newUser.password}
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
                                    value={newUser.confirm}
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


            {/* --- BẮT ĐẦU: MODAL CHỈNH SỬA VAI TRÒ --- */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="p-3">
                    <Modal.Title className="w-100 text-center">Chỉnh sửa người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {editingUser && (
                        <Form>
                            <p className="mb-4">
                                Đang chỉnh sửa: <strong>{editingUser.fullName}</strong>
                            </p>

                            {/* Form Group cho Vai trò */}
                            <Form.Group as={Row} className="align-items-center mb-3">
                                <Form.Label column sm={4} className="text-sm-right">
                                    Vai trò:
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select" value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}>
                                        <option value="1">Admin</option>
                                        <option value="2">Member</option>
                                        <option value="3">Coach</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            {/* Form Group cho Trạng thái */}
                            <Form.Group as={Row} className="align-items-center mb-3">
                                <Form.Label column sm={4} className="text-sm-right">
                                    Trạng thái:
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                                        {/* Giả định các trạng thái có thể có */}
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="p-3">
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* --- KẾT THÚC: MODAL CHỈNH SỬA VAI TRÒ --- */}


        </div>
    );
};

export default ManagementUser;