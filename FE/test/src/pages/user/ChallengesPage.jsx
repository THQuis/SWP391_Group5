import React, { useState, useEffect } from "react";
import {
    Container, Tabs, Tab, Card, Button, Spinner,
    Collapse, Form, Image, Row, Col, ListGroup, Alert, ProgressBar, Badge
} from "react-bootstrap";
import {
    FaCheckCircle, FaBullseye, FaLock,
    FaCalendarAlt, FaEdit, FaImage,
    FaUndo, FaPencilAlt, FaCamera,
    FaCloudUploadAlt, FaTimes, FaArrowRight, FaUnlock,
    // Thêm các icons mới
    FaFire, FaTrophy, FaMedal, FaStopwatch
} from "react-icons/fa";
import "../../styles/ChallengePage.scss";
import apiFetch from '../../utils/apiFetch';
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
        apiFetch(`/api/user-challenges/${userId}/all`, {
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
                await apiFetch("/api/user-challenges/complete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData
                });
            } else {
                // Bỏ hoàn thành
                await apiFetch("/api/user-challenges/uncomplete", {
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
            apiFetch(`/api/user-challenges/${userId}/all`, {
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
            <div className="challenge-header">
                <Container>
                    <div className="header-content">
                        <div className="header-main">
                            <div className="header-title">
                                <FaFire className="header-icon" />
                                <div className="title-content">
                                    <h1>Thử thách cai thuốc</h1>
                                    <p>Hành trình tích cực cho sức khỏe tốt hơn</p>
                                </div>
                            </div>
                            <div className="header-progress">
                                <div className="progress-ring">
                                    <div className="progress-value">
                                        {Math.round((doneCount / total) * 100)}%
                                    </div>
                                    <div className="progress-label">Hoàn thành</div>
                                </div>
                            </div>
                        </div>

                        <div className="stage-navigation">
                            {stageList.map((stage, idx) => (
                                <button
                                    key={stage.stage}
                                    onClick={() => setActiveTab(stage.stage)}
                                    className={`stage-btn ${activeTab === stage.stage ? 'active' : ''} ${stage.stageStatus?.includes('Đã nhận') ? 'completed' :
                                        stage.stageStatus?.includes('Chưa nhận') ? 'locked' : ''
                                        }`}
                                >
                                    <div className="stage-icon">
                                        <FaMedal />
                                    </div>
                                    <div className="stage-info">
                                        <div className="stage-name">Giai đoạn {stage.stage}</div>
                                        <div className="stage-status">{stage.stageStatus}</div>
                                    </div>
                                    {stage.stageStatus?.includes('Đã nhận') && (
                                        <div className="stage-complete">
                                            <FaCheckCircle />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="main-content">
                {loading ? (
                    <div className="loading-state">
                        <Spinner animation="border" variant="primary" />
                        <span>Đang tải thử thách...</span>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <div className="challenge-content">
                        <Card className="challenge-card">
                            <Card.Header className="challenge-card__header">
                                <div className="header-stats">
                                    <div className="stat-item">
                                        <FaTrophy className="stat-icon completed" />
                                        <div className="stat-text">
                                            <div className="stat-value">{doneCount}</div>
                                            <div className="stat-label">Hoàn thành</div>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <FaStopwatch className="stat-icon pending" />
                                        <div className="stat-text">
                                            <div className="stat-value">{total - doneCount}</div>
                                            <div className="stat-label">Chờ xử lý</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${total === 0 ? 0 : (doneCount / total) * 100}%` }}
                                    />
                                </div>
                            </Card.Header>

                            <Card.Body className="challenge-card__body">
                                {activeStageObj.stageStatus?.includes("Chưa nhận") && (
                                    <div className="unlock-stage-section">
                                        <div className="unlock-content">
                                            <FaLock className="lock-icon" />
                                            <h3>Giai đoạn {activeStageObj.stage} chưa được mở khóa</h3>
                                            <p>Bắt đầu thử thách mới để tiếp tục hành trình của bạn</p>
                                            <Button
                                                className="unlock-button"
                                                onClick={async () => {
                                                    setLoading(true);
                                                    await apiFetch(`/api/user-challenges/${userId}/assign-stage?stage=${activeStageObj.stage}`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json",
                                                        }
                                                    });
                                                    const res = await apiFetch(`/api/user-challenges/${userId}/all`, {
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json",
                                                        }
                                                    });
                                                    const data = await res.json();
                                                    setStageList(data.data || []);
                                                    setLoading(false);
                                                }}
                                                disabled={saving}
                                            >
                                                {saving ? (
                                                    <>
                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                        <span>Đang mở khóa...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="button-content">
                                                            <FaUnlock className="unlock-icon" />
                                                            <span>Mở khóa Giai đoạn {activeStageObj.stage}</span>
                                                        </div>
                                                        <div className="hover-effect">
                                                            <FaArrowRight className="arrow-icon" />
                                                        </div>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <ListGroup>
                                    {missions.map((mission) => {
                                        // Force lock nếu ngày thử thách lớn hơn hôm nay
                                        let isLocked = mission.isLocked;
                                        if (mission.challengeDate) {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const challengeDate = new Date(mission.challengeDate);
                                            challengeDate.setHours(0, 0, 0, 0);
                                            if (challengeDate > today) {
                                                isLocked = true;
                                            }
                                        }

                                        return (
                                            <React.Fragment key={mission.id + "_" + mission.title}>
                                                <ListGroup.Item
                                                    className={`mission-item ${expandedMissionId === mission.id ? "is-open" : ""} ${mission.isCompleted ? "is-completed" : ""}`}
                                                    onClick={() => !isLocked && handleToggleMission(mission)}
                                                    style={isLocked ? { opacity: 0.5, pointerEvents: "none" } : {}}
                                                >
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <strong>{mission.title}</strong>
                                                            <p className="text-muted mission-desc">{mission.description}</p>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            {isLocked && <FaLock className="me-2 text-warning" />}
                                                            {mission.isCompleted && <FaCheckCircle className="mission-item__icon" />}
                                                        </div>
                                                    </div>
                                                    {isLocked && (
                                                        <small className="text-warning">Nhiệm vụ này hiện đang bị khoá.</small>
                                                    )}
                                                </ListGroup.Item>
                                                <Collapse in={expandedMissionId === mission.id}>
                                                    <div className="mission-detail">
                                                        {mission.challengeDate && (
                                                            <div className="date-info">
                                                                <Alert variant="info" className="mb-3">
                                                                    <div className="challenge-date">
                                                                        <FaCalendarAlt className="me-2" />
                                                                        <strong>Ngày thử thách:</strong> {mission.challengeDate.split("T")[0]}
                                                                    </div>
                                                                </Alert>
                                                            </div>
                                                        )}

                                                        {mission.isCompleted ? (
                                                            <div className="completed-mission">
                                                                {mission.notes && (
                                                                    <div className="notes-section">
                                                                        <h6>
                                                                            <FaEdit className="me-2" />
                                                                            Ghi chú của bạn
                                                                        </h6>
                                                                        <div className="notes-content">
                                                                            {mission.notes}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {mission.imageUrl && (
                                                                    <div className="proof-image">
                                                                        <h6>
                                                                            <FaImage className="me-2" />
                                                                            Ảnh minh chứng
                                                                        </h6>
                                                                        <div className="image-container">
                                                                            <Image
                                                                                src={mission.imageUrl}
                                                                                className="proof-image__preview"
                                                                                alt="Minh chứng hoàn thành"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="mt-4">
                                                                    <Button
                                                                        className="undo-button w-100"
                                                                        variant="outline-warning"
                                                                        onClick={e => {
                                                                            e.stopPropagation();
                                                                            handleToggleComplete(mission);
                                                                        }}
                                                                        disabled={saving}
                                                                    >
                                                                        {saving ? (
                                                                            <>
                                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                                Đang xử lý...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaUndo className="me-2" />
                                                                                Đánh dấu chưa hoàn thành
                                                                            </>
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="complete-mission-form">
                                                                <Form>
                                                                    <Form.Group className="mb-4">
                                                                        <Form.Label>
                                                                            <FaPencilAlt className="me-2" />
                                                                            Ghi chú hoàn thành
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            rows={3}
                                                                            value={note}
                                                                            onChange={e => setNote(e.target.value)}
                                                                            placeholder="Chia sẻ cảm nhận của bạn khi hoàn thành nhiệm vụ..."
                                                                            disabled={saving}
                                                                            className="note-input"
                                                                        />
                                                                    </Form.Group>

                                                                    <Form.Group className="mb-4">
                                                                        <Form.Label>
                                                                            <FaCamera className="me-2" />
                                                                            Ảnh minh chứng (tùy chọn)
                                                                        </Form.Label>
                                                                        <div className="upload-section">
                                                                            {imagePreview ? (
                                                                                <div className="preview-container">
                                                                                    <Image
                                                                                        src={imagePreview}
                                                                                        className="image-preview"
                                                                                        alt="Preview"
                                                                                    />
                                                                                    <Button
                                                                                        variant="link"
                                                                                        className="remove-image"
                                                                                        onClick={() => {
                                                                                            setImagePreview(null);
                                                                                            setImageFile(null);
                                                                                        }}
                                                                                    >
                                                                                        <FaTimes /> Xóa ảnh
                                                                                    </Button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="upload-placeholder">
                                                                                    <Form.Control
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        onChange={handleImageChange}
                                                                                        disabled={saving}
                                                                                        className="file-input"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </Form.Group>

                                                                    <div className="form-actions">
                                                                        <Button
                                                                            className="submit-button"
                                                                            variant="success"
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                handleToggleComplete(mission);
                                                                            }}
                                                                            disabled={saving || isLocked}
                                                                        >
                                                                            {saving ? (
                                                                                <>
                                                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                                                    Đang xử lý...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaCheckCircle className="me-2" />
                                                                                    Hoàn thành nhiệm vụ
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </Form>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Collapse>
                                            </React.Fragment>
                                        );
                                    })}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default ChallengePage;