import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Modal, Form } from 'react-bootstrap';

// --- GIẢ LẬP API ---
// API GET /api/quit-plans/current giờ đây sẽ trả về các chỉ số đã được Backend tự động tính toán
const mockAutomatedProgress = {
    // Thông tin từ bảng QuitPlan
    planId: 123,
    startDate: '2025-06-06', // Bắt đầu từ 10 ngày trước

    // Các chỉ số được Backend TỰ ĐỘNG TÍNH TOÁN
    // Giả sử người dùng khai báo hút 5 điếu/ngày và giá 2000đ/điếu
    daysSinceStart: 10,
    cigarettesAvoided: 50, // 10 ngày * 5 điếu/ngày
    moneySaved: 100000, // 50 điếu * 2000đ/điếu
    achievementsUnlocked: 4, // Đạt mốc 1 ngày, 3 ngày, 7 ngày, 50 điếu...
};

const ProgressDashboardPage = () => {
    const [progress, setProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // State cho Modal ghi nhận sai sót
    const [showRelapseModal, setShowRelapseModal] = useState(false);
    const [relapseCount, setRelapseCount] = useState(1);

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            setProgress(mockAutomatedProgress);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleShowRelapseModal = () => setShowRelapseModal(true);
    const handleCloseRelapseModal = () => setShowRelapseModal(false);

    const handleLogRelapse = () => {
        // Trong thực tế, bạn sẽ gửi một request POST đến Backend
        // POST /api/quit-progress
        // Body: { quitPlanId: progress.planId, progressDate: "HÔM NAY", cigarettesSmoked: relapseCount }
        console.log(`GHI NHẬN SAI SÓT: Gửi lên Backend thông tin đã hút ${relapseCount} điếu hôm nay.`);

        // Sau khi thành công, Backend sẽ tính toán lại và bạn có thể gọi lại API để làm mới dữ liệu
        alert("Cảm ơn bạn đã ghi nhận. Đừng nản lòng, hãy tiếp tục cố gắng nhé!");
        handleCloseRelapseModal();
    };

    if (isLoading) {
        return (
            <Container className="text-center my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải tiến trình của bạn...</h4>
            </Container>
        );
    }

    if (!progress) {
        return (
            <Container className="text-center my-5">
                <h4>Bạn chưa có kế hoạch nào.</h4>
                <p>Hãy tạo một kế hoạch để bắt đầu hành trình của bạn!</p>
            </Container>
        );
    }

    return (
        <>
            <Container className="my-5">
                <Card className="text-center shadow-lg" style={{ backgroundColor: '#2d3a3a', color: 'white', borderRadius: '20px' }}>
                    <Card.Body className="p-sm-5 p-4">
                        <h4 className="text-white-50 mb-4">Ngừng hút thuốc được</h4>

                        <div className="d-flex justify-content-center align-items-center mb-5">
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                border: '5px solid #4caf50',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}>
                                <h1 className="display-3 fw-bold m-0">{progress.daysSinceStart}</h1>
                                <p className="m-0">NGÀY</p>
                            </div>
                        </div>

                        <Row>
                            <Col xs={4}>
                                <div className="mb-3 fs-3">🏆</div>
                                <h3 className="fw-bold">{progress.achievementsUnlocked}</h3>
                                <p className="text-white-50 small">Thành tích</p>
                            </Col>
                            <Col xs={4}>
                                <div className="mb-3 fs-3">🚭</div>
                                <h3 className="fw-bold">{progress.cigarettesAvoided}</h3>
                                <p className="text-white-50 small">Điếu đã bỏ</p>
                            </Col>
                            <Col xs={4}>
                                <div className="mb-3 fs-3">💰</div>
                                <h3 className="fw-bold">{progress.moneySaved.toLocaleString('vi-VN')} đ</h3>
                                <p className="text-white-50 small">Tiền tiết kiệm</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <div className="text-center mt-4">
                    <Button variant="outline-secondary" onClick={handleShowRelapseModal}>
                        Tôi đã lỡ hút thuốc hôm nay...
                    </Button>
                </div>
            </Container>

            {/* Modal để người dùng ghi nhận sai sót */}
            <Modal show={showRelapseModal} onHide={handleCloseRelapseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ghi nhận sai sót</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Không sao cả, đây là một phần của quá trình. Việc ghi nhận lại sẽ giúp hệ thống tính toán chính xác hơn.</p>
                    <Form.Group>
                        <Form.Label>Hôm nay bạn đã hút bao nhiêu điếu?</Form.Label>
                        <Form.Control
                            type="number"
                            value={relapseCount}
                            onChange={(e) => setRelapseCount(parseInt(e.target.value))}
                            min="1"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRelapseModal}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleLogRelapse}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProgressDashboardPage;
