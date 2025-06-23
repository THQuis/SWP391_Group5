import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Image,
    Badge,
    Button,
    Spinner,
    ListGroup,
    Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Giả lập data từ database (bảng User), chỉ lấy những user có RoleID = 3 (Coach)
const COACHES = [
    {
        UserID: 1,
        FullName: "Nguyễn văn A",
        Email: "nvA@gmail.com",
        PhoneNumber: "0905556666",
        ProfilePicture: null,
        Status: "Active",
    },
    {
        UserID: 2,
        FullName: "Trần Thị Bình",
        Email: "member.binh@example.com",
        PhoneNumber: "0907778888",
        ProfilePicture: null,
        Status: "Active",
    },
    {
        UserID: 3,
        FullName: "Lê Thị B",
        Email: "ltb@gmail.com",
        PhoneNumber: "0905556666",
        ProfilePicture: null,
        Status: "Active",
    },
    {
        UserID: 4,
        FullName: "Trần Trung k",
        Email: "ttk@gmail.com",
        PhoneNumber: "0907778888",
        ProfilePicture: null,
        Status: "Active",
    },
    // Có thể thêm các coach khác ở đây
];

const UserButtonCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // Giả lập fetch API
        setTimeout(() => {
            setCoaches(COACHES);
            setLoading(false);
        }, 400);
    }, []);

    return (
        <Container className="pt-4">
            <h2 className="fw-bold mb-4" style={{ fontSize: 24 }}>
                Danh sách các Chuyên gia tư vấn (Coach)
            </h2>
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row xs={1} sm={2} md={2} lg={3} className="g-4">
                    {coaches.length === 0 && (
                        <Col>
                            <Alert variant="info">Chưa có Chuyên gia tư vấn nào.</Alert>
                        </Col>
                    )}
                    {coaches.map((coach) => (
                        <Col key={coach.UserID} className="d-flex align-items-stretch">
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
                                        src={
                                            coach.ProfilePicture ||
                                            "https://randomuser.me/api/portraits/lego/6.jpg"
                                        }
                                        roundedCircle
                                        width={70}
                                        height={70}
                                        style={{
                                            objectFit: "cover",
                                            border: "3px solid #2EA3A3",
                                            marginRight: 18,
                                        }}
                                        alt={coach.FullName}
                                    />
                                    <div>
                                        <div
                                            className="fw-bold"
                                            style={{
                                                fontSize: 20,
                                                color: "#183153",
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() =>
                                                navigate(`/User/coach/profile/${coach.UserID}`)
                                            }
                                        >
                                            {coach.FullName}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: 15 }}>
                                            Email: {coach.Email}
                                        </div>
                                        <div>
                                            <Badge bg="info" style={{ fontSize: 12, marginRight: 4 }}>
                                                SĐT: {coach.PhoneNumber}
                                            </Badge>
                                            <Badge
                                                bg={coach.Status === "Active" ? "success" : "secondary"}
                                                style={{ fontSize: 12 }}
                                            >
                                                {coach.Status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate(`/User/coach/profile/${coach.UserID}`)} // Chuyển đến trang chi tiết coach
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default UserButtonCoach;