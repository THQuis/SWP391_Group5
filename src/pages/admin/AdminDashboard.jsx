import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Row, Col, Card } from 'react-bootstrap';
import ProgressPieChart from '../../components/Chart/ProgressPieChart';
import FeedbackBarChart from '../../components/Chart/FeedbackBarChart';
import RevenueLineChart from '../../components/Chart/RevenueLineChart';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <Row className="mb-4">

                <Col><Card body><strong>Member</strong><br /><strong>255</strong></Card></Col>
                <Col><Card body><strong>Coach</strong><br /><strong>25</strong></Card></Col>
                <Col><Card body><strong>Tổng doanh thu </strong><br /><strong>10.000</strong></Card></Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card body>
                        <h5>Tiến trình của member</h5>
                        <ProgressPieChart />
                    </Card>
                </Col>

            </Row>

            <Row className="mb-4">
                <Col>
                    <Card body>
                        <h5>Đánh giá</h5>
                        <FeedbackBarChart />
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col><Card body><strong>Thông báo chấp thuận</strong><br />54</Card></Col>
                <Col><Card body><strong>Lượt tư vấn đang diễn ra </strong><br />27</Card></Col>
                <Col><Card body><strong>Lượt tư vấn đã đăng ký </strong><br></br>255</Card></Col>
            </Row>

            <Row>
                <Col>
                    <Card body>
                        <h5>Doanh thu theo tháng</h5>
                        <RevenueLineChart />
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default AdminDashboard;