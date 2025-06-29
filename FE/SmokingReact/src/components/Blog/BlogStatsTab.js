import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

function BlogStatsTab() {
    const [stats, setStats] = useState(null);
    const [reportedBlogs, setReportedBlogs] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingReported, setLoadingReported] = useState(true);

    // Lấy thống kê tổng quan
    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch('/api/BlogAdmin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setStats(data);
            } catch {
                setStats(null);
            }
            setLoadingStats(false);
        };
        fetchStats();
    }, []);

    // Lấy danh sách bài bị báo cáo để xử lý (có thể reuse API reported tab)
    useEffect(() => {
        const fetchReported = async () => {
            setLoadingReported(true);
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch('/api/BlogAdmin/reported', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setReportedBlogs(data);
            } catch {
                setReportedBlogs([]);
            }
            setLoadingReported(false);
        };
        fetchReported();
    }, []);

    // Đánh dấu đã xử lý báo cáo
    const handleReviewed = async (blogId) => {
        if (window.confirm("Đánh dấu bài viết đã xử lý báo cáo?")) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch(`/api/BlogAdmin/reviewed/${blogId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error();
                alert("Đã đánh dấu bài viết đã xử lý báo cáo.");
                setReportedBlogs(reportedBlogs.filter(b => b.blogId !== blogId));
            } catch {
                alert("Đánh dấu thất bại!");
            }
        }
    };

    return (
        <div>
            <h5 className="mb-3">Thống kê Blog</h5>
            <Row className="mb-4">
                <Col md={4}>
                    <Card bg="info" text="white" className="mb-2">
                        <Card.Body>
                            <Card.Title>Tổng số bài viết</Card.Title>
                            <Card.Text style={{ fontSize: 32, fontWeight: 700 }}>
                                {loadingStats ? "..." : stats?.totalBlogs ?? 0}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card bg="secondary" text="white" className="mb-2">
                        <Card.Body>
                            <Card.Title>Chờ duyệt</Card.Title>
                            <Card.Text style={{ fontSize: 32, fontWeight: 700 }}>
                                {loadingStats ? "..." : stats?.pendingBlogs ?? 0}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card bg="danger" text="white" className="mb-2">
                        <Card.Body>
                            <Card.Title>Bị báo cáo</Card.Title>
                            <Card.Text style={{ fontSize: 32, fontWeight: 700 }}>
                                {loadingStats ? "..." : stats?.reportedBlogs ?? 0}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h6 className="mb-3">Danh sách bài viết bị báo cáo cần xử lý</h6>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Bị báo cáo</th>
                        <th>Tác giả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {loadingReported ? (
                        <tr>
                            <td colSpan={6} className="text-center">Đang tải...</td>
                        </tr>
                    ) : reportedBlogs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-secondary">Không có bài viết nào bị báo cáo.</td>
                        </tr>
                    ) : (
                        reportedBlogs.map((blog, idx) => (
                            <tr key={blog.blogId}>
                                <td>{idx + 1}</td>
                                <td>{blog.title}</td>
                                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {blog.content}
                                </td>
                                <td>{blog.reportCount > 0 ? `Bị báo cáo (${blog.reportCount})` : ""}</td>
                                <td>{blog.authorName}</td>
                                <td>
                                    <Button variant="success" size="sm" onClick={() => handleReviewed(blog.blogId)}>
                                        <FaCheckCircle /> Đã xử lý
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

export default BlogStatsTab;