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
    // ... các import giữ nguyên

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
                const res = await fetch("/api/user-challenges/complete", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData
                });
                const result = await res.json();
                if (result.success) {
                    // Cập nhật UI cho mission vừa hoàn thành, show ngay notes và ảnh vừa gửi
                    setStageList(prev =>
                        prev.map(stage => ({
                            ...stage,
                            challenges: stage.challenges.map(m =>
                                m.id === mission.id
                                    ? {
                                        ...m,
                                        isCompleted: true,
                                        notes: note,
                                        imageUrl: result.imageUrl || m.imageUrl
                                    }
                                    : m
                            )
                        }))
                    );
                    setShowSuccess(true);
                    setSaving(false);
                    setTimeout(() => {
                        setShowSuccess(false);
                        setExpandedMissionId(null);
                    }, 1200);
                    // Có thể reload lại toàn bộ nếu muốn đồng bộ tuyệt đối, hoặc bỏ step này cho nhanh
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
                            setLoading(false);
                        });
                    return;
                }
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
            // reload all stage data (cũ)
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
                                                    await fetch(`/api/user-challenges/${userId}/assign-stage?stage=${activeStageObj.stage}`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json",
                                                        }
                                                    });
                                                    const res = await fetch(`/api/user-challenges/${userId}/all`, {
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
                                    {(() => {
                                        let previousCompleted = true;
                                        return missions.map((mission, idx) => {
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
                                            // *** Đóng mission nếu mission trước chưa hoàn thành ***
                                            if (!previousCompleted) {
                                                isLocked = true;
                                            }

                                            // Lưu trạng thái đã hoàn thành cho mission tiếp theo
                                            previousCompleted = mission.isCompleted;

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
                                                                    <div className="form-wrapper">
                                                                        <div className="form-header">
                                                                            <div className="form-icon">
                                                                                <FaCheckCircle />
                                                                            </div>
                                                                            <h5>Hoàn thành thử thách</h5>
                                                                            <p>Chia sẻ cảm nhận và minh chứng của bạn</p>
                                                                        </div>

                                                                        <Form className="modern-form">
                                                                            <div className="form-section">
                                                                                <Form.Group className="form-group-modern">
                                                                                    <Form.Label className="form-label-modern">
                                                                                        <div className="label-content">
                                                                                            <FaPencilAlt className="label-icon" />
                                                                                            <span>Ghi chú cảm nhận</span>
                                                                                        </div>
                                                                                        <span className="label-optional">Tùy chọn</span>
                                                                                    </Form.Label>
                                                                                    <div className="input-wrapper">
                                                                                        <Form.Control
                                                                                            as="textarea"
                                                                                            rows={4}
                                                                                            value={note}
                                                                                            onChange={e => setNote(e.target.value)}
                                                                                            placeholder="Chia sẻ cảm nhận, học hỏi và động lực của bạn khi hoàn thành thử thách này..."
                                                                                            disabled={saving}
                                                                                            className="note-input-modern"
                                                                                        />
                                                                                        <div className="character-count">
                                                                                            {note.length}/500
                                                                                        </div>
                                                                                    </div>
                                                                                </Form.Group>
                                                                            </div>

                                                                            <div className="form-section">
                                                                                <Form.Group className="form-group-modern">
                                                                                    <Form.Label className="form-label-modern">
                                                                                        <div className="label-content">
                                                                                            <FaCamera className="label-icon" />
                                                                                            <span>Ảnh minh chứng</span>
                                                                                        </div>
                                                                                        <span className="label-optional">Tùy chọn</span>
                                                                                    </Form.Label>

                                                                                    {imagePreview ? (
                                                                                        <div className="image-preview-section">
                                                                                            <div className="preview-wrapper">
                                                                                                <Image
                                                                                                    src={imagePreview}
                                                                                                    className="image-preview-modern"
                                                                                                    alt="Ảnh minh chứng"
                                                                                                />
                                                                                                <div className="preview-overlay">
                                                                                                    <Button
                                                                                                        variant="light"
                                                                                                        size="sm"
                                                                                                        className="remove-btn"
                                                                                                        onClick={() => {
                                                                                                            setImagePreview(null);
                                                                                                            setImageFile(null);
                                                                                                        }}
                                                                                                    >
                                                                                                        <FaTimes />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            </div>
                                                                                            <p className="preview-label">Ảnh đã chọn</p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="upload-area">
                                                                                            <input
                                                                                                type="file"
                                                                                                accept="image/*"
                                                                                                onChange={handleImageChange}
                                                                                                disabled={saving}
                                                                                                className="file-input-hidden"
                                                                                                id="file-upload"
                                                                                            />
                                                                                            <label htmlFor="file-upload" className="upload-label">
                                                                                                <div className="upload-content">
                                                                                                    <div className="upload-icon">
                                                                                                        <FaCloudUploadAlt />
                                                                                                    </div>
                                                                                                    <div className="upload-text">
                                                                                                        <span className="upload-main">Chọn ảnh hoặc kéo thả</span>
                                                                                                        <span className="upload-sub">PNG, JPG, GIF (tối đa 5MB)</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </label>
                                                                                        </div>
                                                                                    )}
                                                                                </Form.Group>
                                                                            </div>

                                                                            <div className="form-actions-modern">
                                                                                <Button
                                                                                    className="submit-btn-modern"
                                                                                    variant="success"
                                                                                    size="lg"
                                                                                    onClick={e => {
                                                                                        e.stopPropagation();
                                                                                        handleToggleComplete(mission);
                                                                                    }}
                                                                                    disabled={saving || isLocked}
                                                                                >
                                                                                    {saving ? (
                                                                                        <div className="loading-content">
                                                                                            <Spinner animation="border" size="sm" />
                                                                                            <span>Đang xử lý...</span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="submit-content">
                                                                                            <FaCheckCircle className="submit-icon" />
                                                                                            <span>Hoàn thành thử thách</span>
                                                                                        </div>
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </Form>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Collapse>
                                                </React.Fragment>
                                            );
                                        })
                                    })()}
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