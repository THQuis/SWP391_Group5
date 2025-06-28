import React, { useState } from "react";
import {
    Container, Row, Col, Badge, Button, Image, ListGroup,
    Modal, Alert, Toast, ToastContainer, Form, Spinner
} from "react-bootstrap";
import { useParams } from "react-router-dom";

// Giả lập data từ database
const COACHES = [
    {
        UserID: 1,
        FullName: "Nguyễn Văn A",
        Email: "mi@gmail.com",
        PhoneNumber: "0905556666",
        ProfilePicture: null,
        Status: "Active",
        Bio: "Tôi là huấn luyện viên đã giúp hơn 100 học viên bỏ thuốc thành công. Luôn tận tâm đồng hành cùng bạn trên hành trình thay đổi.",
    },
    {
        UserID: 2,
        FullName: "Trần Thị Bình",
        Email: "member.binh@example.com",
        PhoneNumber: "0907778888",
        ProfilePicture: null,
        Status: "Active",
        Bio: "Chuyên gia hỗ trợ tâm lý và xây dựng lộ trình cai thuốc phù hợp với từng cá nhân. Đặt mục tiêu cùng bạn vượt qua mọi khó khăn.",
    },
    {
        UserID: 3,
        FullName: "Lê Thị B",
        Email: "mi@gmail.com",
        PhoneNumber: "0905556666",
        ProfilePicture: null,
        Status: "Active",
        Bio: "Tôi là huấn luyện viên đã giúp hơn 100 học viên bỏ thuốc thành công. Luôn tận tâm đồng hành cùng bạn trên hành trình thay đổi.",
    },
    {
        UserID: 4,
        FullName: "Trần Trung K",
        Email: "member.binh@example.com",
        PhoneNumber: "0907778888",
        ProfilePicture: null,
        Status: "Active",
        Bio: "Chuyên gia hỗ trợ tâm lý và xây dựng lộ trình cai thuốc phù hợp với từng cá nhân. Đặt mục tiêu cùng bạn vượt qua mọi khó khăn.",
    },
];

const BLOGS = [];
const FEEDBACKS = [];

const ProfileOfCoach = ({
    currentChosenCoachId,
    setChosenCoachId
}) => {
    const { id } = useParams();
    const coachId = Number(id);

    const coach = COACHES.find((c) => c.UserID === coachId);

    // State
    const [showChooseModal, setShowChooseModal] = useState(false);
    const [showUnchooseModal, setShowUnchooseModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Booking form state
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [bookingNote, setBookingNote] = useState("");
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const isThisCoachChosen = currentChosenCoachId === coachId;
    const hasChosenCoach = !!currentChosenCoachId;
    const canBookThisCoach = !hasChosenCoach || isThisCoachChosen;

    const handleChooseCoach = () => {
        setChosenCoachId(coachId);
        setShowChooseModal(false);
        setToastMsg("Bạn đã chọn coach thành công!");
        setShowToast(true);
    };

    const handleUnchooseCoach = () => {
        setChosenCoachId(null);
        setShowUnchooseModal(false);
        setToastMsg("Đã hủy chọn coach thành công!");
        setShowToast(true);
    };

    // Booking logic
    const handleBookingSubmit = (e) => {
        e.preventDefault();
        setBookingSubmitting(true);
        // Giả lập gửi API
        setTimeout(() => {
            setBookingSubmitting(false);
            setBookingSuccess(true);
            setBookingDate("");
            setBookingTime("");
            setBookingNote("");
        }, 1000);
    };

    const resetBookingModal = () => {
        setShowBookModal(false);
        setBookingSuccess(false);
        setBookingDate("");
        setBookingTime("");
        setBookingNote("");
        setBookingSubmitting(false);
    };

    if (!coach)
        return (
            <Container className="pt-4">
                <Alert variant="danger">Không tìm thấy thông tin huấn luyện viên.</Alert>
            </Container>
        );

    return (
        <Container style={{ maxWidth: 700, paddingTop: 20, paddingBottom: 4 }}>
            <Row>
                <Col xs={12} className="mb-4 text-center">
                    <Image
                        src={coach.ProfilePicture || "https://randomuser.me/api/portraits/lego/6.jpg"}
                        roundedCircle
                        width={110}
                        height={110}
                        style={{
                            objectFit: "cover",
                            border: "4px solid #2EA3A3",
                            boxShadow: "0 2px 8px #0001",
                        }}
                        alt={coach.FullName}
                    />
                    <div className="fw-bold" style={{ fontSize: 26, color: "#183153", marginTop: 10 }}>
                        {coach.FullName}
                    </div>
                    <div className="text-muted" style={{ fontSize: 18 }}>
                        Chuyên gia tư vấn cai thuốc
                    </div>
                    <div>
                        <Badge bg="success" style={{ fontSize: 15, margin: 4 }}>
                            Email: {coach.Email}
                        </Badge>
                        <Badge bg="info" style={{ fontSize: 15, margin: 4 }}>
                            SĐT: {coach.PhoneNumber}
                        </Badge>
                    </div>
                </Col>
            </Row>

            {/* Mô tả coach */}
            <Row>
                <Col xs={12} className="mb-3">
                    <div className="fw-bold" style={{ fontSize: 18 }}>Giới thiệu về coach</div>
                    <div style={{ fontSize: 16, marginBottom: 14 }}>{coach.Bio}</div>
                </Col>
            </Row>

            {/* Bài viết của coach */}
            <Row>
                <Col xs={12} className="mb-4">
                    <div className="fw-bold" style={{ fontSize: 18 }}>Bài viết của Coach</div>
                    <ListGroup>
                        {BLOGS.length === 0 && <ListGroup.Item>Chưa có bài viết nào.</ListGroup.Item>}
                        {BLOGS.map((b) => (
                            <ListGroup.Item key={b.BlogId}>
                                <div style={{ fontWeight: "bold" }}>{b.Title}</div>
                                <div style={{ fontSize: 13, color: "#888" }}>
                                    {new Date(b.CreatedDate).toLocaleDateString("vi-VN")}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>

            {/* Đánh giá */}
            <Row>
                <Col xs={12} className="mb-4">
                    <div className="fw-bold" style={{ fontSize: 18 }}>Đánh giá từ học viên</div>
                    <ListGroup>
                        {FEEDBACKS.length === 0 && <ListGroup.Item>Chưa có đánh giá nào.</ListGroup.Item>}
                        {FEEDBACKS.map((fb) => (
                            <ListGroup.Item key={fb.FeedbackID}>
                                <span style={{ color: "#FFB400" }}>{"★".repeat(fb.Rating)}</span>
                                <span style={{ color: "#999", marginLeft: 8 }}>{fb.Rating}/5</span>
                                <div style={{ fontSize: 14 }}>{fb.FeedbackContent}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>
                                    {new Date(fb.FeedbackDate).toLocaleDateString("vi-VN")}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>

            {/* Nút thao tác */}
            <Row>
                <Col xs={12} className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 mb-3">
                    {isThisCoachChosen && (
                        <Button
                            variant="danger"
                            size="lg"
                            style={{ minWidth: 150 }}
                            onClick={() => setShowUnchooseModal(true)}
                        >
                            Hủy chọn coach
                        </Button>
                    )}

                    {!hasChosenCoach && (
                        <Button
                            variant="primary"
                            size="lg"
                            style={{ minWidth: 150 }}
                            onClick={() => setShowChooseModal(true)}
                        >
                            Chọn coach
                        </Button>
                    )}

                    <Button
                        variant="success"
                        size="lg"
                        style={{ minWidth: 180 }}
                        disabled={!canBookThisCoach}
                        onClick={() => setShowBookModal(true)}
                    >
                        Đặt lịch tư vấn
                    </Button>
                </Col>
            </Row>

            {hasChosenCoach && !isThisCoachChosen && (
                <Row>
                    <Col xs={12} className="mb-2">
                        <Alert variant="warning" className="text-center m-0">
                            Bạn chỉ có thể đặt lịch và thao tác với coach đồng hành hiện tại.<br />
                            Hãy hủy chọn coach đang đồng hành nếu muốn đổi coach khác.
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Modal xác nhận chọn coach */}
            <Modal show={showChooseModal} onHide={() => setShowChooseModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận chọn coach</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        Xác nhận chọn <strong>{coach.FullName}</strong> làm coach đồng hành?<br />
                        Sau khi chọn, bạn chỉ có thể đặt lịch tư vấn với coach này.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChooseModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleChooseCoach}>
                        Xác nhận chọn
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận hủy chọn coach */}
            <Modal show={showUnchooseModal} onHide={() => setShowUnchooseModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hủy chọn coach</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        Bạn có chắc chắn muốn hủy chọn <strong>{coach.FullName}</strong> là coach đồng hành?
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUnchooseModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="danger" onClick={handleUnchooseCoach}>
                        Xác nhận hủy chọn
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal đặt lịch tư vấn (có form) */}
            <Modal show={showBookModal} onHide={resetBookingModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Đặt lịch tư vấn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {canBookThisCoach ? (
                        bookingSuccess ? (
                            <Alert variant="success">
                                Đã gửi đơn đăng ký lịch tư vấn thành công! Hãy chờ thông báo của hệ thống nhé.
                            </Alert>
                        ) : (
                            <Form onSubmit={handleBookingSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chọn ngày</Form.Label>
                                    <Form.Control
                                        type="date"
                                        required
                                        value={bookingDate}
                                        min={new Date().toISOString().slice(0, 10)}
                                        onChange={e => setBookingDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chọn giờ</Form.Label>
                                    <Form.Control
                                        type="time"
                                        required
                                        value={bookingTime}
                                        onChange={e => setBookingTime(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ghi chú (tuỳ chọn)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Nhập thêm thông tin mong muốn..."
                                        value={bookingNote}
                                        onChange={e => setBookingNote(e.target.value)}
                                    />
                                </Form.Group>
                                <Button
                                    variant="success"
                                    type="submit"
                                    className="w-100"
                                    disabled={bookingSubmitting || !bookingDate || !bookingTime}
                                >
                                    {bookingSubmitting ? <Spinner size="sm" animation="border" /> : "Gửi đơn đăng ký"}
                                </Button>
                            </Form>
                        )
                    ) : (
                        <Alert variant="warning">Bạn chỉ có thể đặt lịch tư vấn với coach đồng hành hiện tại.</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetBookingModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast thông báo */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={2200}
                    autohide
                    bg="success"
                >
                    <Toast.Body style={{ color: "#fff" }}>
                        {toastMsg}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default ProfileOfCoach;