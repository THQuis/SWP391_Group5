
import React, { useState, useEffect } from "react";
import {
    Container, Card, Table, Button, Badge, Spinner, Modal, Row, Col, ListGroup, Alert, Image
} from "react-bootstrap";
import '../../styles/CoachMembersManagement.scss';

// Modal xem thử thách của thành viên
function MemberChallengesModal({ show, onHide, challenges, member, loading }) {
    // Helper: get image url from imageData (base64) and hasImage
    const getImageUrl = (c) => {
        if (c.imageData) {
            let contentType = "image/jpeg";
            if (typeof c.imageData === 'string' && c.imageData.startsWith("iVBOR")) contentType = "image/png";
            if (typeof c.imageData === 'string' && c.imageData.startsWith("/9j/")) contentType = "image/jpeg";
            return `data:${contentType};base64,${c.imageData}`;
        }
        return null;
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    🎯 Thử thách của {member?.FullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                ) : !challenges || challenges.length === 0 ? (
                    <Alert variant="info" className="border-0 info-card">Chưa có thử thách nào.</Alert>
                ) : (
                    <ListGroup>
                        {challenges.map((c) => {
                            const imageUrl = getImageUrl(c);
                            return (
                                <ListGroup.Item key={c.id} className="border rounded mb-3 shadow-sm challenge-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{c.templateTitle}</strong>
                                            <div className="text-muted" style={{ fontSize: 14 }}>
                                                {c.description}
                                            </div>
                                            <div>
                                                <span className="me-2">
                                                    <b>Ngày:</b> {c.scheduledDate?.split("T")[0]}
                                                </span>
                                                <span>
                                                    <b>Trạng thái:</b>{" "}
                                                    <Badge bg={c.isCompleted ? "success" : "secondary"}>
                                                        {c.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                                                    </Badge>
                                                </span>
                                            </div>
                                            {c.notes && (
                                                <div>
                                                    <b>Ghi chú:</b> {c.notes}
                                                </div>
                                            )}
                                            {imageUrl && (
                                                <div className="mt-2">
                                                    <Image src={imageUrl} thumbnail style={{ maxWidth: 120, maxHeight: 80, border: '2px solid #e0e7ef', boxShadow: '0 2px 8px rgba(79,70,229,0.07)' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                )}
            </Modal.Body>
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
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    👤 Chi tiết thành viên: {member.FullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <h5>Thông tin thành viên</h5>
                        <Table bordered size="sm" className="mb-4">
                            <tbody>
                                <tr>
                                    <td>Họ tên</td>
                                    <td>{member.FullName}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{member.Email}</td>
                                </tr>
                                <tr>
                                    <td>Điện thoại</td>
                                    <td>{member.PhoneNumber}</td>
                                </tr>
                                <tr>
                                    <td>Trạng thái</td>
                                    <td>
                                        <Badge bg={member.Status === "Active" ? "success" : "secondary"}>
                                            {member.Status}
                                        </Badge>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={6}>
                        <h5>Tiến trình cai thuốc</h5>
                        {loadingDetail ? (
                            <Spinner animation="border" size="sm" />
                        ) : sortedProgress.length > 0 ? (
                            <div style={{ background: "#f9f9f9", borderRadius: 8, border: "1px solid #e3e4e4", padding: 10 }}>
                                {/* Hiện tiến trình mới nhất */}
                                <Table bordered size="sm" className="mb-3" style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: 120, fontWeight: 500 }}>Ngày</td>
                                            <td colSpan={2}>{latest.progressDate?.split("T")[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>Điếu/ngày (gốc)</td>
                                            <td colSpan={2}>{latest.cigarettesPerDayBaseline}</td>
                                        </tr>
                                        <tr>
                                            <td>Điếu đã hút</td>
                                            <td colSpan={2}>{latest.cigarettesSmokedToday}</td>
                                        </tr>
                                        <tr>
                                            <td>Điếu giảm</td>
                                            <td colSpan={2}>{latest.cigarettesDropped}</td>
                                        </tr>
                                        <tr>
                                            <td>Cộng dồn giảm</td>
                                            <td colSpan={2}>{latest.totalCigarettesDropped}</td>
                                        </tr>
                                        <tr>
                                            <td>Tiết kiệm</td>
                                            <td colSpan={2}>{latest.totalMoneySaved?.toLocaleString()} VNĐ</td>
                                        </tr>
                                        <tr>
                                            <td>Ghi chú</td>
                                            <td colSpan={2}>{latest.notes}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                {/* Nút toggle lịch sử */}
                                {history.length > 0 && (
                                    <div style={{ textAlign: "center" }}>
                                        <Button
                                            variant="link"
                                            onClick={() => setShowHistory((prev) => !prev)}
                                            style={{ fontWeight: 500, color: "#0d6efd" }}
                                        >
                                            {showHistory ? "Ẩn lịch sử ▲" : "Xem lịch sử ▼"}
                                        </Button>
                                    </div>
                                )}
                                {/* Lịch sử tiến trình */}
                                {showHistory && history.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        {history.map((p, idx) => (
                                            <Table key={idx} bordered size="sm" className="mb-3" style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: 120, fontWeight: 500 }}>Ngày</td>
                                                        <td colSpan={2}>{p.progressDate?.split("T")[0]}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Điếu/ngày (gốc)</td>
                                                        <td colSpan={2}>{p.cigarettesPerDayBaseline}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Điếu đã hút</td>
                                                        <td colSpan={2}>{p.cigarettesSmokedToday}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Điếu giảm</td>
                                                        <td colSpan={2}>{p.cigarettesDropped}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cộng dồn giảm</td>
                                                        <td colSpan={2}>{p.totalCigarettesDropped}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tiết kiệm</td>
                                                        <td colSpan={2}>{p.totalMoneySaved?.toLocaleString()} VNĐ</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Ghi chú</td>
                                                        <td colSpan={2}>{p.notes}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>Chưa có tiến trình.</div>
                        )}
                    </Col>
                </Row>
                <hr />
                <h5>Câu hỏi khảo sát & đáp án</h5>
                {loadingSurveyAnswers ? (
                    <Spinner animation="border" size="sm" />
                ) : surveyAnswers && surveyAnswers.length > 0 ? (
                    <Table bordered size="sm">
                        <thead>
                            <tr>
                                <th>Câu hỏi</th>
                                <th>Đáp án</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergeSurveyAnswers(surveyAnswers).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.questionText}</td>
                                    <td>
                                        {item.answerList.map((ans, i) => (
                                            <div key={i}>- {ans}</div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">Chưa có dữ liệu khảo sát.</Alert>
                )}
            </Modal.Body>
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
        <Container className="coach-members-management-page" style={{ marginTop: 40, marginBottom: 40 }}>
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-success mb-3">
                    👨‍⚕️ Danh sách thành viên đang đồng hành
                </h1>
                <p className="lead text-muted">
                    Quản lý và theo dõi tiến trình cai thuốc của các thành viên
                </p>
                {members.length > 0 && (
                    <div className="d-inline-flex align-items-center bg-success text-white px-4 py-2 rounded-pill">
                        <span className="me-2">👥</span>
                        <strong>{members.length} thành viên</strong>
                    </div>
                )}
            </div>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
                    <h5 className="mt-3 text-success">Đang tải danh sách thành viên...</h5>
                </div>
            ) : (
                <Card className="shadow-lg">
                    <Card.Header className="bg-gradient">
                        <h5 className="mb-0 d-flex align-items-center">
                            <span className="me-2">📋</span>
                            Danh sách thành viên
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        {members.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <span style={{ fontSize: '4rem' }}>👥</span>
                                </div>
                                <h4 className="text-muted mb-3">Chưa có thành viên nào</h4>
                                <p className="text-muted">
                                    Hiện tại chưa có thành viên nào chọn bạn làm coach.<br />
                                    Hãy chia sẻ thông tin của bạn để thu hút thêm thành viên!
                                </p>
                            </div>
                        ) : (
                            <Table hover responsive className="member-table">
                                <thead>
                                    <tr>
                                        <th>👤 Họ tên</th>
                                        <th>📧 Email</th>
                                        <th>📞 Điện thoại</th>
                                        <th>📊 Trạng thái</th>
                                        <th colSpan={2} style={{ minWidth: 170 }}>⚙️ Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((m) => (
                                        <tr key={m.UserID}>
                                            <td>
                                                {m.profilePicture && (
                                                    <img
                                                        src={m.profilePicture}
                                                        alt="avatar"
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            objectFit: "cover",
                                                            borderRadius: "50%",
                                                            marginRight: 8,
                                                            border: "1px solid #eee",
                                                        }}
                                                    />
                                                )}
                                                {m.FullName}
                                            </td>
                                            <td>{m.Email}</td>
                                            <td>{m.PhoneNumber}</td>
                                            <td>
                                                <Badge bg={m.Status === "Active" ? "success" : "secondary"}>
                                                    {m.Status}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button size="sm" variant="primary" onClick={() => handleClickMember(m)} className="me-2 btn-action-detail">
                                                    👁️ Xem chi tiết
                                                </Button>
                                            </td>
                                            <td>
                                                <Button size="sm" variant="info" onClick={() => handleViewChallenges(m)} className="btn-action-challenge">
                                                    🎯 Thử thách
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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