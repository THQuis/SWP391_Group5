import React, { useState, useRef } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Modal,
    InputGroup,
    Dropdown,
} from "react-bootstrap";
import {
    FaUserCircle,
    FaPlus,
    FaHeart,
    FaRegHeart,
    FaEllipsisV,
    FaEdit,
    FaTrash,
    FaFlag,
} from "react-icons/fa";

// User giả lập (để xác định quyền xóa/sửa, báo cáo)
const CURRENT_USER = "Tài khoản của bạn";

// ======= FAKE DATA =======
const FAKE_BLOGS = [
    {
        BlogId: 1,
        AuthorName: "Nguyễn Văn A",
        CreatedDate: "2024-06-12",
        Content: "Mình đã bỏ thuốc được 1 tháng! Mọi người cùng cố gắng nhé!",
        ImageUrl:
            "https://img.freepik.com/free-vector/april-fools-day-background-with-jester-hat_1017-32324.jpg",
        Likes: 30,
        Liked: false,
        Self: true,
        Reported: false,
        Reports: [],
    },
    {
        BlogId: 2,
        AuthorName: "Lê Thị B",
        CreatedDate: "2024-06-10",
        Content: "Bí quyết vượt qua cơn thèm thuốc của mình là uống thật nhiều nước.",
        ImageUrl: "",
        Likes: 10,
        Liked: true,
        Self: false,
        Reported: false,
        Reports: [],
    },
];
// ======= END FAKE DATA =======

function UserBlog() {
    const [blogs, setBlogs] = useState(FAKE_BLOGS);
    const [showEdit, setShowEdit] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editImagePreview, setEditImagePreview] = useState("");
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [newContent, setNewContent] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newImagePreview, setNewImagePreview] = useState("");
    const [reportingBlog, setReportingBlog] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const fileInputRef = useRef();
    const fileEditInputRef = useRef();

    // Tìm kiếm đơn giản
    const filteredBlogs = blogs.filter(
        (b) =>
            b.Content.toLowerCase().includes(search.toLowerCase()) ||
            b.AuthorName.toLowerCase().includes(search.toLowerCase())
    );

    // Like/Unlike bài viết
    const handleToggleLike = (blogId) => {
        setBlogs((prev) =>
            prev.map((b) =>
                b.BlogId === blogId
                    ? {
                        ...b,
                        Liked: !b.Liked,
                        Likes: b.Liked ? b.Likes - 1 : b.Likes + 1,
                    }
                    : b
            )
        );
    };

    // Mở modal chỉnh sửa
    const handleShowEdit = (blog) => {
        setEditingBlog(blog);
        setEditContent(blog.Content);
        setEditImage(blog.ImageUrl || "");
        setEditImagePreview(blog.ImageUrl || "");
        setShowEdit(true);
    };

    // Lưu chỉnh sửa
    const handleSaveEdit = () => {
        setBlogs((prev) =>
            prev.map((b) =>
                b.BlogId === editingBlog.BlogId
                    ? { ...b, Content: editContent, ImageUrl: editImagePreview }
                    : b
            )
        );
        setShowEdit(false);
    };

    // Mở modal tạo bài viết mới
    const handleShowCreate = () => {
        setShowCreate(true);
        setNewContent("");
        setNewImage("");
        setNewImagePreview("");
    };

    // Lưu bài viết mới
    const handleSaveCreate = () => {
        setBlogs([
            {
                BlogId: Date.now(),
                AuthorName: CURRENT_USER,
                CreatedDate: new Date().toISOString().slice(0, 10),
                Content: newContent,
                ImageUrl: newImagePreview,
                Likes: 0,
                Liked: false,
                Self: true,
                Reported: false,
                Reports: [],
            },
            ...blogs,
        ]);
        setShowCreate(false);
    };

    // Xoá bài viết của mình
    const handleDeleteBlog = (blogId) => {
        setBlogs((prev) => prev.filter((b) => b.BlogId !== blogId));
    };

    // Xử lý upload ảnh (biến File thành base64 để preview + lưu)
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

    const handleSendReport = () => {
        setBlogs((prev) =>
            prev.map((b) =>
                b.BlogId === reportingBlog.BlogId
                    ? {
                        ...b,
                        Reports: [
                            ...b.Reports,
                            {
                                user: CURRENT_USER,
                                reason: reportReason,
                                date: new Date().toISOString(),
                            },
                        ],
                        Reported: true,
                    }
                    : b
            )
        );
        setShowReportModal(false);
    };

    return (
        <Container style={{ background: "#f6fcfd", minHeight: 700 }} className="py-3">
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
                    {filteredBlogs.map((blog) => (
                        <Card
                            key={blog.BlogId}
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
                                        {blog.AuthorName}
                                    </span>
                                    <span style={{ color: "#888", marginLeft: 14, fontSize: 15 }}>
                                        {blog.CreatedDate}
                                    </span>
                                    {/* Menu chỉnh sửa bên phải nếu là bài của mình */}
                                    {blog.AuthorName === CURRENT_USER && (
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
                                                    onClick={() => handleDeleteBlog(blog.BlogId)}
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
                                    {blog.Content}
                                </div>
                                {blog.ImageUrl && (
                                    <div className="mb-2 text-center">
                                        <img
                                            src={blog.ImageUrl}
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
                                            style={{ color: blog.Liked ? "#e25565" : "#666" }}
                                            onClick={() => handleToggleLike(blog.BlogId)}
                                        >
                                            {blog.Liked ? (
                                                <FaHeart size={22} />
                                            ) : (
                                                <FaRegHeart size={22} />
                                            )}
                                        </Button>
                                        <span style={{ fontSize: 16, color: "#666" }}>
                                            {blog.Likes} lượt
                                        </span></div>
                                    {/* Báo cáo */}
                                    {blog.AuthorName !== CURRENT_USER ? (
                                        <span
                                            style={{
                                                color: blog.Reported ? "#e25565" : "#555",
                                                fontStyle: "italic",
                                                fontSize: 15,
                                                cursor: blog.Reported ? "not-allowed" : "pointer",
                                            }}
                                            onClick={
                                                blog.Reported
                                                    ? undefined
                                                    : () => handleReport(blog)
                                            }
                                        >
                                            <FaFlag className="me-1" />
                                            {blog.Reported ? "Đã báo cáo" : "Báo cáo"}
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
                    ))}
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
                        disabled={!newContent.trim()}
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
                        disabled={!reportReason.trim()}
                    >
                        Gửi báo cáo
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UserBlog;