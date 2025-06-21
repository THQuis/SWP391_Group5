import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { FaUserEdit, FaUser, FaTransgender, FaCalendarAlt, FaGem, FaPhoneAlt, FaEnvelope, FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [editInfo, setEditInfo] = useState({
        fullName: '',
        phoneNumber: '',
        profilePicture: '',
        description: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Thêm state cho modal xác nhận xóa

    // Đổi ảnh đại diện
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditInfo(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Lưu profile
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const body = {
                email: user.email,
                fullName: editInfo.fullName,
                phoneNumber: editInfo.phoneNumber,
                profilePicture: editInfo.profilePicture,
                description: editInfo.description
            };
            const res = await fetch('/api/user/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Cập nhật hồ sơ thành công!');
                setShowEditModal(false);
                // CẢI TIỆN 1: Tải lại dữ liệu mà không cần hiển thị lại màn hình loading toàn trang
                fetchUserProfile(false);
            } else {
                toast.error(data.error || data.message || 'Cập nhật thất bại!');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi kết nối tới máy chủ!');
        }
    };

    // Lấy profile
    const fetchUserProfile = async (showPageLoading = true) => {
        if (showPageLoading) {
            setIsLoading(true);
        }
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': '*/*' }
            });
            if (!res.ok) throw new Error('Không lấy được thông tin người dùng');
            const data = await res.json();
            let memberPackage = "Basic";
            if (data.user.membership && data.user.membership.packageType) {
                memberPackage = data.user.membership.packageType;
            }
            setUser({
                userID: data.user.userID,
                avatar: data.user.profilePicture || 'https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true',
                fullName: data.user.fullName,
                email: data.user.email,
                gender: data.user.gender || '',
                memberSince: data.user.registrationDate,
                memberPackage: memberPackage,
                phoneNumber: data.user.phoneNumber,
                status: data.user.status,
                description: data.user.description,
                membership: data.user.membership,
            });
        } catch (e) {
            toast.error(e.message);
        } finally {
            if (showPageLoading) {
                setIsLoading(false);
            }
        }
    };

    // Mở modal sửa
    const handleOpenEditModal = () => {
        setEditInfo({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            profilePicture: user.avatar || '',
            description: user.description || '',
        });
        setAvatarPreview(null);
        setShowEditModal(true);
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Xử lý khi nhấn nút xóa (chỉ mở modal xác nhận)
    const handleClickDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    // Thực sự xóa tài khoản khi xác nhận trong modal
    const handleConfirmDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const email = user.email;
            const response = await fetch('/api/user/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email }),
            });
            const resText = await response.text();
            if (response.ok) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');

                // CẢI TIỆN 2: Hiển thị toast và chỉ chuyển trang sau khi toast đóng
                toast.success('Xóa tài khoản thành công!', {
                    onClose: () => window.location.href = '/'
                });
            } else {
                toast.error('Xóa tài khoản thất bại! ' + resText);
            }
        } catch (error) {
            toast.error('Lỗi kết nối mạng, không thể xóa tài khoản!');
        } finally {
            setShowDeleteModal(false);
        }
    };
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải thông tin người dùng...</h4>
            </Container>
        );
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', textAlign: 'center' }}>
                <h4>Không thể tải được thông tin cá nhân.</h4>
                <p>Vui lòng thử tải lại trang hoặc đăng nhập lại.</p>
                <Button variant="success" onClick={() => window.location.reload()}>Tải lại trang</Button>
            </div>
        )
    }

    return (
        <Container fluid className="py-4" style={{ background: "#d5f5df", minHeight: "100vh" }}>
            {/* Profile Card */}
            <Card className="mb-4 mx-auto shadow-sm border-0"
                style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-center p-4 gap-4" style={{ minHeight: 230 }}>
                    <div className="text-center mb-2 mb-md-0" style={{ position: "relative" }}>
                        <img
                            src={avatarPreview || editInfo.profilePicture || user.avatar}
                            alt="Avatar"
                            className="rounded-circle border border-3 border-success shadow"
                            style={{ width: '140px', height: '140px', objectFit: 'cover', background: "#fff" }}
                        />
                        <OverlayTrigger placement="right" overlay={<Tooltip>Sửa hồ sơ</Tooltip>}>
                            <Button
                                variant="dark"
                                size="lg"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px #0002',
                                    zIndex: 2
                                }}
                                onClick={handleOpenEditModal}
                            >
                                <FaUserEdit size={22} />
                            </Button>
                        </OverlayTrigger>
                    </div>
                    <div className="flex-grow-1 text-center text-md-start">
                        <h2 className="fw-bold mb-2" style={{ lineHeight: 1.2 }}>{user.fullName}</h2>
                        <div className="mb-1" style={{ fontSize: "1.13rem", color: "#555", lineHeight: 1.6 }}>
                            <span style={{ color: "#4d4d4d", fontWeight: 500 }}>Tiểu sử:&nbsp;</span>
                            <span>{user.description || <span className="fst-italic text-muted">Chưa có tiểu sử</span>}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Thông tin cá nhân */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body style={{ background: "#fff", borderRadius: 22, padding: "2rem" }}>
                    <h5 className="mb-4" style={{ color: "#3d1877", fontWeight: 700, letterSpacing: 1 }}>
                        <FaUser className="me-2" /> Thông tin cá nhân
                    </h5>
                    <Row style={{ fontSize: "1.08rem", lineHeight: 2 }}>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="me-2" /><strong>Email:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{user.email}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaTransgender className="me-2" /><strong>Giới tính:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : ''}</span>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaCalendarAlt className="me-2" /><strong>Ngày tham gia:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{user.memberSince}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaGem className="me-2" /><strong>Gói thành viên:</strong>
                                <Badge
                                    bg={user.memberPackage === 'Premium' ? "success" : "secondary"}
                                    style={{
                                        fontSize: 16,
                                        padding: "6px 22px",
                                        borderRadius: 16,
                                        marginLeft: 10,
                                        fontWeight: 600,
                                        letterSpacing: 1.3
                                    }}>
                                    {user.memberPackage}
                                </Badge>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaPhoneAlt className="me-2" /><strong>Số điện thoại:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{user.phoneNumber}</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Nút xóa tài khoản căn giữa */}
            <div className="my-4 d-flex justify-content-center">
                <Button
                    variant="danger"
                    onClick={handleClickDeleteAccount}
                    size="lg"
                    style={{
                        borderRadius: 16,
                        padding: "10px 40px",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        background: "#e74c3c",
                        border: "none",
                        boxShadow: '0 2px 8px #0002'
                    }}
                >
                    <FaTrashAlt className="me-2 mb-1" /> Xóa tài khoản
                </Button>
            </div>

            {/* Modal xác nhận xóa tài khoản */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa tài khoản không? Hành động này <b>không thể hoàn tác</b>.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDeleteAccount}>
                        Xác nhận xóa
                    </Button>
                </Modal.Footer>
            </Modal>

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
                            className="rounded-circle mb-2 border border-2 border-success"
                            style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                        />
                        <Form.Group controlId="formAvatar" className="mt-2">
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                        </Form.Group>
                    </div>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={editInfo.fullName}
                            onChange={(e) => setEditInfo({ ...editInfo, fullName: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiểu sử</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editInfo.description}
                            onChange={e => setEditInfo({ ...editInfo, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
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