import React, { useState, useEffect } from "react";
import {
    Container, Card, Table, Button, Badge, Spinner, Modal, Row, Col, ListGroup, Alert, Image
} from "react-bootstrap";
import {
    FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTimes,
    FaTasks, FaCalendarAlt, FaTrophy, FaStickyNote, FaImage,
    FaChartLine, FaHistory, FaQuestionCircle, FaSmoking, FaMoneyBillWave,
    FaUserCheck
} from "react-icons/fa";

// Custom styles for enhanced UI
const customStyles = `
    .member-card {
        transition: all 0.2s ease;
        border: none !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .member-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        transform: translateY(-1px);
    }
    .member-table tbody tr {
        transition: all 0.2s ease;
    }
    .member-table tbody tr:hover {
        background-color: #f8f9fa !important;
        transform: translateX(2px);
    }
    .action-button {
        transition: all 0.2s ease;
        border: 1px solid;
    }
    .action-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .status-badge {
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
    }
    .modal-header-custom {
        border-bottom: 3px solid;
        border-radius: 0.375rem 0.375rem 0 0;
    }
    .progress-card {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }
    .challenge-item {
        transition: all 0.2s ease;
        border-left: 4px solid #28a745;
    }
    .challenge-item:hover {
        background-color: #f8f9fa;
        border-left-color: #198754;
    }
    .info-card {
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 15px;
        transition: all 0.3s ease;
    }
    .info-card:hover {
        background: rgba(255,255,255,1);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
`;

// Add styles to head
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    if (!document.head.querySelector('style[data-coach-members]')) {
        styleElement.setAttribute('data-coach-members', 'true');
        document.head.appendChild(styleElement);
    }
}

// Modal xem thử thách của thành viên
function MemberChallengesModal({ show, onHide, challenges, member, loading }) {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-success text-white modal-header-custom" style={{ borderBottomColor: '#198754' }}>
                <Modal.Title className="d-flex align-items-center">
                    <FaTasks className="me-2" />
                    Thử thách của {member?.FullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                        <h5 className="mt-3 text-muted">Đang tải thử thách...</h5>
                    </div>
                ) : !challenges || challenges.length === 0 ? (
                    <div className="text-center py-4">
                        <FaTrophy size={48} className="text-muted mb-3" />
                        <Alert variant="info" className="border-0 info-card">
                            <h5>Chưa có thử thách nào</h5>
                            <p className="mb-0">Thành viên này chưa tham gia thử thách nào.</p>
                        </Alert>
                    </div>
                ) : (
                    <div>
                        <div className="progress-card text-center">
                            <div className="d-flex align-items-center justify-content-center">
                                <FaTrophy className="text-warning me-3" size={24} />
                                <div>
                                    <h4 className="mb-1">Tổng số thử thách: {challenges.length}</h4>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <span className="badge bg-success me-2 px-3 py-2">
                                            <FaCheckCircle className="me-1" />
                                            Hoàn thành: {challenges.filter(c => c.isCompleted).length}
                                        </span>
                                        <span className="badge bg-warning px-3 py-2">
                                            <FaTasks className="me-1" />
                                            Còn lại: {challenges.filter(c => !c.isCompleted).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ListGroup variant="flush">
                            {challenges.map((c, index) => (
                                <ListGroup.Item key={c.id} className="border rounded mb-3 shadow-sm challenge-item">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="badge bg-light text-dark me-2">#{index + 1}</span>
                                                <h6 className="mb-0 text-success">{c.templateTitle}</h6>
                                            </div>

                                            {c.description && (
                                                <div className="mb-2 text-muted" style={{ fontSize: 14 }}>
                                                    <FaStickyNote className="me-1" />
                                                    {c.description}
                                                </div>
                                            )}

                                            <div className="row g-2 mb-2">
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaCalendarAlt className="text-info me-2" />
                                                        <small>
                                                            <strong>Ngày:</strong> {c.scheduledDate?.split("T")[0]}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaCheckCircle className={c.isCompleted ? "text-success me-2" : "text-muted me-2"} />
                                                        <Badge bg={c.isCompleted ? "success" : "warning"} className="status-badge">
                                                            {c.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {c.notes && (
                                                <div className="mb-2">
                                                    <small className="text-muted">
                                                        <FaStickyNote className="me-1" />
                                                        <strong>Ghi chú:</strong> {c.notes}
                                                    </small>
                                                </div>
                                            )}

                                            {c.imageUrl && (
                                                <div className="mt-2">
                                                    <small className="text-muted d-flex align-items-center mb-1">
                                                        <FaImage className="me-1" />
                                                        Hình ảnh đính kèm:
                                                    </small>
                                                    <Image
                                                        src={c.imageUrl}
                                                        thumbnail
                                                        className="border border-2 border-light shadow-sm"
                                                        style={{ maxWidth: 120, maxHeight: 80, cursor: 'pointer' }}
                                                        onClick={() => window.open(c.imageUrl, '_blank')}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-light border-top-0">
                <Button variant="secondary" onClick={onHide} className="d-flex align-items-center">
                    <FaTimes className="me-2" />
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// Modal xem thông tin chi tiết member
function MemberDetailModal({ show, onHide, member, loadingDetail, surveyAnswers, loadingSurveyAnswers }) {
    // Thêm state để toggle lịch sử tiến trình
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        // Reset khi mở modal mới
        if (show) setShowHistory(false);
    }, [show, member]);

    if (!member) return null;

    // Sắp xếp tiến trình mới nhất lên đầu (theo ngày giảm dần)
    let sortedProgress = (member.QuitProgress || []).slice().sort(
        (a, b) => new Date(b.progressDate) - new Date(a.progressDate)
    );
    const latest = sortedProgress[0];
    const history = sortedProgress.slice(1);

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton className="bg-success text-white modal-header-custom" style={{ borderBottomColor: '#198754' }}>
                <Modal.Title className="d-flex align-items-center">
                    <FaUserCheck className="me-2" />
                    Chi tiết thành viên: {member.FullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Row>
                    <Col md={6}>
                        <div className="card border-0 bg-light h-100 info-card">
                            <div className="card-header bg-success text-white modal-header-custom" style={{ borderBottomColor: '#198754' }}>
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FaUser className="me-2" />
                                    Thông tin thành viên
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="d-flex align-items-center p-3 bg-white rounded border info-card">
                                            <FaUser className="text-success me-3" />
                                            <div>
                                                <small className="text-muted">Họ tên</small>
                                                <div className="fw-bold">{member.FullName}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex align-items-center p-3 bg-white rounded border info-card">
                                            <FaEnvelope className="text-info me-3" />
                                            <div>
                                                <small className="text-muted">Email</small>
                                                <div className="fw-bold">{member.Email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex align-items-center p-3 bg-white rounded border info-card">
                                            <FaPhone className="text-warning me-3" />
                                            <div>
                                                <small className="text-muted">Điện thoại</small>
                                                <div className="fw-bold">{member.PhoneNumber || 'Chưa cập nhật'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex align-items-center p-3 bg-white rounded border info-card">
                                            <FaCheckCircle className={member.Status === "Active" ? "text-success me-3" : "text-secondary me-3"} />
                                            <div>
                                                <small className="text-muted">Trạng thái</small>
                                                <div>
                                                    <Badge bg={member.Status === "Active" ? "success" : "secondary"} className="status-badge">
                                                        {member.Status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="card border-0 bg-light h-100 info-card">
                            <div className="card-header bg-warning text-dark modal-header-custom" style={{ borderBottomColor: '#ffc107' }}>
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FaChartLine className="me-2" />
                                    Tiến trình cai thuốc
                                </h5>
                            </div>
                            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {loadingDetail ? (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" size="sm" variant="warning" />
                                        <div className="mt-2 text-muted">Đang tải...</div>
                                    </div>
                                ) : sortedProgress.length > 0 ? (
                                    <div>
                                        {/* Hiện tiến trình mới nhất */}
                                        <div className="border rounded p-3 bg-white shadow-sm mb-3 info-card">
                                            <div className="d-flex align-items-center mb-2">
                                                <FaCalendarAlt className="text-success me-2" />
                                                <span className="badge bg-success status-badge">Mới nhất</span>
                                                <span className="ms-auto text-muted">{latest.progressDate?.split("T")[0]}</span>
                                            </div>
                                            <div className="row g-2 small">
                                                <div className="col-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaSmoking className="text-danger me-1" />
                                                        <span>Gốc: <strong>{latest.cigarettesPerDayBaseline}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaSmoking className="text-warning me-1" />
                                                        <span>Đã hút: <strong>{latest.cigarettesSmokedToday}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaCheckCircle className="text-success me-1" />
                                                        <span>Giảm: <strong>{latest.cigarettesDropped}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="d-flex align-items-center">
                                                        <FaTrophy className="text-warning me-1" />
                                                        <span>Tổng giảm: <strong>{latest.totalCigarettesDropped}</strong></span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex align-items-center">
                                                        <FaMoneyBillWave className="text-success me-1" />
                                                        <span>Tiết kiệm: <strong>{latest.totalMoneySaved?.toLocaleString()} VNĐ</strong></span>
                                                    </div>
                                                </div>
                                                {latest.notes && (
                                                    <div className="col-12">
                                                        <div className="bg-light p-2 rounded">
                                                            <FaStickyNote className="text-info me-1" />
                                                            <small>{latest.notes}</small>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Nút toggle lịch sử */}
                                        {history.length > 0 && (
                                            <div className="text-center mb-3">
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => setShowHistory((prev) => !prev)}
                                                    className="d-flex align-items-center mx-auto action-button"
                                                >
                                                    <FaHistory className="me-1" />
                                                    {showHistory ? "Ẩn lịch sử" : `Xem lịch sử (${history.length})`}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Lịch sử tiến trình */}
                                        {showHistory && history.length > 0 && (
                                            <div>
                                                <h6 className="text-muted mb-3">
                                                    <FaHistory className="me-1" />
                                                    Lịch sử tiến trình
                                                </h6>
                                                {history.map((p, idx) => (
                                                    <div key={idx} className="border rounded p-3 bg-white mb-2 shadow-sm info-card">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="badge bg-secondary status-badge me-2">#{history.length - idx}</span>
                                                            <span className="text-muted">{p.progressDate?.split("T")[0]}</span>
                                                        </div>
                                                        <div className="row g-1 small">
                                                            <div className="col-6">Gốc: <strong>{p.cigarettesPerDayBaseline}</strong></div>
                                                            <div className="col-6">Hút: <strong>{p.cigarettesSmokedToday}</strong></div>
                                                            <div className="col-6">Giảm: <strong>{p.cigarettesDropped}</strong></div>
                                                            <div className="col-6">Tổng: <strong>{p.totalCigarettesDropped}</strong></div>
                                                            <div className="col-12">
                                                                <FaMoneyBillWave className="text-success me-1" />
                                                                <strong>{p.totalMoneySaved?.toLocaleString()} VNĐ</strong>
                                                            </div>
                                                            {p.notes && (
                                                                <div className="col-12">
                                                                    <small className="text-muted">{p.notes}</small>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <FaChartLine size={32} className="text-muted mb-2" />
                                        <div className="text-muted">Chưa có tiến trình nào</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>

                <hr className="my-4" />

                <div className="card border-0 bg-light info-card">
                    <div className="card-header bg-secondary text-white modal-header-custom" style={{ borderBottomColor: '#6c757d' }}>
                        <h5 className="mb-0 d-flex align-items-center">
                            <FaQuestionCircle className="me-2" />
                            Câu hỏi khảo sát & đáp án
                        </h5>
                    </div>
                    <div className="card-body">
                        {loadingSurveyAnswers ? (
                            <div className="text-center py-3">
                                <Spinner animation="border" size="sm" />
                                <div className="mt-2 text-muted">Đang tải khảo sát...</div>
                            </div>
                        ) : surveyAnswers && surveyAnswers.length > 0 ? (
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="fw-bold">Câu hỏi</th>
                                            <th className="fw-bold">Đáp án</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mergeSurveyAnswers(surveyAnswers).map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-semibold text-dark">{item.questionText}</td>
                                                <td>
                                                    {item.answerList.map((ans, i) => (
                                                        <div key={i} className="mb-1">
                                                            <Badge bg="light" text="dark" className="me-1">•</Badge>
                                                            {ans}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <FaQuestionCircle size={32} className="text-muted mb-2" />
                                <Alert variant="info" className="border-0 info-card">
                                    <h6>Chưa có dữ liệu khảo sát</h6>
                                    <p className="mb-0">Thành viên này chưa hoàn thành khảo sát nào.</p>
                                </Alert>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-light border-top-0">
                <Button variant="secondary" onClick={onHide} className="d-flex align-items-center action-button">
                    <FaTimes className="me-2" />
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
// Thêm vào đầu file CoachMembers.jsx
function mergeSurveyAnswers(surveyAnswers) {
    const questionMap = new Map();
    (surveyAnswers || []).forEach(({ questionText, answerText, customAnswer }) => {
        if (!questionText) return;
        if (!questionMap.has(questionText)) {
            questionMap.set(questionText, []);
        }
        let fullAnswer = answerText;
        if (customAnswer) fullAnswer += ` (Khác: ${customAnswer})`;
        if (fullAnswer && !questionMap.get(questionText).includes(fullAnswer)) {
            questionMap.get(questionText).push(fullAnswer);
        }
    });
    return Array.from(questionMap, ([questionText, answerList]) => ({
        questionText,
        answerList
    }));
}

const CoachMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // State for Member Challenges Modal
    const [showChallengesModal, setShowChallengesModal] = useState(false);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [challengeMember, setChallengeMember] = useState(null);

    const [surveyAnswers, setSurveyAnswers] = useState([]);
    const [loadingSurveyAnswers, setLoadingSurveyAnswers] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            setLoading(false);
            return;
        }
        fetch("/api/coach/my-users", {
            method: "GET",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi lấy danh sách thành viên");
                return res.json();
            })
            .then(data => {
                const mapped = data.map(u => ({
                    UserID: u.userID,
                    FullName: u.fullName,
                    Email: u.email,
                    PhoneNumber: u.phoneNumber,
                    Status: u.status,
                    profilePicture: u.profilePicture,
                    QuitProgress: [],
                }));
                setMembers(mapped);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Xem chi tiết member: fetch progress từ API
    const handleClickMember = (member) => {
        setLoadingDetail(true);
        setLoadingSurveyAnswers(true);
        const token = localStorage.getItem("userToken");

        // Lấy tiến trình cai thuốc
        fetch(`/api/coach/user/${member.UserID}/progress`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi lấy tiến trình");
                return res.json();
            })
            .then(data => {
                setSelectedMember({
                    ...member,
                    QuitProgress: data.quitProgress || [],
                });
                setShowMemberModal(true);
                setLoadingDetail(false);
            })
            .catch(() => {
                setSelectedMember({ ...member, QuitProgress: [] });
                setShowMemberModal(true);
                setLoadingDetail(false);
            });

        // Lấy survey answers
        fetch(`/api/coach/user/${member.UserID}/survey-answers`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi lấy khảo sát");
                return res.json();
            })
            .then(data => {
                setSurveyAnswers(data || []);
                setLoadingSurveyAnswers(false);
            })
            .catch(() => {
                setSurveyAnswers([]);
                setLoadingSurveyAnswers(false);
            });
    };


    // Xem thử thách của thành viên
    const handleViewChallenges = (member) => {
        setLoadingChallenges(true);
        setShowChallengesModal(true);
        setChallengeMember(member);
        const token = localStorage.getItem("userToken");
        fetch(`/api/coach/user/${member.UserID}/challenges`, {
            method: "GET",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("Lỗi lấy thử thách");
                return res.json();
            })
            .then(data => {
                setChallenges(data || []);
                setLoadingChallenges(false);
            })
            .catch(() => {
                setChallenges([]);
                setLoadingChallenges(false);
            });
    };

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2 text-success d-flex align-items-center">
                        <FaUserCheck className="me-3" />
                        Danh sách thành viên đang đồng hành
                    </h2>
                    <p className="text-muted mb-0">Quản lý và theo dõi tiến trình cai thuốc của các thành viên</p>
                </div>
                {members.length > 0 && (
                    <div className="d-flex align-items-center">
                        <Badge bg="success" className="fs-6 px-3 py-2">
                            <FaUser className="me-1" />
                            {members.length} thành viên
                        </Badge>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <h5 className="mt-3 text-muted">Đang tải danh sách thành viên...</h5>
                </div>
            ) : (
                <Card className="shadow-sm border-0 member-card">
                    <Card.Header className="bg-success text-white modal-header-custom" style={{ borderBottomColor: '#198754' }}>
                        <div className="d-flex align-items-center">
                            <FaUserCheck className="me-2" />
                            <h5 className="mb-0">Danh sách thành viên</h5>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {members.length === 0 ? (
                            <div className="text-center py-5">
                                <FaUserCheck size={48} className="text-muted mb-3" />
                                <h5 className="text-muted">Chưa có thành viên nào</h5>
                                <p className="text-muted mb-0">
                                    Hiện tại chưa có thành viên nào chọn bạn làm coach.
                                    Hãy chia sẻ thông tin của bạn để thu hút thêm thành viên!
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle member-table">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="fw-bold border-0 py-3">
                                                <FaUser className="me-2 text-success" />
                                                Thành viên
                                            </th>
                                            <th className="fw-bold border-0 py-3">
                                                <FaEnvelope className="me-2 text-info" />
                                                Liên hệ
                                            </th>
                                            <th className="fw-bold border-0 py-3 text-center">
                                                <FaCheckCircle className="me-2 text-success" />
                                                Trạng thái
                                            </th>
                                            <th className="fw-bold border-0 py-3 text-center" style={{ minWidth: 200 }}>
                                                <FaTasks className="me-2 text-warning" />
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((m) => (
                                            <tr key={m.UserID} className="border-bottom">
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            {m.profilePicture ? (
                                                                <img
                                                                    src={m.profilePicture}
                                                                    alt="avatar"
                                                                    className="rounded-circle border border-2 border-light shadow-sm"
                                                                    style={{
                                                                        width: 45,
                                                                        height: 45,
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle bg-success d-flex align-items-center justify-content-center text-white border border-2 border-light shadow-sm"
                                                                    style={{ width: 45, height: 45 }}
                                                                >
                                                                    <FaUser size={18} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{m.FullName}</div>
                                                            <small className="text-muted">ID: {m.UserID}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div>
                                                        <div className="d-flex align-items-center mb-1">
                                                            <FaEnvelope className="text-info me-2" size={14} />
                                                            <span className="small">{m.Email}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <FaPhone className="text-warning me-2" size={14} />
                                                            <span className="small text-muted">
                                                                {m.PhoneNumber || 'Chưa cập nhật'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <Badge
                                                        bg={m.Status === "Active" ? "success" : "secondary"}
                                                        className="status-badge d-flex align-items-center justify-content-center"
                                                        style={{ width: 'fit-content', margin: '0 auto' }}
                                                    >
                                                        <FaCheckCircle className="me-1" size={12} />
                                                        {m.Status === "Active" ? "Hoạt động" : "Không hoạt động"}
                                                    </Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-success"
                                                            onClick={() => handleClickMember(m)}
                                                            className="action-button d-flex align-items-center px-3"
                                                        >
                                                            <FaUser className="me-1" size={12} />
                                                            Chi tiết
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-warning"
                                                            onClick={() => handleViewChallenges(m)}
                                                            className="action-button d-flex align-items-center px-3"
                                                        >
                                                            <FaTasks className="me-1" size={12} />
                                                            Thử thách
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* Modal xem chi tiết member */}
            <MemberDetailModal
                show={showMemberModal}
                onHide={() => setShowMemberModal(false)}
                member={selectedMember}
                loadingDetail={loadingDetail}
                surveyAnswers={surveyAnswers}
                loadingSurveyAnswers={loadingSurveyAnswers}
            />

            {/* Modal Thử thách của thành viên */}
            <MemberChallengesModal
                show={showChallengesModal}
                onHide={() => setShowChallengesModal(false)}
                challenges={challenges}
                member={challengeMember}
                loading={loadingChallenges}
            />
        </Container>
    );
};

export default CoachMembers;    