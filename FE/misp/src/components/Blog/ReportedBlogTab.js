import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

function ReportedBlogTab({ reloadBlogList }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch reported blogs
    // Fetch reported blogs
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('/api/BlogAdmin/reported', {
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

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Approve or reject
    const handleApprove = async (blogId) => {
        if (window.confirm("Duyệt bài viết này?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/approve/${blogId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();
                alert("Blog đã được duyệt.");
                setBlogs(blogs.filter(b => b.blogId !== blogId));
                if (reloadBlogList) reloadBlogList();
            } catch {
                alert("Duyệt blog thất bại!");
            }
        }
    };

    const handleReject = async (blogId) => {
        if (window.confirm("Từ chối bài viết này?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/reject/${blogId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();
                alert("Blog đã bị từ chối.");
                setBlogs(blogs.filter(b => b.blogId !== blogId));
                if (reloadBlogList) reloadBlogList();
            } catch {
                alert("Từ chối blog thất bại!");
            }
        }
    };

    return (
        <div>
            <h5 className="mb-3">Duyệt bài viết bị báo cáo</h5>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        {/* <th>Nội dung</th> */}
                        <th>Bị báo cáo</th>
                        <th>Tác giả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="text-center">Đang tải...</td>
                        </tr>
                    ) : blogs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-secondary">Không có bài viết nào bị báo cáo.</td>
                        </tr>
                    ) : (
                        blogs.map((blog, idx) => (
                            <tr key={blog.blogId}>
                                <td>{idx + 1}</td>
                                <td>{blog.title}</td>
                                {/* <td style={{ maxWidth: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {blog.content}
                                </td> */}
                                <td>
                                    {blog.reportCount > 0 ? `Bị báo cáo (${blog.reportCount})` : ""}
                                </td>
                                <td>{blog.authorName}</td>
                                <td>
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

export default ReportedBlogTab;