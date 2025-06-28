import React, { useState, useEffect } from "react";
import {
    Container, Tabs, Tab, Card, Button, Spinner,
    Collapse, Form, Image, Row, Col, ListGroup, Alert, ProgressBar
} from "react-bootstrap";
import { FaCheckCircle, FaBullseye } from "react-icons/fa";
import "../../styles/ChallengePage.scss";

const getUserInfo = () => ({
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('userToken'),
});

const STAGES = [
    { key: 1, title: "Giai đoạn 1" },
    { key: 2, title: "Giai đoạn 2" },
    { key: 3, title: "Giai đoạn 3" },
    { key: 4, title: "Giai đoạn 3" },
    // ... Thêm các stage khác nếu có
];

const ChallengePage = () => {
    const { userId, token } = getUserInfo();
    const [activeTab, setActiveTab] = useState(STAGES[0].key);
    const [stageData, setStageData] = useState({});
    const [loadingStage, setLoadingStage] = useState(true);
    const [expandedMissionId, setExpandedMissionId] = useState(null);
    const [note, setNote] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [missionNotes, setMissionNotes] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Fetch missions mỗi khi đổi tab (stage)
    useEffect(() => {
        if (!userId || !token) {
            setError("Bạn chưa đăng nhập hoặc thiếu thông tin người dùng.");
            setLoadingStage(false);
            return;
        }
        setLoadingStage(true);
        setError(null);

        fetch(
            `/api/user-challenges/${userId}/stage?stage=${activeTab}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        )
            .then((res) => {
                if (!res.ok) throw new Error("Không tải được dữ liệu!");
                return res.json();
            })
            .then((data) => {
                setStageData((prev) => ({
                    ...prev,
                    [activeTab]: data.data || [],
                }));
                setLoadingStage(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoadingStage(false);
            });
    }, [activeTab, userId, token]);

    // Xử lý toggle hiển thị nhiệm vụ
    const handleToggleMission = (mission) => {
        setShowSuccess(false);
        if (expandedMissionId === mission.id) {
            setExpandedMissionId(null);
        } else {
            setExpandedMissionId(mission.id);
            const saved = missionNotes[mission.id] || {};
            setNote(saved.note || "");
            setImageFile(saved.imageFile || null);
            setImagePreview(saved.imagePreview || null);
        }
    };

    // Xử lý chọn ảnh minh chứng
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Xử lý hoàn thành/bỏ hoàn thành nhiệm vụ (SYNC backend)
    const handleToggleComplete = async (mission) => {
        setSaving(true);

        // Nếu nhiệm vụ đã hoàn thành -> gọi API uncomplete, ngược lại gọi complete
        const isNowCompleted = !mission.isCompleted;

        try {
            if (isNowCompleted) {
                // Hoàn thành nhiệm vụ
                await fetch("/api/user-challenges/complete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        challengeId: mission.id,
                        notes: note || ""
                    })
                });
            } else {
                // Bỏ hoàn thành nhiệm vụ
                await fetch("/api/user-challenges/uncomplete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        challengeId: mission.id
                    })
                });
            }

            // Sau khi gọi API xong, cập nhật UI local
            setStageData((prev) => {
                const missions = prev[activeTab]?.map((m) =>
                    m.id === mission.id
                        ? { ...m, isCompleted: isNowCompleted }
                        : m
                );
                return { ...prev, [activeTab]: missions };
            });
            setMissionNotes((prev) => ({
                ...prev,
                [mission.id]: { note, imagePreview, imageFile },
            }));
            setShowSuccess(true);
            setSaving(false);
            setTimeout(() => {
                setShowSuccess(false);
                setExpandedMissionId(null);
            }, 1200);
        } catch (err) {
            setSaving(false);
            alert("Có lỗi khi cập nhật trạng thái nhiệm vụ.");
        }
    };

    // Đếm số nhiệm vụ đã hoàn thành trên từng stage
    const missions = stageData[activeTab] || [];
    const doneCount = missions.filter((m) => m.isCompleted).length;
    const total = missions.length;

    return (
        <section className="challenge-page">
            <Container>
                <h2 className="challenge-page__title">Thử thách cai thuốc</h2>
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="challenge-page__tabs"
                >
                    {STAGES.map((stage) => (
                        <Tab
                            eventKey={stage.key}
                            title={
                                <div className="d-flex align-items-center">
                                    <FaBullseye className="me-2 challenge-page__tab-icon" />
                                    {stage.title}
                                </div>
                            }
                            key={stage.key}
                        >
                            <Row className="justify-content-center mt-4">
                                <Col lg={8} md={10}>
                                    <Card className="challenge-card">
                                        <Card.Header className="challenge-card__header">
                                            <div>
                                                <h5>{stage.title}</h5>
                                                <small>
                                                    {doneCount}/{total} nhiệm vụ đã hoàn thành
                                                </small>
                                            </div>
                                            <ProgressBar
                                                now={total === 0 ? 0 : (doneCount / total) * 100}
                                                label={`${total === 0 ? 0 : Math.round((doneCount / total) * 100)}%`}
                                                className="challenge-card__progress"
                                            />
                                        </Card.Header>
                                        <Card.Body className="challenge-card__body">
                                            {loadingStage ? (
                                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                                                    <Spinner animation="border" variant="success" />
                                                    <span className="ms-3">Đang tải nhiệm vụ...</span>
                                                </div>
                                            ) : error ? (
                                                <Alert variant="danger">{error}</Alert>
                                            ) : (
                                                <ListGroup>
                                                    {missions.map((mission) => (
                                                        <React.Fragment key={mission.id}>
                                                            <ListGroup.Item
                                                                className={`mission-item ${expandedMissionId === mission.id ? "is-open" : ""} ${mission.isCompleted ? "is-completed" : ""}`}
                                                                onClick={() => handleToggleMission(mission)}
                                                                style={mission.isLocked ? { opacity: 0.5, pointerEvents: "none" } : {}}
                                                            >
                                                                <div className="d-flex justify-content-between">
                                                                    <div>
                                                                        <strong>{mission.title}</strong>
                                                                        <p className="text-muted mission-desc">{mission.description}</p>
                                                                    </div>
                                                                    {mission.isCompleted && (
                                                                        <FaCheckCircle className="mission-item__icon" />
                                                                    )}
                                                                </div>
                                                                {mission.isLocked && (
                                                                    <small className="text-warning">Nhiệm vụ này hiện đang bị khoá.</small>
                                                                )}
                                                            </ListGroup.Item>
                                                            <Collapse in={expandedMissionId === mission.id}>
                                                                <div className="mission-detail">
                                                                    {mission.challengeDate && (
                                                                        <Alert variant="info" className="mb-2">
                                                                            <strong>Ngày thử thách:</strong> {mission.challengeDate.split("T")[0]}
                                                                        </Alert>
                                                                    )}
                                                                    <Form>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Ghi chú của bạn:</Form.Label>
                                                                            <Form.Control
                                                                                as="textarea"
                                                                                rows={3}
                                                                                value={note}
                                                                                onChange={e => setNote(e.target.value)}
                                                                                placeholder="Viết ghi chú, cảm nhận..."
                                                                                disabled={saving}
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Ảnh minh chứng (tuỳ chọn):</Form.Label>
                                                                            <Form.Control
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={handleImageChange}
                                                                                disabled={saving}
                                                                            />
                                                                            {imagePreview && (
                                                                                <div className="mt-2 text-center">
                                                                                    <Image
                                                                                        src={imagePreview}
                                                                                        thumbnail
                                                                                        style={{ maxHeight: 180 }}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Form.Group>
                                                                    </Form>
                                                                    <div className="d-flex justify-content-end mt-3">
                                                                        <Button
                                                                            variant={mission.isCompleted ? "outline-warning" : "success"}
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                handleToggleComplete(mission);
                                                                            }}
                                                                            disabled={saving || mission.isLocked}
                                                                        >
                                                                            {saving
                                                                                ? "Đang lưu..."
                                                                                : (mission.isCompleted
                                                                                    ? "Chưa hoàn thành"
                                                                                    : "Hoàn thành nhiệm vụ")}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Collapse>
                                                        </React.Fragment>
                                                    ))}
                                                </ListGroup>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Tab>
                    ))}
                </Tabs>
            </Container>
        </section>
    );
};

export default ChallengePage;