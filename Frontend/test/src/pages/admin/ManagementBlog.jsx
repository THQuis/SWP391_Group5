import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, Button, Form, InputGroup, FormControl, Pagination, Modal
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PAGE_SIZE = 5;
const CATEGORY_OPTIONS = ['Sức khỏe', 'Thể thao', 'Đời sống', 'Thức ăn', 'Giải trí'];
const STATUS_OPTIONS = ['Đang hoạt động ', 'Ngừng hoạt động'];

const ManagementBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // State cho Edit Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        // Giả lập dữ liệu blog
        const fetchData = async () => {
            const fakeBlogs = Array.from({ length: 10 }).map((_, idx) => ({
                BlogId: idx + 1,
                Title: `Blog ${idx + 1}`,
                Content: `Đây là nội dung blog số ${idx + 1}`,
                AuthorId: (idx % 5) + 1,
                Author: `Tác giả ${idx % 5 + 1}`,
                CategoryName: idx % 2 === 0 ? 'Sức khỏe' : 'Thể thao',
                CreatedDate: `2025-06-${(idx % 28) + 1}`,
                Status: idx % 3 === 0 ? 'Pending' : (idx % 2 === 0 ? 'Published' : 'Draft'),
                Likes: Math.floor(Math.random() * 100),
                Image: 'https://via.placeholder.com/50',
                Reported: idx % 7 === 0,
            }));

            let filtered = fakeBlogs;
            if (searchTerm.trim()) {
                filtered = filtered.filter(b =>
                    b.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.Content.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
            setBlogs(filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE));
        };

        fetchData();
    }, [searchTerm, currentPage]);

    const handleDelete = (blogId) => {
        setBlogs(blogs.filter(blog => blog.BlogId !== blogId));
    };

    const handleEdit = (blog) => {
        setSelectedBlog({ ...blog }); // clone to avoid direct state mutation
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setBlogs(blogs.map(b => b.BlogId === selectedBlog.BlogId ? selectedBlog : b));
        setShowEditModal(false);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Xử lý chọn ảnh từ máy
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSelectedBlog({ ...selectedBlog, Image: ev.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container>
            <h2 className="text-center text-success"> Quản lý Blog </h2>
            {/* Search */}
            <Row className="mb-3">
                <Col>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <FormControl
                                placeholder="Tìm kiếm tiêu đề hoặc nội dung blog"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                autoComplete="off"
                            />
                            <Button variant="outline-secondary" type="submit">Tìm kiếm</Button>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>Nội dung</th>
                                <th>Tác giả</th>
                                <th>Loại blog</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Lượt thích</th>
                                <th>Ảnh</th>
                                <th>Báo cáo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center text-secondary">
                                        Không có bài viết nào.
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.BlogId}>
                                        <td>{blog.Title}</td>
                                        <td style={{
                                            maxWidth: 200,
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden'
                                        }}>
                                            {blog.Content}
                                        </td>
                                        <td>{blog.Author}</td>
                                        <td>{blog.CategoryName}</td>
                                        <td>{blog.CreatedDate}</td>
                                        <td>{blog.Status}</td>
                                        <td>{blog.Likes}</td>
                                        <td>
                                            <img src={blog.Image} alt="Post" width="30" style={{ marginRight: 4 }} />
                                            Post
                                        </td>
                                        <td>{blog.Reported ? 'Bị báo cáo' : ''}</td>
                                        <td>
                                            <Button variant="link" size="sm" onClick={() => handleEdit(blog)} className="me-2" title="Sửa">
                                                <FaEdit />
                                            </Button>
                                            <Button variant="link" size="sm" onClick={() => handleDelete(blog.BlogId)} title="Xóa">
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
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
                </Col>
            </Row>

            {/* Modal Edit - chỉnh sửa được tất cả trường, Ảnh chỉ chọn file, tác giả không chỉnh sửa */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBlog && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedBlog.Title}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, Title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedBlog.Content}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, Content: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tác giả</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedBlog.Author}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Loại blog</Form.Label>
                                <Form.Select
                                    value={selectedBlog.CategoryName}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, CategoryName: e.target.value })}
                                >
                                    {CATEGORY_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày tạo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedBlog.CreatedDate}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, CreatedDate: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select
                                    value={selectedBlog.Status}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, Status: e.target.value })}
                                >
                                    {STATUS_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Lượt thích</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedBlog.Likes}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, Likes: Number(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    className="mt-2"
                                    onChange={handleImageChange}
                                />
                                <div className="mt-2">
                                    {selectedBlog.Image && (
                                        <img src={selectedBlog.Image} alt="Post" width="80" />
                                    )}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Báo cáo</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Bị báo cáo"
                                    checked={selectedBlog.Reported}
                                    onChange={e => setSelectedBlog({ ...selectedBlog, Reported: e.target.checked })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ManagementBlog;