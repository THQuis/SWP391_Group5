import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [editInfo, setEditInfo] = useState({
        fullName: '',
        yearOfBirth: '',
        cigarettesPerDay: '',
        frequency: '',
        costPerPack: '',
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatarPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        const mockUser = {
            avatar: 'https://via.placeholder.com/120',
            fullName: 'Nguyễn Văn A',
            email: 'vana@gmail.com',
            gender: 'male',
            yearOfBirth: 1990,
            memberSince: '2024-10-01',
            memberPackage: 'Premium',
            smokingStatus: {
                cigarettesPerDay: 10,
                frequency: 'Hàng ngày',
                costPerPack: 25000,
            },
            quitPlan: {
                reason: 'Vì sức khỏe & gia đình',
                startDate: '2025-05-01',
                goalDate: '2025-08-01',
                stages: ['Giảm còn 5 điếu/ngày', 'Chuyển sang kẹo cao su nicotine', 'Không hút nữa'],
            },
            progress: {
                smokeFreeDays: 14,
                moneySaved: 117000,
                healthImprovement: 'Cảm thấy dễ thở và ngủ ngon hơn',
                badges: ['1-day smoke free', '100K money saved'],
            },
        };

        setTimeout(() => {
            setUser(mockUser);
            setEditInfo({
                fullName: mockUser.fullName,
                yearOfBirth: mockUser.yearOfBirth,
                cigarettesPerDay: mockUser.smokingStatus.cigarettesPerDay,
                frequency: mockUser.smokingStatus.frequency,
                costPerPack: mockUser.smokingStatus.costPerPack,
            });
        }, 500);
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
        <Container className="mt-4">
            {/* Avatar và tên */}
            <Card className="mb-4 shadow-sm text-center p-4">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                        src={avatarPreview || user.avatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <Button
                        size="sm"
                        variant="dark"
                        style={{ position: 'absolute', bottom: 0, right: 0 }}
                        onClick={() => setShowEditModal(true)}
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
                            <p><strong>Giới tính:</strong> {user.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Năm sinh:</strong> {user.yearOfBirth}</p>
                            <p><strong>Ngày tham gia:</strong> {user.memberSince}</p>
                            <p><strong>Gói thành viên:</strong> <Badge bg="success">{user.memberPackage}</Badge></p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tình trạng hút thuốc */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5>🚬 Tình trạng hút thuốc ban đầu</h5>
                    <p><strong>Số điếu mỗi ngày:</strong> {user.smokingStatus.cigarettesPerDay}</p>
                    <p><strong>Tần suất:</strong> {user.smokingStatus.frequency}</p>
                    <p><strong>Giá mỗi bao thuốc:</strong> {user.smokingStatus.costPerPack.toLocaleString()}đ</p>
                </Card.Body>
            </Card>

            {/* Kế hoạch cai thuốc */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5>📝 Kế hoạch cai thuốc</h5>
                    <p><strong>Lý do:</strong> {user.quitPlan.reason}</p>
                    <p><strong>Ngày bắt đầu:</strong> {user.quitPlan.startDate}</p>
                    <p><strong>Ngày dự kiến:</strong> {user.quitPlan.goalDate}</p>
                    <ul>
                        {user.quitPlan.stages.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card.Body>
            </Card>

            {/* Tiến trình */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5>📈 Tiến trình hiện tại</h5>
                    <Row>
                        <Col md={4}><p><strong>Số ngày không hút:</strong> {user.progress.smokeFreeDays}</p></Col>
                        <Col md={4}><p><strong>Tiền tiết kiệm:</strong> {user.progress.moneySaved.toLocaleString()}đ</p></Col>
                        <Col md={4}><p><strong>Sức khỏe cải thiện:</strong> {user.progress.healthImprovement}</p></Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Huy hiệu */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5>🏆 Huy hiệu thành tích</h5>
                    {user.progress.badges.map((badge, idx) => (
                        <Badge key={idx} bg="primary" className="me-2 mb-2">{badge}</Badge>
                    ))}
                </Card.Body>
            </Card>
            {/* Nút xóa tài khoản căn giữa */}
            <div className="mt-3 d-flex justify-content-center">
                <Button variant="danger" onClick={handleDeleteAccount}>
                    Xóa tài khoản
                </Button>
            </div>
            <br />

            {/* Modal chỉnh sửa (thêm sửa tên) */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center mb-3">
                        <h6>Ảnh đại diện</h6>
                        <img
                            src={avatarPreview || user.avatar}
                            alt="avatar"
                            className="rounded-circle mb-2"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <Form.Group controlId="formAvatar">
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                        </Form.Group>
                    </div>

                    <hr />
                    <h6 className="mt-3">Thông tin cá nhân</h6>
                    <Form.Group className="mb-2">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={editInfo.fullName}
                            onChange={(e) => setEditInfo({ ...editInfo, fullName: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Năm sinh</Form.Label>
                        <Form.Control
                            type="number"
                            value={editInfo.yearOfBirth}
                            onChange={(e) => setEditInfo({ ...editInfo, yearOfBirth: e.target.value })}
                        />
                    </Form.Group>

                    <h6 className="mt-3">Tình trạng hút thuốc</h6>
                    <Form.Group className="mb-2">
                        <Form.Label>Số điếu mỗi ngày</Form.Label>
                        <Form.Control
                            type="number"
                            value={editInfo.cigarettesPerDay}
                            onChange={(e) => setEditInfo({ ...editInfo, cigarettesPerDay: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Tần suất</Form.Label>
                        <Form.Control
                            type="text"
                            value={editInfo.frequency}
                            onChange={(e) => setEditInfo({ ...editInfo, frequency: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Giá mỗi bao thuốc</Form.Label>
                        <Form.Control
                            type="number"
                            value={editInfo.costPerPack}
                            onChange={(e) => setEditInfo({ ...editInfo, costPerPack: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Đóng</Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setUser((prev) => ({
                                ...prev,
                                fullName: editInfo.fullName,
                                yearOfBirth: editInfo.yearOfBirth,
                                smokingStatus: {
                                    ...prev.smokingStatus,
                                    cigarettesPerDay: editInfo.cigarettesPerDay,
                                    frequency: editInfo.frequency,
                                    costPerPack: editInfo.costPerPack,
                                },
                            }));
                            setShowEditModal(false);
                        }}
                    >
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserProfile;