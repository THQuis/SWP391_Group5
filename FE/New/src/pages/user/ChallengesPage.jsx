import React, { useState, useEffect } from "react";
import {
    Container, Tabs, Tab, Card, Button, Spinner,
    Collapse, Form, Image, Row, Col, ListGroup, Alert, ProgressBar
} from "react-bootstrap";
import { FaCheckCircle, FaBullseye } from "react-icons/fa";
import "../../styles/ChallengePage.scss"
// Dummy data cho các giai đoạn & nhiệm vụ



const PHASES = [
    {
        key: "start",
        title: "Giai đoạn khởi đầu",
        missions: [
            {
                id: 1,
                title: "Xác định lý do muốn cai thuốc",
                description: "Viết ra 3 lý do lớn nhất khiến bạn quyết tâm bỏ thuốc",
                tips: "Bạn có thể tham khảo các lý do về sức khỏe, gia đình, tài chính,..."
            },
            {
                id: 2,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            },
            {
                id: 3,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            },
            {
                id: 4,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            },
            {
                id: 5,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            },
            {
                id: 6,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            },
            {
                id: 7,
                title: "Chia sẻ kế hoạch với người thân",
                description: "Thông báo với ít nhất 1 người thân về quyết định của bạn.",
                tips: "Việc này giúp bạn có thêm động lực và sự hỗ trợ."
            }
        ]
    },
    {
        key: "week1",
        title: "Tuần 1",
        missions: [
            {
                id: 3,
                title: "Theo dõi ngày không hút",
                description: "Ghi chú lại từng ngày bạn không hút thuốc trong tuần đầu.",
                tips: "Đánh dấu từng ngày để tự thưởng khi vượt qua!"
            }
        ]
    }
];

const ChallengePage = () => {
    const [activeTab, setActiveTab] = useState(PHASES[0].key);
    const [expandedMissionId, setExpandedMissionId] = useState(null);
    const [note, setNote] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [completedMissions, setCompletedMissions] = useState([]);
    const [missionNotes, setMissionNotes] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [saving, setSaving] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Giả lập 800ms để show spinner
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCompleteMission = (mission) => {
        setSaving(true);
        setTimeout(() => {
            setCompletedMissions((prev) =>
                prev.includes(mission.id) ? prev : [...prev, mission.id]
            );
            setMissionNotes((prev) => ({
                ...prev,
                [mission.id]: { note, imagePreview, imageFile }
            }));
            setShowSuccess(true);
            setSaving(false);
            setTimeout(() => {
                setShowSuccess(false);
                setExpandedMissionId(null);
            }, 1200);
        }, 700);
    };
    const handleToggleComplete = (mission) => {
        setSaving(true);
        setTimeout(() => {
            setCompletedMissions(prev =>
                prev.includes(mission.id)
                    // nếu đã hoàn thành thì bỏ đánh dấu
                    ? prev.filter(id => id !== mission.id)
                    // nếu chưa thì thêm vào
                    : [...prev, mission.id]
            );
            setMissionNotes(prev => ({
                ...prev,
                [mission.id]: { note, imagePreview, imageFile }
            }));
            setShowSuccess(true);
            setSaving(false);
            setTimeout(() => {
                setShowSuccess(false);
                setExpandedMissionId(null);
            }, 1200);
        }, 700);
    };
    if (isLoading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: '60vh' }}
            >
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải thử thách...</h4>
            </Container>
        );
    }

    return (
        <section className="challenge-page">
            <Container>
                <h2 className="challenge-page__title">Thử thách cai thuốc</h2>
                <Tabs
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    className="challenge-page__tabs"
                >
                    {PHASES.map(phase => {
                        const doneCount = phase.missions.filter(m => completedMissions.includes(m.id)).length;
                        const total = phase.missions.length;
                        return (
                            <Tab eventKey={phase.key} title={
                                <div className="d-flex align-items-center">
                                    <FaBullseye className="me-2 challenge-page__tab-icon" />
                                    {phase.title}
                                </div>
                            } key={phase.key}>
                                <Row className="justify-content-center mt-4">
                                    <Col lg={8} md={10}>
                                        <Card className="challenge-card">
                                            <Card.Header className="challenge-card__header">
                                                <div>
                                                    <h5>{phase.title}</h5>
                                                    <small>{doneCount}/{total} nhiệm vụ đã hoàn thành</small>
                                                </div>
                                                <ProgressBar
                                                    now={(doneCount / total) * 100}
                                                    label={`${Math.round((doneCount / total) * 100)}%`}
                                                    className="challenge-card__progress"
                                                />
                                            </Card.Header>
                                            <Card.Body className="challenge-card__body">
                                                <ListGroup>
                                                    {phase.missions.map(mission => (
                                                        <React.Fragment key={mission.id}>
                                                            <ListGroup.Item
                                                                className={`mission-item ${expandedMissionId === mission.id ? "is-open" : ""}`}
                                                                onClick={() => handleToggleMission(mission)}
                                                            >
                                                                <div className="d-flex justify-content-between">
                                                                    <div>
                                                                        <strong>{mission.title}</strong>
                                                                        <p className="text-muted mission-desc">{mission.description}</p>
                                                                    </div>
                                                                    {completedMissions.includes(mission.id) && (
                                                                        <FaCheckCircle className="mission-item__icon" />
                                                                    )}
                                                                </div>
                                                            </ListGroup.Item>
                                                            <Collapse in={expandedMissionId === mission.id}>
                                                                <div className="mission-detail">
                                                                    <Alert variant="info">
                                                                        <strong>Gợi ý:</strong> {mission.tips}
                                                                    </Alert>
                                                                    <Form>
                                                                        {/* --- Ghi chú --- */}
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

                                                                        {/* --- Gửi ảnh minh chứng --- */}
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
                                                                            variant={completedMissions.includes(mission.id) ? "outline-warning" : "success"}
                                                                            onClick={e => { e.stopPropagation(); handleToggleComplete(mission); }}
                                                                            disabled={saving}
                                                                        >
                                                                            {saving
                                                                                ? "Đang lưu..."
                                                                                : (completedMissions.includes(mission.id)
                                                                                    ? "Chưa hoàn thành"
                                                                                    : "Hoàn thành nhiệm vụ")}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </Collapse>

                                                        </React.Fragment>
                                                    ))}
                                                </ListGroup>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Tab>
                        );
                    })}
                </Tabs>
            </Container>
        </section>
    );
};

export default ChallengePage;