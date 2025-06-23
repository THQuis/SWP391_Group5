import React, { useState, useEffect, useCallback } from 'react';
import { FaFire, FaSmoking, FaLeaf, FaPiggyBank } from "react-icons/fa";
import { Container, Row, Col, Card, Spinner, Button, Modal, Form, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // THÊM MỚI: Import toast
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/ProgressDashboard.scss';
const ProgressDashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showRelapseModal, setShowRelapseModal] = useState(false);
    const [relapseCount, setRelapseCount] = useState(1);
    const [progress, setProgress] = useState(null);
    const [progressHistory, setProgressHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [expandedDate, setExpandedDate] = useState(null);

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const memberPackage = localStorage.getItem('memberPackage'); // Sẽ là "Premium" hoặc "Basic"

    // Đưa fetch logic ra ngoài useEffect để tái sử dụng sau khi cập nhật relapse
    const fetchProgressData = useCallback(async () => {
        try {
            const response = await fetch(`/api/AchievementAndProgress/user/ProgressInformation?userId=${userId}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("userToken"),
                    "accept": "*/*"
                }
            });
            if (!response.ok) {
                // Nếu API trả về lỗi (ví dụ user chưa có plan), không cần báo lỗi mà chỉ cần set progress là null
                setProgress(null);
                return;
            }
            const data = await response.json();
            setProgress({
                achievementsUnlocked: data.totalAchievements,
                cigarettesAvoided: data.totalCigarettesDropped,
                moneySaved: data.totalMoneySaved,
                daysSinceStart: data.totalProgressDays
            });
        } catch (error) {
            console.error("Failed to fetch progress data:", error);
            setProgress(null);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const fetchProgressHistory = useCallback(async () => {
        try {
            const response = await fetch(`/api/AchievementAndProgress/user/showAllProgress?userId=${userId}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("userToken"),
                    "accept": "*/*"
                }
            });
            const data = await response.json();
            // Flatten all progressList from all plans and sort by date descending
            const allProgress = data
                .flatMap(plan => plan.progressList || [])
                .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate));
            setProgressHistory(allProgress);
        } catch (error) {
            console.error("Failed to fetch progress history:", error);
            setProgressHistory([]);
        }
    }, [userId]);

    // useEffect chỉ gọi khi userId đổi
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchProgressData(), fetchProgressHistory()]);
        const interval = setInterval(fetchProgressData, 3600000); // Refresh every 1 hour
        return () => clearInterval(interval);
    }, [userId, fetchProgressData, fetchProgressHistory]);

    const navigateToCreatePlan = () => {
        navigate('/User/quitplan');
    };

    const handleShowRelapseModal = () => setShowRelapseModal(true);
    const handleCloseRelapseModal = () => setShowRelapseModal(false);

    const handleLogRelapse = async () => {
        try {
            const response = await fetch(`/api/AchievementAndProgress/user/UpdateProgress?userId=${userId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("userToken")
                },
                body: JSON.stringify({
                    cigarettesSmokedToday: relapseCount
                })
            });

            if (response.ok) {
                toast.info(`Cảm ơn bạn đã ghi nhận. Đừng nản lòng, hãy tiếp tục cố gắng nhé! Đã ghi nhận: ${relapseCount} điếu hôm nay.`);

                setIsLoading(true); // Hiển thị loading trong khi tải lại dữ liệu
                await Promise.all([fetchProgressData(), fetchProgressHistory()]);
            } else {
                const errorMessage = await response.text();
                toast.error(`Không thể ghi nhận: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Failed to log relapse:", error);
            toast.error("Đã xảy ra lỗi khi ghi nhận. Vui lòng thử lại sau.");
        } finally {
            handleCloseRelapseModal();
        }
    };


    // THÊM MỚI: Hàm để đánh dấu các ngày có sai sót trên lịch
    const handleDayClick = (date) => {
        const dateString = date.toISOString();
        // Nếu nhấn vào ô đang mở, thì đóng lại. Ngược lại, mở ô mới.
        if (expandedDate === dateString) {
            setExpandedDate(null);
        } else {
            setExpandedDate(dateString);
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().slice(0, 10);
            const historyEntry = progressHistory.find(entry => entry.progressDate.slice(0, 10) === dateString);

            // Kiểm tra xem ô này có đang được mở rộng không
            const isExpanded = expandedDate === date.toISOString();

            // Nếu đang mở rộng và có dữ liệu, hiển thị chi tiết
            if (isExpanded && historyEntry) {
                return (
                    <div className="expanded-content">
                        <div className="expanded-item">
                            <FaSmoking color="#e53e3e" />
                            <span>Đã hút: <strong>{historyEntry.cigarettesSmokedToday || 0} điếu</strong></span>
                        </div>
                        <div className="expanded-item">
                            <FaLeaf color="#28a745" />
                            <span>Bỏ được: <strong>{historyEntry.cigarettesDropped || 0} điếu</strong></span>
                        </div>
                        <div className="expanded-item">
                            <FaPiggyBank color="#f7b801" />
                            <span>Tiết kiệm: <strong>{historyEntry.moneySaved ? historyEntry.moneySaved.toLocaleString('vi-VN') : 0} đ</strong></span>
                        </div>
                    </div>
                );
            }

            // Nếu không mở rộng, chỉ hiển thị icon nếu có sai sót
            if (historyEntry && historyEntry.cigarettesSmokedToday > 0) {
                const renderTooltip = (props) => (
                    <Tooltip id={`tooltip-${dateString}`} {...props} className="calendar-tooltip">
                        Đã hút: {historyEntry.cigarettesSmokedToday} điếu
                    </Tooltip>
                );

                return (
                    <OverlayTrigger placement="top" overlay={renderTooltip}>
                        <div className="relapse-indicator">
                            <FaFire color="#e53e3e" />
                        </div>
                    </OverlayTrigger>
                );
            }
        }
        return <div style={{ height: '24px' }}></div>; // Giữ chỗ để các ô không bị nhảy layout
    };
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const classNames = [];
            // Thêm class nếu là ô đang mở rộng
            if (expandedDate === date.toISOString()) {
                classNames.push('expanded-tile');
            }
            return classNames.join(' ');
        }
        return null;
    }


    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải tiến trình của bạn...</h4>
            </Container>
        );
    }

    if (!progress) {
        return (
            <div className="no-plan-container">
                <Card className="no-plan-card">
                    <Card.Body className="text-center">
                        <div className="no-plan-icon">📋</div>
                        <h4 className="no-plan-title">Bạn chưa có kế hoạch nào</h4>
                        <p className="no-plan-text">Hãy tạo một kế hoạch để bắt đầu hành trình của bạn!</p>
                        <Button className="create-plan-btn" onClick={navigateToCreatePlan}>Tạo kế hoạch mới</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <Container className="dashboard-content">
                {/* Main Progress Card */}
                <Card className="main-progress-card">
                    <Card.Body>
                        <div className="progress-card-content">
                            <h2 className="progress-subtitle">Ngừng hút thuốc được</h2>
                            {/* Main Circle */}
                            <div className="main-circle-container">
                                <div className="main-circle">
                                    <div className="circle-inner">
                                        <div className="days-number">{progress.daysSinceStart}</div>
                                        <div className="days-label">NGÀY</div>
                                    </div>
                                    <div className="circle-glow"></div>
                                </div>
                            </div>
                            {/* Achievement Stats */}
                            <Row className="achievement-stats">
                                <Col xs={4}>
                                    <div className="stat-card">
                                        <div className="stat-icon">🏆</div>
                                        <div className="stat-value">{progress.achievementsUnlocked}</div>
                                        <div className="stat-label">Thành tích</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="stat-card">
                                        <div className="stat-icon">🚭</div>
                                        <div className="stat-value">{progress.cigarettesAvoided}</div>
                                        <div className="stat-label">Điếu đã bỏ</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="stat-card">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-value">{progress.moneySaved.toLocaleString('vi-VN')} đ</div>
                                        <div className="stat-label">Tiền tiết kiệm</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
                {/* Action Button */}
                <div className="action-button-container">
                    <Button
                        variant="outline-secondary"
                        className="relapse-button"
                        onClick={() => {
                            if (memberPackage === 'Basic') {
                                navigate('/User/package'); // Trang mua gói của bạn 
                            } else {
                                setShowRelapseModal(true);
                            }
                        }}
                    >
                        <span className="button-icon">😔</span>
                        Tôi đã lỡ hút thuốc hôm nay...
                    </Button>
                </div>
                {/* History Section */}
                <div className="history-table-section" style={{ marginTop: 32, textAlign: 'center' }}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (memberPackage === 'Basic') {
                                navigate('/User/package'); // Trang mua gói của bạn (
                            } else {
                                setShowCalendarModal(true);
                            }
                        }}
                        style={{ marginBottom: 12 }}
                    >
                        Xem nhật ký trên lịch
                    </Button>
                </div>
            </Container>
            {/* Relapse Modal */}
            <Modal
                show={showRelapseModal}
                onHide={handleCloseRelapseModal}
                centered
                className="relapse-modal"
            >
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title>Một chút chệch hướng?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-icon-container">
                        <div className="modal-icon">🤗</div>
                    </div>
                    <p className="modal-description">
                        Không sao cả, đây là một phần của quá trình. Việc ghi nhận lại sẽ giúp hệ thống tính toán chính xác hơn.
                    </p>
                    <Form.Group>
                        <Form.Label className="modal-form-label">Hôm nay bạn đã hút bao nhiêu điếu?</Form.Label>
                        <Form.Control
                            type="number"
                            value={relapseCount}
                            onChange={(e) => setRelapseCount(parseInt(e.target.value) || 1)}
                            min="1"
                            className="modal-form-input"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                    <Button variant="outline-secondary" onClick={handleCloseRelapseModal} className="modal-btn-cancel">
                        Hủy
                    </Button>
                    <Button variant="success" onClick={handleLogRelapse} className="modal-btn-confirm">
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* THÊM MỚI: Modal hiển thị lịch */}
            <Modal show={showCalendarModal} onHide={() => setShowCalendarModal(false)} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Nhật ký Tiến trình</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center calendar-modal-body">
                    <Calendar
                        tileContent={tileContent}
                        tileClassName={tileClassName}
                        onClickDay={handleDayClick}
                        locale="vi-VN"
                        selectRange={false}
                        value={null}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex align-items-center">
                        <FaFire color="#e53e3e" className="me-2" />
                        <span>= Ngày có ghi nhận hút thuốc</span>
                    </div>
                    <Button variant="secondary" onClick={() => setShowCalendarModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProgressDashboardPage;