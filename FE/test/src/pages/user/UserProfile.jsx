import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [editInfo, setEditInfo] = useState({
        fullName: '',
        phoneNumber: '',
        profilePicture: '',
    });

    // Hàm đổi ảnh đại diện, chuyển sang base64
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditInfo(prev => ({
                    ...prev,
                    profilePicture: reader.result // base64 string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Hàm lưu chỉnh sửa profile
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const body = {
                email: user.email,
                fullName: editInfo.fullName,
                phoneNumber: editInfo.phoneNumber,
                profilePicture: editInfo.profilePicture,
            };
            const res = await fetch('/api/user/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                alert('Cập nhật thành công!');
                setShowEditModal(false);
                fetchUserProfile(); // refresh lại dữ liệu mới
            } else {
                alert(data.error || data.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            alert('Có lỗi khi cập nhật!');
        }
    };
    // Lấy profile từ server
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                }
            });
            if (!res.ok) {
                throw new Error('Không lấy được thông tin người dùng');
            }
            const data = await res.json();
            setUser({
                avatar: data.user.profilePicture || 'https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true',
                fullName: data.user.fullName,
                email: data.user.email,
                gender: data.user.gender || '',
                memberSince: data.user.registrationDate,
                memberPackage: data.user.roleName,
                phoneNumber: data.user.phoneNumber,
                status: data.user.status
            });
        } catch (e) {
            alert(e.message);
        }
    };
    // Khi bấm nút sửa, set lại editInfo từ user
    const handleOpenEditModal = () => {
        setEditInfo({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            profilePicture: user.avatar || '',
        });
        setAvatarPreview(null);
        setShowEditModal(true);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': '*/*'
                    }
                });
                if (!res.ok) {
                    throw new Error('Không lấy được thông tin người dùng');
                }
                const data = await res.json();
                // data.user là object user trong response
                setUser({
                    avatar: data.user.profilePicture || 'https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true',
                    fullName: data.user.fullName,
                    email: data.user.email,
                    gender: data.user.gender || '', // Thêm nếu backend trả về
                    yearOfBirth: '', // Nếu backend trả về thì truyền vào, không thì để rỗng hoặc bỏ field này
                    memberSince: data.user.registrationDate,
                    memberPackage: data.user.roleName,
                    smokingStatus: {
                        cigarettesPerDay: '', // Nếu backend trả về thì truyền vào
                        frequency: '',        // Nếu backend trả về thì truyền vào
                        costPerPack: '',      // Nếu backend trả về thì truyền vào
                    },
                    quitPlan: {
                        reason: '',
                        startDate: '',
                        goalDate: '',
                        stages: [],
                    },
                    progress: {
                        smokeFreeDays: '',
                        moneySaved: '',
                        healthImprovement: '',
                        badges: [],
                    },
                    phoneNumber: data.user.phoneNumber,
                    status: data.user.status
                });
                setEditInfo((prev) => ({
                    ...prev,
                    fullName: data.user.fullName,
                    yearOfBirth: '', // tuỳ backend
                }));
            } catch (e) {
                alert(e.message);
            }
        };
        fetchUserProfile();
    }, []);

    // Hàm xử lý xóa tài khoản và token, sau đó chuyển về trang chủ
    const handleDeleteAccount = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
            try {
                const token = localStorage.getItem('userToken');
                const email = localStorage.getItem('userEmail');
                const response = await fetch('/api/user/delete-user', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email }),
                });
                const resText = await response.text();
                console.log('Status:', response.status, 'Response:', resText);
                if (response.ok) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                } else {
                    alert('Xóa tài khoản thất bại! ' + resText);
                }
            } catch (error) {
                alert('Có lỗi mạng!');
            }
        }
    };
    if (!user) return <div className="text-center mt-5">Đang tải thông tin...</div>;

    return (
        <Container className="">
            <Card className="mb-4 shadow-sm text-center p-4">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={avatarPreview || editInfo.profilePicture || user.avatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <Button
                        size="sm"
                        variant="dark"
                        style={{ position: 'absolute', bottom: 0, right: 0 }}
                        onClick={handleOpenEditModal}
                    >
                        ✏️
                    </Button>
                </div>
                <h4 className="mt-3">{user.fullName}</h4>
            </Card>

            {/* Thông tin cá nhân */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5>👤 Thông tin cá nhân</h5>
                    <Row>
                        <Col md={6}>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Giới tính:</strong> {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : ''}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Ngày tham gia:</strong> {user.memberSince}</p>
                            <p><strong>Gói thành viên:</strong> <Badge bg="success">{user.memberPackage}</Badge></p>
                            <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>



            {/* Nút xóa tài khoản căn giữa */}
            <div className="mt-3 d-flex justify-content-center">
                <Button variant="danger" onClick={handleDeleteAccount}>
                    Xóa tài khoản
                </Button>
            </div>
            <br />

            {/* Modal chỉnh sửa */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <h6>Ảnh đại diện</h6>
                        <img
                            src={avatarPreview || editInfo.profilePicture || user.avatar}
                            alt="avatar"
                            className="rounded-circle mb-2"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <Form.Group controlId="formAvatar">
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                        </Form.Group>
                    </div>
                    <hr />
                    <Form.Group className="mb-2">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={editInfo.fullName}
                            onChange={(e) => setEditInfo({ ...editInfo, fullName: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type="text"
                            value={editInfo.phoneNumber}
                            onChange={(e) => setEditInfo({ ...editInfo, phoneNumber: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Đóng</Button>
                    <Button variant="primary" onClick={handleSaveProfile}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserProfile;