import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Spinner,
    Image,
    Modal,
    Alert,
    Toast,
    ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// DUMMY DATA
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

// Modal xác nhận chọn coach
function ConfirmCoachModal({ show, onHide, coach, onConfirm }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận chọn coach</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {coach && (
                    <>
                        <div className="d-flex align-items-center mb-3">
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
                        <Alert variant="warning">
                            Bạn có chắc chắn muốn <strong>{coach.name}</strong> sẽ trở thành coach đồng hành và hỗ trợ bạn? Sau khi chọn, bạn chỉ có thể đặt lịch tư vấn với coach này. Nếu muốn đổi coach, hãy vào trang cá nhân coach để hủy chọn.
                        </Alert>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Xác nhận chọn coach
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

// Modal cảnh báo không cho chọn coach khác
function CannotChooseCoachModal({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Không thể chọn coach mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="danger" className="mb-0">
                    Bạn đã có coach đồng hành. Nếu muốn đổi coach, hãy vào trang cá nhân coach hiện tại để hủy chọn trước.
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const UserButtonCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal xác nhận chọn coach
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);

    // Modal cảnh báo không được chọn coach khác
    const [showCannotChooseModal, setShowCannotChooseModal] = useState(false);

    // Coach đã chọn (id coach), giả lập lấy từ API/user context
    const [chosenCoachId, setChosenCoachId] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setCoaches(DUMMY_COACHES);
            setLoading(false);
        }, 500);
    }, []);

    // Khi nhấn chọn coach
    const handleChooseCoach = (coach) => {
        if (chosenCoachId) {
            setShowCannotChooseModal(true);
        } else {
            setSelectedCoach(coach);
            setShowConfirmModal(true);
        }
    };

    // Xác nhận chọn coach (gắn API ở đây)
    const handleConfirmCoach = () => {
        setShowConfirmModal(false);
        setChosenCoachId(selectedCoach.id);
        // TODO: Gọi API cập nhật coach cho user
    };

    // Khi nhấn vào tên coach -> chuyển sang trang profile coach
    const handleViewProfile = (coach) => {
        navigate(`/User/coach/profile/${coach.id}`);
    };

    // Không có nút hủy coach ở đây, chỉ vào profile coach để thao tác

    const chosenCoach = chosenCoachId
        ? coaches.find((c) => c.id === chosenCoachId)
        : null;

    // Các coach khác (không phải coach đã chọn)
    const otherCoaches = coaches.filter((c) => !chosenCoachId || c.id !== chosenCoachId);

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            <h2 className="fw-bold mb-4" style={{ fontSize: 24 }}>
                Danh sách Coach đồng hành
            </h2>
            {/* Coach đã chọn */}
            {chosenCoach && (
                <div className="mb-3 text-secondary" style={{ fontSize: 16 }}>
                    Coach đồng hành hiện tại của bạn:
                    <div
                        className="shadow-sm mt-2"
                        style={{
                            borderRadius: 16,
                            border: "1.5px solid #e8e8e8",
                            background: "#fff",
                            padding: "10px 18px",
                            maxWidth: 420,
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <Image
                            src={chosenCoach.avatar}
                            roundedCircle
                            width={46}
                            height={46}
                            style={{
                                objectFit: "cover",
                                border: "2.2px solid #2EA3A3",
                                marginRight: 8,
                            }}
                            alt={chosenCoach.name}
                        />
                        <div style={{ flex: 1 }}>
                            <div
                                className="fw-bold"
                                style={{
                                    fontSize: 17,
                                    color: "#183153",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                                onClick={() => handleViewProfile(chosenCoach)}
                            >
                                {chosenCoach.name}
                            </div>
                            <div className="text-muted" style={{ fontSize: 14 }}>
                                {chosenCoach.specialty}
                            </div>
                            <div>
                                <Badge bg="success" style={{ fontSize: 11, marginRight: 4 }}>
                                    {chosenCoach.experience} năm KN
                                </Badge>
                                <Badge bg="warning" text="dark" style={{ fontSize: 11 }}>
                                    ★ {chosenCoach.rating}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: 14, marginTop: 6, color: "#B22222" }}>
                        * Vào trang cá nhân coach để hủy chọn coach
                    </div>
                </div>
            )}
            {/* Dòng dưới: các coach khác */}
            <div className="mb-2 text-secondary" style={{ fontSize: 16, marginTop: chosenCoach ? 28 : 0 }}>
                {chosenCoach ? "Các coach khác:" : "Hãy chọn một coach phù hợp để đồng hành cùng bạn trên hành trình thay đổi!"}
            </div>
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row xs={1} sm={2} md={2} lg={3} className="g-4">
                    {otherCoaches.map((coach) => (
                        <Col key={coach.id} className="d-flex align-items-stretch">
                            <div
                                className="shadow-sm w-100"
                                style={{
                                    borderRadius: 22,
                                    border: "1.5px solid #e8e8e8",
                                    background: "#fff",
                                    padding: 24,
                                    marginBottom: 10,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
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
                                        <div
                                            className="fw-bold"
                                            style={{
                                                fontSize: 21,
                                                color: "#183153",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() => handleViewProfile(coach)}
                                        >
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
                                <div className="mb-2" style={{ minHeight: 30, fontSize: 15 }}>
                                    {coach.bio}
                                </div>
                                <div className="mb-3">
                                    {coach.tags.map((tag, idx) => (
                                        <Badge
                                            key={idx}
                                            bg="info"
                                            text="dark"
                                            style={{ fontSize: 13, marginRight: 5 }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleChooseCoach(coach)}
                                    >
                                        Chọn coach
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
            <ConfirmCoachModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                coach={selectedCoach}
                onConfirm={handleConfirmCoach}
            />
            <CannotChooseCoachModal
                show={showCannotChooseModal}
                onHide={() => setShowCannotChooseModal(false)}
            />
        </Container>
    );
};

export default UserButtonCoach;