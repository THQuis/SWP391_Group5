import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

// Dùng forwardRef để Tab khác gọi reload
const BlogManagementTab = forwardRef((props, ref) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/BlogAdmin/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBlogs(data);
        } catch (e) {
            setBlogs([]);
        }
        setLoading(false);
    };

    // Xử lý xóa blog
    const handleDelete = async (blogId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa blog này?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/delete/${blogId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Lỗi xóa blog");
                alert("Đã xóa blog.");
                // Reload lại danh sách sau khi xoá
                fetchBlogs();
            } catch (err) {
                alert("Xóa blog thất bại!");
            }
        }
    };

    // Expose reload function
    useImperativeHandle(ref, () => ({
        reload: fetchBlogs
    }));

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div>
            <h5 className="mb-3">View</h5>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        <th>Ảnh</th>
                        <th>Tác giả</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Likes</th>
                        <th>Dislikes</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9} className="text-center">Đang tải...</td>
                        </tr>
                    ) : blogs.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center text-secondary">Không có bài viết nào.</td>
                        </tr>
                    ) : (
                        blogs.map((blog, idx) => (
                            <tr key={blog.blogId}>
                                <td>{idx + 1}</td>
                                <td>{blog.title}</td>
                                <td>
                                    {blog.imageUrl && blog.imageUrl.startsWith('data:image') ? (
                                        <img src={blog.imageUrl} alt="blog" style={{ maxWidth: 60, maxHeight: 40, objectFit: 'cover' }} />
                                    ) : null}
                                </td>
                                <td>{blog.authorName}</td>
                                <td>{blog.createdDate ? new Date(blog.createdDate).toLocaleString('vi-VN') : ''}</td>
                                <td>{blog.status}</td>
                                <td>{blog.likes}</td>
                                <td>{blog.dislikes}</td>
                                <td>
                                    <Button variant="link" size="sm" className="me-2"><FaEdit /></Button>
                                    <Button variant="link" size="sm" onClick={() => handleDelete(blog.blogId)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
});

export default BlogManagementTab;