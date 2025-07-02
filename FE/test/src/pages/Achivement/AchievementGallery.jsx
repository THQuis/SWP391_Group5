import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Modal, Image, Spinner, Alert } from "react-bootstrap";
const getUserInfo = () => ({
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('userToken'),
});

// CSS cho hiệu ứng xám
const grayscaleStyle = {
    filter: "grayscale(100%)",
    opacity: 0.6,
    cursor: "not-allowed"
};

const AchievementGallery = () => {
    const { userId, token } = getUserInfo();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!userId || !token) {
            setError("Bạn chưa đăng nhập.");
            setLoading(false);
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/user-achievement/all-status/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.ok ? res.json() : Promise.reject("API lỗi"))
            .then(data => {
                setAchievements(data || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải dữ liệu huy hiệu.");
                setLoading(false);
            });
    }, [userId, token]);

    const handleClick = (ach) => {
        setSelected(ach);
        setShowModal(true);
    };

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            <h2 className="fw-bold mb-4 text-center">Bộ sưu tập huy hiệu</h2>
            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Row>
                    {achievements.map(ach => (
                        <Col xs={6} md={4} lg={3} key={ach.achievementID} className="mb-4">
                            <Card
                                className="h-100 text-center"
                                style={{ cursor: "pointer", border: ach.isUnlocked ? "2px solid #4cd137" : "1px solid #ddd" }}
                                onClick={() => handleClick(ach)}
                            >
                                <Card.Body>
                                    <Image
                                        src={ach.badgeImage}
                                        alt={ach.achievementName}
                                        rounded
                                        style={ach.isUnlocked ? { width: 90, height: 90 } : { ...grayscaleStyle, width: 90, height: 90 }}
                                    />
                                    <Card.Title className="mt-3" style={{ fontSize: "1rem" }}>
                                        {ach.achievementName}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal xem chi tiết */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
                {selected && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selected.achievementName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Image
                                src={selected.badgeImage}
                                alt={selected.achievementName}
                                fluid
                                style={selected.isUnlocked ? { maxHeight: 240 } : { ...grayscaleStyle, maxHeight: 240 }}
                            />
                            <div className="mt-3">
                                {/* <h5>Mô tả:</h5> */}
                                <p>{selected.description}</p>
                                {/* <p>
                                    <b>Loại:</b> {selected.packageType}
                                </p> */}
                                <p>
                                    <b>Trạng thái:</b>{" "}
                                    {selected.isUnlocked ?
                                        <span className="text-success">Đã mở khóa</span>
                                        : <span className="text-secondary">Chưa mở khóa</span>
                                    }
                                </p>
                            </div>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default AchievementGallery;