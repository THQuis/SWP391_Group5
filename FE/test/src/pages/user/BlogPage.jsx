import React, { useState, useEffect, useRef } from "react";
import "../../styles/BlogPage.scss";
import { Container, Row, Col, Form, Button, Card, Modal, InputGroup, Dropdown, Spinner } from "react-bootstrap";
import {
    FaUserCircle, FaPlus, FaHeart, FaRegHeart, FaEllipsisV,
    FaEdit, FaTrash, FaFlag,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

// Lấy user từ localStorage hoặc bạn tuỳ chỉnh lại tuỳ hệ thống login
const CURRENT_USER = localStorage.getItem("userName") || "Tài khoản của bạn";

function UserBlog() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editImagePreview, setEditImagePreview] = useState("");
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState(""); // Thêm trường tiêu đề
    const [newContent, setNewContent] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newImagePreview, setNewImagePreview] = useState("");
    const [reportingBlog, setReportingBlog] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const fileInputRef = useRef();
    const fileEditInputRef = useRef();

    // Gọi API lấy danh sách blog (sử dụng Bearer token nếu cần)
    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("userToken");
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/UserBlog/all`, {
                    headers: token ? { "Authorization": `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error("Lỗi tải blog");
                const data = await res.json();
                setBlogs(data);
            } catch (err) {
                toast.error("Không thể tải dữ liệu blog");
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Tìm kiếm đơn giản
    const filteredBlogs = blogs.filter(
        (b) =>
        (b.content?.toLowerCase().includes(search.toLowerCase()) ||
            b.authorName?.toLowerCase().includes(search.toLowerCase()) ||
            b.title?.toLowerCase().includes(search.toLowerCase()))
    );

    // Like/Unlike bài viết (chỉ làm ở UI, muốn sync backend thì gọi API)
    const handleToggleLike = (blogId) => {
        setBlogs((prev) =>
            prev.map((b) =>
                b.blogId === blogId
                    ? {
                        ...b,
                        liked: !b.liked,
                        likes: b.liked ? (b.likes || 0) - 1 : (b.likes || 0) + 1,
                    }
                    : b
            )
        );
    };

    // Mở modal chỉnh sửa
    const handleShowEdit = (blog) => {
        setEditingBlog(blog);
        setEditContent(blog.content || "");
        setEditImage(blog.imageUrl || "");
        setEditImagePreview(blog.imageUrl || "");
        setShowEdit(true);
    };

    // Lưu chỉnh sửa (chỉ làm ở UI, muốn gọi API thì thêm call PATCH/PUT)
    const handleSaveEdit = async () => {
        const token = localStorage.getItem("userToken");
        const payload = {
            title: editingBlog.title, // hoặc cho phép sửa title luôn
            content: editContent,
            categoryName: editingBlog.categoryName || "", // hoặc cho phép sửa
            blogType: editingBlog.blogType || "",
            imageUrl: editImagePreview,
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/UserBlog/edit/${editingBlog.blogId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Sửa bài thất bại!");

            // Có thể lấy lại bài viết mới từ API nếu trả về
            // Hoặc chỉ update ở UI như sau:
            setBlogs((prev) =>
                prev.map((b) =>
                    b.blogId === editingBlog.blogId
                        ? { ...b, ...payload }
                        : b
                )
            );
            setShowEdit(false);
            toast.success("Đã lưu chỉnh sửa!");
        } catch (err) {
            toast.error("Sửa bài thất bại!");
        }
    };

    // Mở modal tạo bài viết mới
    const handleShowCreate = () => {
        setShowCreate(true);
        setNewTitle("");
        setNewContent("");
        setNewImage("");
        setNewImagePreview("");
    };

    // Lưu bài viết mới (GỌI API THẬT)
    const handleSaveCreate = async () => {
        const token = localStorage.getItem("userToken");
        const payload = {
            title: newTitle,
            content: newContent,
            categoryName: "",
            blogType: "",
            imageUrl: newImagePreview,
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/UserBlog/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Đăng bài thất bại!");

            const newBlog = await res.json();
            // Fix: nếu thiếu tên user thì tự thêm vào
            if (!newBlog.authorName) {
                newBlog.authorName = CURRENT_USER;
            }
            setBlogs(prev => [newBlog, ...prev]);
            setShowCreate(false);
            toast.success("Đã đăng bài thành công!");
        } catch (err) {
            toast.error("Đăng bài thất bại!");
        }
    };

    // Xoá bài viết của mình (chỉ xóa ở UI demo)
    const handleDeleteBlog = async (blogId) => {
        const token = localStorage.getItem("userToken");
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/UserBlog/delete/${blogId}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) throw new Error("Xóa bài thất bại!");

            setBlogs((prev) => prev.filter((b) => b.blogId !== blogId));
            toast.success("Đã xóa bài viết!");
        } catch (err) {
            toast.error("Xóa bài thất bại!");
        }
    };
    // Upload ảnh (base64 preview)
    const handleFileChange = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Báo cáo bài viết
    const handleReport = (blog) => {
        setReportingBlog(blog);
        setShowReportModal(true);
        setReportReason("");
    };

    // Nhận blog làm tham số
    const handleSendReport = async (blog) => {
        if (!blog || !blog.blogId) {
            toast.error("Không xác định được bài viết để báo cáo!");
            return;
        }
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/UserBlog/report/${blog.blogId}`, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (!res.ok) throw new Error("Báo cáo thất bại!");
            setBlogs((prev) =>
                prev.map((b) =>
                    b.blogId === blog.blogId
                        ? { ...b, reportCount: (b.reportCount || 0) + 1, reported: true }
                        : b
                )
            );
            toast.success("Đã gửi báo cáo bài viết!");
        } catch (err) {
            toast.error("Gửi báo cáo thất bại!");
        }
    };
    return (
        <div className="user-blog-bg">
            <Container style={{ minHeight: 700 }} className="py-3">
                <ToastContainer position="top-right" />
                {/* Thanh tìm kiếm */}
                <Row className="mb-3">
                    <Col md={12} className="d-flex align-items-center">
                        <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Tìm kiếm bài viết..."
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ background: "#eef6f7" }}
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {/* Button tạo bài viết mới */}
                <Row className="mb-3">
                    <Col md={12} className="d-flex align-items-center gap-2">
                        <FaUserCircle size={36} color="#8aa" />
                        <Button
                            variant="info"
                            style={{
                                background: "#c9e4ea",
                                color: "#3a4e5c",
                                border: "none",
                                borderRadius: 15,
                                fontWeight: 500,
                                fontSize: 18,
                            }}
                            className="py-2 px-4"
                            onClick={handleShowCreate}
                        >
                            Hãy cùng chia sẻ nào!! <FaPlus className="ms-2" />
                        </Button>
                    </Col>
                </Row>
                {/* Danh sách bài viết */}
                <Row>
                    <Col>
                        {isLoading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" />
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                Không tìm thấy bài viết nào.
                            </div>
                        ) : (
                            filteredBlogs.map((blog) => (
                                <Card
                                    key={blog.blogId}
                                    className="mb-4"
                                    style={{
                                        background: "#f5f2f2",
                                        border: "none",
                                        borderRadius: 15,
                                        boxShadow: "0 2px 8px #e3e3e3",
                                        maxWidth: 550,
                                        margin: "0 auto",
                                    }}
                                >
                                    <Card.Body style={{ paddingBottom: 10 }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaUserCircle size={30} color="#888" />
                                            <span style={{ fontWeight: 700, marginLeft: 8 }}>
                                                {blog.authorName}
                                            </span>
                                            <span style={{ color: "#888", marginLeft: 14, fontSize: 15 }}>
                                                {blog.createdDate?.slice(0, 10)}
                                            </span>
                                            {/* Menu chỉnh sửa bên phải nếu là bài của mình */}
                                            {blog.authorName === CURRENT_USER && (
                                                <Dropdown align="end" className="ms-auto">
                                                    <Dropdown.Toggle
                                                        as="button"
                                                        style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            color: "#333",
                                                            fontSize: 22,
                                                            lineHeight: 1,
                                                            padding: 0,
                                                            marginLeft: 8,
                                                        }}
                                                        aria-label="Hành động"
                                                    >
                                                        <FaEllipsisV />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleShowEdit(blog)}>
                                                            <FaEdit className="me-2" />
                                                            Chỉnh sửa
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDeleteBlog(blog.blogId)}
                                                            className="text-danger"
                                                        >
                                                            <FaTrash className="me-2" />
                                                            Xóa
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
                                        </div>
                                        <div style={{ color: "#444", marginBottom: 5, fontSize: 17 }}>
                                            <strong>{blog.title}</strong>
                                        </div>
                                        <div style={{ color: "#444", marginBottom: 5, fontSize: 17 }}>
                                            {blog.content}
                                        </div>
                                        {blog.imageUrl && (
                                            <div className="mb-2 text-center">
                                                <img
                                                    src={blog.imageUrl}
                                                    alt="blog"
                                                    style={{
                                                        maxHeight: 230,
                                                        maxWidth: "100%",
                                                        borderRadius: 10,
                                                        margin: "0 auto",
                                                        display: "block",
                                                        background: "#fff",
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="small text-muted mb-2">
                                            {/* {blog.categoryName && <>Chuyên mục: <b>{blog.categoryName}</b> | </>}
                                            {blog.blogType && <>{blog.blogType}</>} */}
                                        </div>
                                    </Card.Body>
                                    {/* Footer: Like và Báo cáo nằm cùng hàng */}
                                    <Card.Footer
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            paddingBottom: 12,
                                            paddingTop: 2,
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-3 justify-content-between">
                                            {/* Like/Unlike */}
                                            <div className="d-flex align-items-center gap-2">
                                                <Button
                                                    variant="link"
                                                    className="p-0 d-flex align-items-center"
                                                    style={{ color: blog.liked ? "#e25565" : "#666" }}
                                                    onClick={() => handleToggleLike(blog.blogId)}
                                                >
                                                    {blog.liked ? (
                                                        <FaHeart size={22} />
                                                    ) : (
                                                        <FaRegHeart size={22} />
                                                    )}
                                                </Button>
                                                <span style={{ fontSize: 16, color: "#666" }}>
                                                    {(blog.likes || 0)} lượt
                                                </span>
                                            </div>
                                            {/* Báo cáo */}
                                            {blog.authorName !== CURRENT_USER ? (
                                                <span
                                                    style={{
                                                        color: blog.reported ? "#e25565" : "#555",
                                                        fontStyle: "italic",
                                                        fontSize: 15,
                                                        cursor: blog.reported ? "not-allowed" : "pointer",
                                                    }}
                                                    onClick={
                                                        blog.reported
                                                            ? undefined
                                                            : () => handleSendReport(blog) // gọi trực tiếp, không show modal nữa
                                                    }
                                                >
                                                    <FaFlag className="me-1" />
                                                    {blog.reported ? "Đã báo cáo" : "Báo cáo"}
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "#999",
                                                        fontStyle: "italic",
                                                        fontSize: 15,
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    Báo cáo
                                                </span>
                                            )}
                                        </div>
                                    </Card.Footer>
                                </Card>
                            ))
                        )}
                    </Col>
                </Row>

                {/* Modal chỉnh sửa bài viết */}
                <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chỉnh sửa bài viết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Hình ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    ref={fileEditInputRef}
                                    onChange={(e) =>
                                        handleFileChange(e, setEditImage, setEditImagePreview)
                                    }
                                />
                                {editImagePreview && (
                                    <img
                                        src={editImagePreview}
                                        alt="preview"
                                        style={{ maxWidth: "100%", marginTop: 10, borderRadius: 8 }}
                                    />
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEdit(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleSaveEdit}>
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal tạo bài viết mới */}
                <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chia sẻ bài viết mới</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mt-2">
                                <Form.Label>Hình ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) =>
                                        handleFileChange(e, setNewImage, setNewImagePreview)
                                    }
                                />
                                {newImagePreview && (
                                    <img
                                        src={newImagePreview}
                                        alt="preview"
                                        style={{ maxWidth: "100%", marginTop: 10, borderRadius: 8 }}
                                    />
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCreate(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSaveCreate}
                            disabled={!newTitle.trim() || !newContent.trim()}
                        >
                            Đăng bài
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal báo cáo */}
                <Modal
                    show={showReportModal}
                    onHide={() => setShowReportModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Báo cáo bài viết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Lý do báo cáo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowReportModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleSendReport}
                            disabled={!reportingBlog || !reportingBlog.blogId}
                        >
                            Gửi báo cáo
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default UserBlog;