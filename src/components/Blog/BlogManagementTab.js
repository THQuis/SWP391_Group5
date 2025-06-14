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
                        <th>Nội dung</th>
                        <th>Chuyên mục</th>
                        <th>Loại blog</th>
                        <th>Tác giả</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Likes</th>
                        <th>Báo cáo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={12} className="text-center">Đang tải...</td>
                        </tr>
                    ) : blogs.length === 0 ? (
                        <tr>
                            <td colSpan={12} className="text-center text-secondary">Không có bài viết nào.</td>
                        </tr>
                    ) : (
                        blogs.map((blog, idx) => (
                            <tr key={blog.blogId}>
                                <td>{idx + 1}</td>
                                <td>{blog.title}</td>
                                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{blog.content}</td>
                                <td>{blog.categoryName}</td>
                                <td>{blog.blogType}</td>
                                <td>{blog.authorName}</td>
                                <td>{blog.status}</td>
                                <td>{blog.createdDate?.split("T")[0]}</td>
                                <td>{blog.likes}</td>
                                <td>{blog.reportCount > 0 ? `Bị báo cáo (${blog.reportCount})` : ""}</td>
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