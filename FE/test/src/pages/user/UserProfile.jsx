import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { FaUserEdit, FaUser, FaTransgender, FaCalendarAlt, FaGem, FaPhoneAlt, FaEnvelope, FaTrashAlt, FaBirthdayCake, FaHeart, FaCommentAlt, FaEye } from "react-icons/fa"; // THÊM FaHeart, FaCommentAlt, FaEye
import { data } from 'react-router-dom';
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
        gender: '',  //them gender, dateofbirth
        dateOfBirth: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Thêm state cho modal xác nhận xóa
    const [userBlogs, setUserBlogs] = useState([]);
    const [isBlogsLoading, setIsBlogsLoading] = useState(true);

    const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // --- BẮT ĐẦU THÊM HÀM MỚI TẠI ĐÂY ---
    const handleConfirmDeleteBlog = async () => {
        console.log("ĐANG CHẠY HÀM XÓA BÀI VIẾT");
        if (!blogToDelete) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('userToken');

            // SỬA DUY NHẤT VÀ QUAN TRỌNG NHẤT LÀ Ở ĐÂY:
            // Thay thế bằng đường dẫn đầy đủ đến API của bạn.
            // Hãy chắc chắn địa chỉ và cổng (7049) là chính xác.
            const res = await fetch(`/api/UserBlog/delete/${blogToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                }
            });

            if (res.ok) {
                // Nếu API trả về mã 204 (No Content), không cần phân tích JSON
                if (res.status === 204) {
                    toast.success('Đã xóa bài viết thành công!');
                } else {
                    // Nếu API trả về nội dung (ví dụ mã 200) thì mới phân tích JSON
                    const data = await res.json();
                    toast.success(data.message || 'Đã xóa bài viết thành công!');
                }

                // Cập nhật lại giao diện
                setUserBlogs(currentBlogs => currentBlogs.filter(blog => blog.blogID !== blogToDelete));
            } else {
                const errorText = await res.text();
                let errorMessage = 'Xóa bài viết thất bại!';
                try {
                    // Thử phân tích lỗi JSON từ backend nếu có
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.title || errorText;
                } catch (jsonError) {
                    // Nếu không phải JSON, dùng text
                    errorMessage = errorText;
                }
                throw new Error(errorMessage);
            }
        } catch (e) {
            // Lỗi này sẽ hiển thị khi không kết nối được tới server (sai URL, mất mạng, CORS)
            toast.error(`Lỗi: ${e.message}`);
        } finally {
            // Khối này LUÔN LUÔN chạy sau khi try...catch kết thúc
            setIsDeleting(false);
            setShowDeleteBlogModal(false);
            setBlogToDelete(null);
        }
    };
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
            let isoDateOfBirth = ''; // Biến để lưu ngày sinh ở định
            if (editInfo.dateOfBirth) {
                // Nếu user nhập 'YYYY-MM-DD', chuyển sang ISO string ở đầu ngày (UTC)
                isoDateOfBirth = new Date(editInfo.dateOfBirth).toISOString();
            }
            const body = {
                email: user.email,
                fullName: editInfo.fullName,
                phoneNumber: editInfo.phoneNumber,
                profilePicture: editInfo.profilePicture,
                description: editInfo.description,
                gender: editInfo.gender,  // them gen, birth
                dateOfBirth: isoDateOfBirth || '', // Chuyển đổi sang định dạng ISO nếu có
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
    // THÊM MỚI: Hàm lấy danh sách bài viết của người dùng
    const fetchUserBlogs = async () => {
        setIsBlogsLoading(true); // Bắt đầu tải, hiển thị spinner
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/UserBlog/my-blogs', { // SỬA: Đảm bảo URL đầy đủ nếu đang dùng localhost:3000
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': '*/*' }
            });
            if (!res.ok) {
                const errorText = await res.text(); // Lấy nội dung lỗi nếu có
                throw new Error(errorText || 'Không lấy được danh sách bài viết');
            }
            const data = await res.json();
            setUserBlogs(data); // Cập nhật state với dữ liệu bài viết
        } catch (e) {
            toast.error("Lỗi khi tải bài viết: " + e.message);
            setUserBlogs([]); // Đảm bảo userBlogs là một mảng rỗng nếu có lỗi
        } finally {
            setIsBlogsLoading(false); // Kết thúc tải, ẩn spinner
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
                gender: data.user.gender,
                dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.slice(0, 10) : '', // Chỉ lấy phần ngày
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
            gender: user.gender || '',  //thêm sau 
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '', // Chỉ lấy phần ngày
        });
        setAvatarPreview(null);
        setShowEditModal(true);
    };

    useEffect(() => {
        fetchUserProfile();
        fetchUserBlogs();
    }, []);

    // Xử lý khi nhấn nút xóa (chỉ mở modal xác nhận)
    const handleClickDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    // Thực sự xóa tài khoản khi xác nhận trong modal
    const handleConfirmDeleteAccount = async () => {
        console.log("!!! CẢNH BÁO: ĐANG CHẠY HÀM XÓA TÀI KHOẢN !!!");
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
                                <span className="ms-2" style={{ color: "#222" }}>{user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : ''}</span>
                            </div>

                            <div className="d-flex align-items-center mb-2">
                                <FaBirthdayCake className="me-2" /><strong>Ngày sinh:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : ''}</span>
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
            {/* THÊM MỚI: Phần hiển thị bài viết đã đăng */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body style={{ background: "#fff", borderRadius: 22, padding: "2rem" }}>
                    <h5 className="mb-4" style={{ color: "#3d1877", fontWeight: 700, letterSpacing: 1 }}>
                        <FaEye className="me-2" /> Bài viết đã đăng
                    </h5>
                    {isBlogsLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                            <Spinner animation="border" variant="success" />
                            <p className="ms-3">Đang tải bài viết...</p>
                        </div>
                    ) : (
                        // Dòng "const approvedBlogs" PHẢI NẰM TRONG KHỐI JAVASCRIPT {}
                        // BẮT ĐẦU PHẦN SỬA ĐỔI CHÍNH Ở ĐÂY
                        (() => { // Sử dụng IIFE (Immediately Invoked Function Expression) hoặc đơn giản là dùng một biến tạm
                            const approvedBlogs = userBlogs.filter(blog => blog.status === 'Approved');

                            return approvedBlogs.length > 0 ? (
                                <Row xs={1} md={1} lg={1} className="g-4">
                                    {approvedBlogs.map(blog => ( // Sử dụng mảng đã lọc
                                        <Col key={blog.blogID}>
                                            <Card className="shadow-sm h-100" style={{ borderRadius: '15px', border: '1px solid #e0e0e0' }}>
                                                <Card.Body>
                                                    <Card.Title className="mb-2 fw-bold" style={{ color: '#0a6435' }}>
                                                        {blog.title}
                                                    </Card.Title>
                                                    <Card.Text className="text-muted small mb-2">
                                                        Ngày đăng: {new Date(blog.createdDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        {blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content}
                                                    </Card.Text>
                                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                                        <div>
                                                            <span className="me-3">
                                                                <FaHeart className="text-danger me-1" /> {blog.likes} lượt thích
                                                            </span>
                                                            <span className="me-3">
                                                                <FaCommentAlt className="text-info me-1" /> {/* Nếu có trường comments, bạn có thể thay thế */}
                                                                0 bình luận
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            bg={'success'} // Luôn là màu xanh cho bài đã duyệt
                                                            className="p-2 rounded-pill"
                                                        >
                                                            Đã duyệt
                                                        </Badge>
                                                    </div>
                                                </Card.Body>
                                                <Card.Footer className="text-end bg-white border-top-0" style={{ borderRadius: '0 0 15px 15px' }}>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setBlogToDelete(blog.blogID);      // Lưu ID của blog cần xóa
                                                            setShowDeleteBlogModal(true); // Mở modal xác nhận
                                                        }}
                                                    >
                                                        <FaTrashAlt className="me-1" /> Xóa
                                                    </Button>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <p className="text-center text-muted fst-italic">Bạn chưa có bài viết nào được duyệt.</p>
                            );
                        })()
                    )}
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
            {/* --- BẮT ĐẦU THÊM MODAL MỚI TẠI ĐÂY --- */}
            <Modal show={showDeleteBlogModal} onHide={() => setShowDeleteBlogModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa bài viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa bài viết này không? Hành động này <b>không thể hoàn tác</b>.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteBlogModal(false)} disabled={isDeleting}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirmDeleteBlog}  // <<<--- KIỂM TRA KỸ DÒNG NÀY
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                    </Button>
                </Modal.Footer>
            </Modal>
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
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                            type="date"
                            value={editInfo.dateOfBirth}// chỉnh sửa date of birth
                            onChange={(e) => setEditInfo({ ...editInfo, dateOfBirth: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                            value={editInfo.gender}
                            onChange={(e) => setEditInfo({ ...editInfo, gender: e.target.value })}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </Form.Select>
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