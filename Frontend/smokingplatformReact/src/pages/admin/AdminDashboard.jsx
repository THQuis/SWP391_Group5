import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import ProgressPieChart from '../../components/Chart/ProgressPieChart';
import FeedbackBarChart from '../../components/Chart/FeedbackBarChart';
import RevenueLineChart from '../../components/Chart/RevenueLineChart';
import '../../pages/admin/AdminDashboard.scss';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        memberCount: 0,
        coachCount: 0,
        revenue: 0,
        acceptedNotifications: 0,
        activeConsultations: 0,
        totalConsultations: 0,
    });


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats'); // gọi API
                const data = await res.json();
                setStats({
                    memberCount: data.memberCount,
                    coachCount: data.coachCount,
                    revenue: data.totalRevenue,
                    acceptedNotifications: data.acceptedNotifications,
                    activeConsultations: data.activeConsultations,
                    totalConsultations: data.totalConsultations,
                });

            } catch (err) {
                console.error('Lỗi khi tải thống kê:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2 className="text-center text-success">Dashboard </h2>
            {/* Hàng ngang 3 thông số */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="label">Member</div>
                    <div className="value">{stats.memberCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Coach</div>
                    <div className="value">{stats.coachCount}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Tổng doanh thu</div>
                    <div className="value">{stats.revenue.toLocaleString()} đ</div>
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
                    <div className="value">{stats.acceptedNotifications}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Lượt tư vấn đang diễn ra</div>
                    <div className="value">{stats.activeConsultations}</div>
                </div>
                <div className="stat-card">
                    <div className="label">Lượt tư vấn đã đăng ký</div>
                    <div className="value">{stats.totalConsultations}</div>
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
