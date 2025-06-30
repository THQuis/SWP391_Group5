import React, { useState, useEffect } from "react";
import {
    Container, Tabs, Tab, Card, Button, Spinner,
    Collapse, Form, Image, Row, Col, ListGroup, Alert, ProgressBar, Badge
} from "react-bootstrap";
import { FaCheckCircle, FaBullseye, FaLock, FaUnlock } from "react-icons/fa";
import "../../styles/ChallengePage.scss";

const getUserInfo = () => ({
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('userToken'),
});

const ChallengePage = () => {
    const { userId, token } = getUserInfo();
    const [stageList, setStageList] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [expandedMissionId, setExpandedMissionId] = useState(null);
    const [note, setNote] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [missionNotes, setMissionNotes] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy toàn bộ thử thách các stage
    useEffect(() => {
        if (!userId || !token) {
            setError("Bạn chưa đăng nhập hoặc thiếu thông tin người dùng.");
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`/api/user-challenges/${userId}/all`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Không tải được dữ liệu!");
                return res.json();
            })
            .then(data => {
                setStageList(data.data || []);
                setActiveTab((data.data && data.data.length > 0) ? data.data[0].stage : 1);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId, token]);

    // Khi đổi mission, load note/image preview
    const handleToggleMission = (mission) => {
        setShowSuccess(false);
        if (expandedMissionId === mission.id) {
            setExpandedMissionId(null);
        } else {
            setExpandedMissionId(mission.id);
            // Lấy lại note/image từ dữ liệu backend hoặc local nếu có
            setNote(mission.notes || "");
            setImagePreview(mission.imageUrl ? `${mission.imageUrl}` : null);
            setImageFile(null);
        }
    };

    // Chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Hoàn thành/bỏ hoàn thành nhiệm vụ (SYNC backend)
    const handleToggleComplete = async (mission, stageIdx) => {
        setSaving(true);
        const isNowCompleted = !mission.isCompleted;
        try {
            if (isNowCompleted) {
                // Hoàn thành: gửi note, image
                const formData = new FormData();
                formData.append("challengeId", mission.id);
                formData.append("notes", note || "");
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                await fetch("/api/user-challenges/complete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData
                });
            } else {
                // Bỏ hoàn thành
                await fetch("/api/user-challenges/uncomplete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ challengeId: mission.id })
                });
            }
            // reload all stage data (đảm bảo sync mọi trường hợp)
            setLoading(true);
            fetch(`/api/user-challenges/${userId}/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(data => {
                    setStageList(data.data || []);
                    setShowSuccess(true);
                    setSaving(false);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setExpandedMissionId(null);
                    }, 1200);
                    setLoading(false);
                });
        } catch (err) {
            setSaving(false);
            alert("Có lỗi khi cập nhật trạng thái nhiệm vụ.");
        }
    };

    // Lấy stage đang active
    const activeStageObj = stageList.find(s => s.stage === activeTab) || {};
    const missions = activeStageObj.challenges || [];
    const doneCount = missions.filter(m => m.isCompleted).length;
    const total = missions.length;

    return (
        <section className="challenge-page">
            <Container>
                <h2 className="challenge-page__title">Thử thách cai thuốc</h2>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                        <Spinner animation="border" variant="success" />
                        <span className="ms-3">Đang tải thử thách...</span>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={k => setActiveTab(Number(k))}
                            className="challenge-page__tabs"
                            id="challenge-tabs"
                        >
                            {stageList.map((stage, idx) => (
                                <Tab
                                    eventKey={stage.stage}
                                    key={stage.stage}
                                    title={
                                        <div className="d-flex align-items-center">
                                            <FaBullseye className="me-2 challenge-page__tab-icon" />
                                            {`Giai đoạn ${stage.stage}`}
                                            <Badge
                                                bg={stage.stageStatus?.includes('Đã nhận') ? "success"
                                                    : stage.stageStatus?.includes('Chưa nhận') ? "secondary"
                                                        : "info"}
                                                className="ms-2"
                                            >
                                                {stage.stageStatus}
                                            </Badge>
                                        </div>
                                    }
                                />
                            ))}
                        </Tabs>
                        <Row className="justify-content-center mt-4">
                            <Col lg={8} md={10}>
                                <Card className="challenge-card">
                                    <Card.Header className="challenge-card__header">
                                        <div>
                                            <h5>{`Giai đoạn ${activeTab}`}</h5>
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
                                        <ListGroup>
                                            {missions.map((mission) => (
                                                <React.Fragment key={mission.id + "_" + mission.title}>
                                                    <ListGroup.Item
                                                        className={`mission-item ${expandedMissionId === mission.id ? "is-open" : ""} ${mission.isCompleted ? "is-completed" : ""}`}
                                                        onClick={() => !mission.isLocked && handleToggleMission(mission)}
                                                        style={mission.isLocked ? { opacity: 0.5, pointerEvents: "none" } : {}}
                                                    >
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <strong>{mission.title}</strong>
                                                                <p className="text-muted mission-desc">{mission.description}</p>
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {mission.isLocked && <FaLock className="me-2 text-warning" />}
                                                                {mission.isCompleted && <FaCheckCircle className="mission-item__icon" />}
                                                            </div>
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
                                                            {/* Đã hoàn thành thì chỉ xem lại ghi chú, ảnh */}
                                                            {mission.isCompleted ? (
                                                                <>
                                                                    {mission.notes && (
                                                                        <Alert variant="success" className="mb-2">
                                                                            <strong>Ghi chú:</strong> {mission.notes}
                                                                        </Alert>
                                                                    )}
                                                                    {mission.imageUrl && (
                                                                        <div className="mb-2 text-center">
                                                                            <Image
                                                                                src={mission.imageUrl}
                                                                                thumbnail
                                                                                style={{ maxHeight: 180 }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
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
                                                            )}
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
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </section>
    );
};

export default ChallengePage;