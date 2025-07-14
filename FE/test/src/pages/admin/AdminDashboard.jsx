import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import ProgressPieChart from '../../components/Chart/ProgressPieChart';
import FeedbackBarChart from '../../components/Chart/FeedbackBarChart';
import RevenueLineChart from '../../components/Chart/RevenueLineChart';
import '../../styles/AdminDashboard.scss';


const AdminDashboard = () => {
    const [stats, setStats] = useState({
        memberCount: 0,
        coachCount: 0,
        revenue: 0,
        acceptedNotifications: 0,
        activeConsultations: 0,
        totalConsultations: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lấy token từ localStorage
                const token = localStorage.getItem("userToken");

                if (!token) {
                    setError("Không tìm thấy token xác thực");
                    setLoading(false);
                    return;
                }

                // Gọi API để lấy số lượng user và coach
                const userCountRes = await fetch('/api/Admin/user-counts', {
                    method: 'GET',
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userCountRes.ok) {
                    const userCountData = await userCountRes.json();
                    setStats(prevStats => ({
                        ...prevStats,
                        memberCount: userCountData.memberCount,
                        coachCount: userCountData.coachCount,
                    }));
                } else {
                    setError(`Lỗi API: ${userCountRes.status} - ${userCountRes.statusText}`);
                }

                // Có thể thêm các API khác để lấy thông tin khác
                // const revenueRes = await fetch('/api/admin/revenue', { headers: ... });
                // const notificationRes = await fetch('/api/admin/notifications', { headers: ... });

            } catch (err) {
                console.error('Lỗi khi tải thống kê:', err);
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            {error && (
                <Alert variant="danger" className="mb-3">
                    <strong>Lỗi:</strong> {error}
                </Alert>
            )}

            {/* Hàng ngang 3 thông số */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="label">Member</div>
                    <div className="value">
                        {loading ? '...' : stats.memberCount}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="label">Coach</div>
                    <div className="value">
                        {loading ? '...' : stats.coachCount}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="label">Tổng doanh thu</div>
                    <div className="value">
                        {loading ? '...' : `${stats.revenue.toLocaleString()} đ`}
                    </div>
                </div>
            </div>
            <br></br>

            <Row className="mb-4">
                <Col md={6}>
                    <Card body>
                        <h3>Tiến trình của member</h3>
                        <ProgressPieChart />
                    </Card>
                </Col>
            </Row>
            <br></br>

            <Row className="mb-4">
                <Col>
                    <Card body>
                        <h3>Đánh giá</h3>
                        <FeedbackBarChart />
                    </Card>
                </Col>
            </Row>
            <br></br>


            <div className="stats-row">
                <div className="stat-card">
                    <div className="label">Thông báo chấp thuận</div>
                    <div className="value">
                        {loading ? '...' : stats.acceptedNotifications}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="label">Lượt tư vấn đang diễn ra</div>
                    <div className="value">
                        {loading ? '...' : stats.activeConsultations}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="label">Lượt tư vấn đã đăng ký</div>
                    <div className="value">
                        {loading ? '...' : stats.totalConsultations}
                    </div>
                </div>
            </div>

            <br></br>

            <Row>
                <Col>
                    <Card body>
                        <h3>Doanh thu theo tháng</h3>
                        <RevenueLineChart />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
