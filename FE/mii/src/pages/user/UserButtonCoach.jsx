import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Spinner,
    Image,
    Modal,
    Form,
    Alert,
} from "react-bootstrap";

// Dữ liệu mẫu coach, có thể thay bằng API backend
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
    },
];

// Modal đăng ký lịch tư vấn coach
function BookCoachModal({ show, onHide, coach }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        // TODO: Gắn API gửi đơn đăng ký lịch ở đây
        setTimeout(() => {
            setSuccess(true);
            setSubmitting(false);
        }, 800);
    };

    useEffect(() => {
        setDate("");
        setTime("");
        setNote("");
        setSuccess(false);
        setSubmitting(false);
    }, [show, coach]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Đăng ký lịch tư vấn với Coach</Modal.Title>
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
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn ngày</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                value={date}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn giờ</Form.Label>
                            <Form.Control
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú (tuỳ chọn)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Nhập thêm thông tin mong muốn..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="success"
                            type="submit"
                            disabled={submitting || !date || !time}
                            className="w-100"
                        >
                            {submitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
                        </Button>
                    </Form>
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

const UserButtonCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setCoaches(DUMMY_COACHES);
            setLoading(false);
        }, 500);
        // Nếu dùng API:
        // fetch('/api/coaches')
        //   .then(res => res.json())
        //   .then(data => { setCoaches(data); setLoading(false); });
    }, []);

    const handleBook = (coach) => {
        setSelectedCoach(coach);
        setShowModal(true);
    };

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            <h2 className="fw-bold mb-4" style={{ fontSize: 24 }}>
                Danh sách Coach đồng hành
            </h2>
            <div className="mb-3 text-secondary" style={{ fontSize: 16 }}>
                Hãy chọn một coach phù hợp để đồng hành cùng bạn trên hành trình thay đổi!
            </div>
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row xs={1} sm={2} md={2} lg={3} className="g-4">
                    {coaches.map((coach) => (
                        <Col key={coach.id} className="d-flex align-items-stretch">
                            <Card className="shadow-sm w-100" style={{ borderRadius: 20 }}>
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <Image
                                            src={coach.avatar}
                                            roundedCircle
                                            width={70}
                                            height={70}
                                            style={{
                                                objectFit: "cover",
                                                border: "3px solid #2EA3A3",
                                                marginRight: 18,
                                            }}
                                            alt={coach.name}
                                        />
                                        <div>
                                            <div className="fw-bold" style={{ fontSize: 20 }}>
                                                {coach.name}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: 15 }}>
                                                {coach.specialty}
                                            </div>
                                            <div>
                                                <Badge bg="success" style={{ fontSize: 13, marginRight: 4 }}>
                                                    {coach.experience} năm kinh nghiệm
                                                </Badge>
                                                <Badge bg="warning" text="dark" style={{ fontSize: 13 }}>
                                                    ★ {coach.rating}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ minHeight: 56, fontSize: 15 }}>
                                        {coach.bio}
                                    </div>
                                    <div className="mb-3">
                                        {coach.tags.map((tag, idx) => (
                                            <Badge
                                                key={idx}
                                                bg="info"
                                                text="dark"
                                                style={{ fontSize: 12, marginRight: 5 }}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleBook(coach)}
                                        >
                                            Đăng ký lịch tư vấn
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <BookCoachModal
                show={showModal}
                onHide={() => setShowModal(false)}
                coach={selectedCoach}
            />
        </Container>
    );
};

export default UserButtonCoach;