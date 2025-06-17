import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Badge,
    Image,
    Button,
    Modal,
    Alert,
    Toast,
    ToastContainer,
    ListGroup,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

// DUMMY COACHES
const DUMMY_COACHES = [
    {
        id: 1,
        name: "Nguyễn Minh Long",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        specialty: "Cai thuốc lá",
        experience: 5,
        rating: 4.8,
        bio: "Chuyên gia đồng hành hỗ trợ bạn xây dựng và duy trì lối sống lành mạnh. Đã giúp hơn 200 thành viên vượt qua thói quen hút thuốc.",
        tags: ["Cai thuốc", "Sức khỏe", "Động lực"],
        feedbacks: [
            {
                id: 1,
                user: "Trần Văn An",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                date: "2025-05-18",
                rating: 5,
                comment:
                    "Coach Long rất tâm huyết và truyền cảm hứng. Nhờ coach mình đã bỏ thuốc được 4 tháng!",
            },
            {
                id: 2,
                user: "Lê Thị Hòa",
                avatar: "https://randomuser.me/api/portraits/women/47.jpg",
                date: "2025-05-28",
                rating: 4,
                comment:
                    "Cảm ơn coach đã luôn động viên và chia sẻ kiến thức bổ ích cho mình.",
            },
        ],
    },
    {
        id: 2,
        name: "Lê Thị Thu Hằng",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        specialty: "Dinh dưỡng & Động lực",
        experience: 7,
        rating: 4.9,
        bio: "Luôn tận tâm hỗ trợ từng học viên, giúp bạn lên kế hoạch ăn uống và sống tích cực hơn mỗi ngày.",
        tags: ["Dinh dưỡng", "Động lực", "Tư vấn cá nhân"],
        feedbacks: [
            {
                id: 1,
                user: "Minh Quang",
                avatar: "https://randomuser.me/api/portraits/men/39.jpg",
                date: "2025-04-20",
                rating: 5,
                comment:
                    "Coach Hằng hướng dẫn chi tiết lộ trình, mình đã cải thiện sức khỏe rõ rệt!",
            },
        ],
    },
    {
        id: 3,
        name: "Hoàng Tuấn Anh",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        specialty: "Huấn luyện tâm lý",
        experience: 4,
        rating: 4.7,
        bio: "Giúp khách hàng vượt qua căng thẳng, lo âu trong quá trình cai nghiện và thay đổi thói quen xấu.",
        tags: ["Tâm lý", "Cố vấn", "Thói quen tốt"],
        feedbacks: [],
    },
    {
        id: 4,
        name: "Trần Mỹ Duyên",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        specialty: "Chăm sóc sức khỏe tổng quát",
        experience: 6,
        rating: 4.85,
        bio: "Chia sẻ kiến thức khoa học và động viên học viên tiến bộ từng ngày.",
        tags: ["Sức khỏe", "Chăm sóc", "Đồng hành"],
        feedbacks: [
            {
                id: 1,
                user: "Nguyễn Thanh",
                avatar: "https://randomuser.me/api/portraits/men/50.jpg",
                date: "2025-06-01",
                rating: 5,
                comment:
                    "Coach Duyên rất chu đáo và luôn theo sát tiến trình của mình. Rất cảm ơn chị!",
            },
        ],
    },
];

// Modal đặt lịch tư vấn
function BookCoachModal({ show, onHide, coach }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSuccess(true);
            setSubmitting(false);
        }, 800);
    };

    React.useEffect(() => {
        setDate("");
        setTime("");
        setNote("");
        setSuccess(false);
        setSubmitting(false);
    }, [show, coach]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Đặt lịch tư vấn với Coach</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {coach && (
                    <div className="mb-3 d-flex align-items-center">
                        <Image
                            src={coach.avatar}
                            roundedCircle
                            width={50}
                            height={50}
                            className="me-3"
                            style={{ border: "2px solid #2EA3A3", objectFit: "cover" }}
                            alt={coach.name}
                        />
                        <div>
                            <div className="fw-bold">{coach.name}</div>
                            <div className="text-muted" style={{ fontSize: 14 }}>
                                {coach.specialty}
                            </div>
                        </div>
                    </div>
                )}
                {success ? (
                    <Alert variant="success">
                        Đã gửi đơn đăng ký lịch tư vấn thành công! Hãy chờ thông báo của hệ thống nhé.
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Chọn ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                required
                                value={date}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Chọn giờ</label>
                            <input
                                type="time"
                                className="form-control"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ghi chú (tuỳ chọn)</label>
                            <textarea
                                rows={2}
                                className="form-control"
                                placeholder="Nhập thêm thông tin mong muốn..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="success"
                            type="submit"
                            disabled={submitting || !date || !time}
                            className="w-100"
                        >
                            {submitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
                        </Button>
                    </form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// Modal xác nhận hủy chọn coach
function ConfirmUnchooseCoachModal({ show, onHide, coach, onConfirm }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận hủy chọn coach</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="danger">
                    Bạn có chắc chắn muốn hủy chọn <strong>{coach?.name}</strong> là coach đồng hành?
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xác nhận hủy chọn
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const ProfileOfCoach = ({
    currentChosenCoachId,
    setChosenCoachId,
}) => {
    const { id } = useParams();
    const coachId = parseInt(id, 10);

    // Hiển thị log id ra console để debug
    React.useEffect(() => {
        console.log("id param:", id, "coachId:", coachId);
    }, [id, coachId]);

    const coach = DUMMY_COACHES.find((c) => c.id === coachId);

    // Giả lập user đã chọn coach (có thể truyền prop hoặc lấy từ context)
    const isThisCoachChosen = currentChosenCoachId === coachId;
    const hasChosenCoach = Boolean(currentChosenCoachId);

    // Modal đặt lịch tư vấn
    const [showBookModal, setShowBookModal] = useState(false);

    // Modal xác nhận hủy chọn coach
    const [showUnchooseModal, setShowUnchooseModal] = useState(false);

    // Toast khi hủy thành công
    const [showToast, setShowToast] = useState(false);

    // Chỉ được đặt lịch với coach đã chọn
    const canBookThisCoach = !hasChosenCoach || isThisCoachChosen;

    const navigate = useNavigate();

    if (!coach) {
        return (
            <Container>
                <Alert variant="danger" className="my-5">
                    Không tìm thấy thông tin coach.
                </Alert>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: 40, marginBottom: 40, maxWidth: 650 }}>
            <Row>
                <Col xs={12} className="mb-4 d-flex justify-content-center">
                    <Image
                        src={coach.avatar}
                        roundedCircle
                        width={110}
                        height={110}
                        style={{
                            objectFit: "cover",
                            border: "4px solid #2EA3A3",
                            boxShadow: "0 2px 8px #0001",
                            cursor: "pointer",
                            transition: "box-shadow 0.2s",
                        }}
                        alt={coach.name}
                        onClick={() =>
                            navigate(`/User/coach/profile/${coach.id}`)
                        }
                        title="Xem hồ sơ coach"
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} className="text-center">
                    <div className="fw-bold" style={{ fontSize: 28, color: "#183153" }}>
                        {coach.name}
                    </div>
                    <div className="text-muted mb-2" style={{ fontSize: 18 }}>
                        {coach.specialty}
                    </div>
                    <div>
                        <Badge bg="success" style={{ fontSize: 15, marginRight: 8 }}>
                            {coach.experience} năm kinh nghiệm
                        </Badge>
                        <Badge bg="warning" text="dark" style={{ fontSize: 15 }}>
                            ★ {coach.rating}
                        </Badge>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div className="mt-4 mb-3" style={{ fontSize: 17 }}>
                        {coach.bio}
                    </div>
                    <div className="mb-4">
                        {coach.tags.map((tag, idx) => (
                            <Badge
                                key={idx}
                                bg="info"
                                text="dark"
                                style={{ fontSize: 14, marginRight: 6 }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    {/* Đánh giá/Mô tả của học viên */}
                    <h5 className="fw-bold mb-3 mt-4">Đánh giá từ học viên</h5>
                    {coach.feedbacks?.length > 0 ? (
                        <ListGroup className="mb-4">
                            {coach.feedbacks.map((fb) => (
                                <ListGroup.Item key={fb.id} style={{ borderRadius: 8 }}>
                                    <div className="d-flex align-items-center mb-1">
                                        <Image
                                            src={fb.avatar}
                                            roundedCircle
                                            width={36}
                                            height={36}
                                            style={{ objectFit: "cover", marginRight: 12 }}
                                            alt={fb.user}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div className="fw-bold" style={{ fontSize: 16 }}>
                                                {fb.user}
                                            </div>
                                            <div style={{ fontSize: 13, color: "#888" }}>
                                                {new Date(fb.date).toLocaleDateString("vi-VN")}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: "#FFB400", fontWeight: "bold" }}>
                                                {"★".repeat(Math.round(fb.rating))}
                                            </span>
                                            <span style={{ color: "#999", marginLeft: 2 }}>
                                                {fb.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 15 }}>{fb.comment}</div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <Alert variant="secondary" className="mb-4">Chưa có đánh giá nào.</Alert>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                        {isThisCoachChosen ? (
                            <>
                                <Button
                                    variant="danger"
                                    onClick={() => setShowUnchooseModal(true)}
                                    style={{ minWidth: 130 }}
                                >
                                    Hủy chọn coach
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => setShowBookModal(true)}
                                    style={{ minWidth: 130 }}
                                >
                                    Đặt lịch tư vấn
                                </Button>
                            </>
                        ) : canBookThisCoach ? (
                            <Button
                                variant="success"
                                onClick={() => setShowBookModal(true)}
                                style={{ minWidth: 180 }}
                            >
                                Đặt lịch tư vấn
                            </Button>
                        ) : (
                            <Alert variant="info" className="w-100 text-center mb-0 py-2" style={{ fontSize: 15 }}>
                                Chỉ có thể đặt lịch với coach đồng hành hiện tại!
                            </Alert>
                        )}
                    </div>
                </Col>
            </Row>
            <BookCoachModal
                show={showBookModal}
                onHide={() => setShowBookModal(false)}
                coach={coach}
            />
            <ConfirmUnchooseCoachModal
                show={showUnchooseModal}
                onHide={() => setShowUnchooseModal(false)}
                coach={coach}
                onConfirm={() => {
                    setShowUnchooseModal(false);
                    if (setChosenCoachId) setChosenCoachId(null);
                    setShowToast(true);
                }}
            />
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={2200}
                    autohide
                    bg="success"
                >
                    <Toast.Body style={{ color: "#fff" }}>
                        Đã hủy chọn coach thành công!
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default ProfileOfCoach;