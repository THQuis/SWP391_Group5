import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

function PendingBlogTab({ reloadBlogList }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm gọi API để lấy danh sách blog đang chờ duyệt
    const fetchPendingBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/BlogAdmin/pending', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch pending blogs");
            const data = await res.json();
            setBlogs(data);
        } catch (e) {
            console.error(e);
            setBlogs([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingBlogs();
    }, []);

    // Hàm xử lý khi duyệt bài viết
    const handleApprove = async (blogId) => {
        if (window.confirm("Bạn có chắc chắn muốn duyệt bài viết này?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/approve/${blogId}`, {
                    method: 'PUT', // Hoặc POST tùy vào thiết kế API của bạn
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();
                alert("Bài viết đã được duyệt thành công.");
                // Xóa bài viết khỏi danh sách chờ duyệt trên UI
                setBlogs(blogs.filter(b => b.blogId !== blogId));
                // Tải lại danh sách chính ở tab "View"
                if (reloadBlogList) reloadBlogList();
            } catch {
                alert("Duyệt bài viết thất bại!");
            }
        }
    };

    // Hàm xử lý khi từ chối bài viết
    const handleReject = async (blogId) => {
        if (window.confirm("Bạn có chắc chắn muốn từ chối bài viết này?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/reject/${blogId}`, {
                    method: 'PUT', // Hoặc POST tùy vào thiết kế API của bạn
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();
                alert("Bài viết đã bị từ chối.");
                setBlogs(blogs.filter(b => b.blogId !== blogId));
                if (reloadBlogList) reloadBlogList();
            } catch {
                alert("Từ chối bài viết thất bại!");
            }
        }
    };

    return (
        <div>
            <h5 className="mb-3">Danh sách bài viết chờ duyệt</h5>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        <th>Tác giả</th>
                        <th>Ngày tạo</th>
                        <th className="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center">Đang tải...</td>
                        </tr>
                    ) : blogs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-secondary">Không có bài viết nào cần duyệt.</td>
                        </tr>
                    ) : (
                        blogs.map((blog, idx) => (
                            <tr key={blog.blogId}>
                                <td>{idx + 1}</td>
                                <td>{blog.title}</td>
                                <td>{blog.authorName}</td>
                                <td>{new Date(blog.createdDate).toLocaleDateString('vi-VN')}</td>
                                <td className="text-center">
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleApprove(blog.blogId)}>
                                        <FaCheck /> Duyệt
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleReject(blog.blogId)}>
                                        <FaTimes /> Từ chối
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default PendingBlogTab;