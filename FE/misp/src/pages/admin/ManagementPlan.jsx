import React, { useState, useEffect } from "react";
import { Table, Tabs, Tab, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaMinus } from "react-icons/fa";

// ==== DỮ LIỆU MẪU ====

// Milestone & trạng thái
const sampleMilestones = [
    {
        id: 1,
        label: "1 tiếng",
        status: [
            { type: "Thể trạng", content: "Nhịp tim ổn định, huyết áp bình thường.", percent: 100 },
            { type: "Sức khỏe", content: "Phổi bắt đầu làm sạch khí CO.", percent: 100 }
        ]
    },
    {
        id: 2,
        label: "6 tiếng",
        status: [
            { type: "Thể trạng", content: "CO trong máu giảm một nửa.", percent: 10 },
            { type: "Sức khỏe", content: "Cơ thể bắt đầu hồi phục.", percent: 10 }
        ]
    }
];

// User tiến trình mẫu
const userProgressList = [
    {
        userId: 1,
        name: "Nguyễn Văn A",
        quitCount: 10,
        savedMoney: 200000,
        milestones: [
            { milestoneId: 1, status: [{ type: "Thể trạng", done: true }, { type: "Sức khỏe", done: true }] },
            { milestoneId: 2, status: [{ type: "Thể trạng", done: false }, { type: "Sức khỏe", done: false }] }
        ]
    },
    {
        userId: 2,
        name: "Trần Thị B",
        quitCount: 5,
        savedMoney: 100000,
        milestones: [
            { milestoneId: 1, status: [{ type: "Thể trạng", done: true }, { type: "Sức khỏe", done: false }] },
            { milestoneId: 2, status: [{ type: "Thể trạng", done: false }, { type: "Sức khỏe", done: false }] }
        ]
    }
];

// Kế hoạch
const fakePlans = [
    {
        id: 1,
        question: "Bạn sẽ tập gì hôm nay?",
        type: "Tự luận",
        answer: null,
    },
];

// Thử thách
const fakeChallenges = [
    {
        id: 1,
        name: "Chạy bộ 5km",
        description: "Chạy liên tục 5km trong 1 tuần",
        target: 5,
        participants: 30,
        completed: 15,
        repeat: "Tuần",
    },
];

const answerTypeOptions = [
    { value: "Tự luận", label: "Tự luận" },
    { value: "Trắc nghiệm", label: "Trắc nghiệm" },
    { value: "Ngày tháng năm", label: "Ngày tháng năm" },
];

// ==== COMPONENT CHÍNH ====

function ManagementPlan() {
    // Milestone (tiến trình) state
    const [milestones, setMilestones] = useState([]);
    const [milestoneModalShow, setMilestoneModalShow] = useState(false);
    const [editMilestone, setEditMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ label: "", status: [{ type: "", content: "", percent: 0 }] });

    // Kế hoạch
    const [plans, setPlans] = useState([]);
    const [planModalShow, setPlanModalShow] = useState(false);
    const [editPlan, setEditPlan] = useState(null);
    const [formPlan, setFormPlan] = useState({
        question: "",
        type: "",
        answer: null,
    });
    const [mcAnswers, setMcAnswers] = useState([""]); // các lựa chọn trắc nghiệm

    // Thử thách
    const [challenges, setChallenges] = useState([]);
    const [challengeModalShow, setChallengeModalShow] = useState(false);
    const [editChallenge, setEditChallenge] = useState(null);
    const [formChallenge, setFormChallenge] = useState({
        name: "",
        description: "",
        target: "",
        participants: "",
        completed: "",
        repeat: "",
    });

    // User tiến trình
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Tab state
    const [activeTab, setActiveTab] = useState("milestone");

    // Load dữ liệu mẫu
    useEffect(() => {
        setMilestones([]); // Nếu có API thì load ở đây
        setUsers([]);      // Nếu có API thì load ở đây
        setPlans(fakePlans);
        setChallenges(fakeChallenges);
    }, []);

    // ==== Milestone CRUD ====
    const openAddMilestoneModal = () => {
        setEditMilestone(null);
        setMilestoneForm({ label: "", status: [{ type: "", content: "", percent: 0 }] });
        setMilestoneModalShow(true);
    };
    const openEditMilestoneModal = (ms) => {
        setEditMilestone(ms.id);
        setMilestoneForm({
            label: ms.label,
            status: ms.status.map(s => ({ ...s }))
        });
        setMilestoneModalShow(true);
    };
    const handleMilestoneFormStatusChange = (idx, field, value) => {
        const arr = [...milestoneForm.status];
        arr[idx][field] = value;
        setMilestoneForm({ ...milestoneForm, status: arr });
    };
    const handleAddMilestoneStatusRow = () => {
        setMilestoneForm({ ...milestoneForm, status: [...milestoneForm.status, { type: "", content: "", percent: 0 }] });
    };
    const handleRemoveMilestoneStatusRow = (idx) => {
        if (milestoneForm.status.length > 1) {
            const arr = [...milestoneForm.status];
            arr.splice(idx, 1);
            setMilestoneForm({ ...milestoneForm, status: arr });
        }
    };
    const handleMilestoneModalSave = () => {
        if (editMilestone) {
            setMilestones(milestones.map(ms =>
                ms.id === editMilestone ? { ...ms, label: milestoneForm.label, status: [...milestoneForm.status] } : ms
            ));
        } else {
            setMilestones([
                ...milestones,
                { id: Date.now(), label: milestoneForm.label, status: [...milestoneForm.status] }
            ]);
        }
        setMilestoneModalShow(false);
    };
    const handleDeleteMilestone = (id) => {
        setMilestones(milestones.filter(ms => ms.id !== id));
    };

    // ==== Kế hoạch CRUD ====
    const openAddPlanModal = () => {
        setEditPlan(null);
        setPlanModalShow(true);
        setFormPlan({
            question: "",
            type: "",
            answer: null,
        });
        setMcAnswers([""]);
    };
    const openEditPlanModal = (plan) => {
        setEditPlan(plan.id);
        setPlanModalShow(true);
        setFormPlan({
            question: plan.question,
            type: plan.type,
            answer: plan.answer,
        });
        setMcAnswers(Array.isArray(plan.answer) ? plan.answer : [""]);
    };
    const handlePlanTypeChange = (value) => {
        setFormPlan({ ...formPlan, type: value, answer: null });
        if (value === "Trắc nghiệm") {
            setMcAnswers([""]);
        }
    };
    const handleAddMcAnswer = () => setMcAnswers([...mcAnswers, ""]);
    const handleRemoveMcAnswer = (idx) => {
        if (mcAnswers.length > 1) {
            const arr = [...mcAnswers];
            arr.splice(idx, 1);
            setMcAnswers(arr);
        }
    };
    const handleMcAnswerChange = (idx, value) => {
        const arr = [...mcAnswers];
        arr[idx] = value;
        setMcAnswers(arr);
    };
    const handlePlanModalSave = () => {
        if (editPlan) {
            setPlans(plans.map(p =>
                p.id === editPlan
                    ? { ...formPlan, id: editPlan, answer: formPlan.type === "Trắc nghiệm" ? mcAnswers.filter(a => a.trim() !== "") : formPlan.answer }
                    : p
            ));
        } else {
            setPlans([
                ...plans,
                {
                    ...formPlan,
                    answer: formPlan.type === "Trắc nghiệm" ? mcAnswers.filter(a => a.trim() !== "") : formPlan.answer,
                    id: plans.length + 1,
                }
            ]);
        }
        setPlanModalShow(false);
    };
    const handleDeletePlan = (id) => {
        setPlans(plans.filter(p => p.id !== id));
    };
    const renderPlanAnswerCell = (plan) => {
        if (plan.type === "Trắc nghiệm" && Array.isArray(plan.answer)) {
            return plan.answer.join("; ");
        }
        return "";
    };

    // ==== Thử thách CRUD ====
    const openAddChallengeModal = () => {
        setEditChallenge(null);
        setChallengeModalShow(true);
        setFormChallenge({
            name: "",
            description: "",
            target: "",
            participants: "",
            completed: "",
            repeat: "",
        });
    };
    const openEditChallengeModal = (challenge) => {
        setEditChallenge(challenge.id);
        setChallengeModalShow(true);
        setFormChallenge({ ...challenge });
    };
    const handleChallengeModalSave = () => {
        if (editChallenge) {
            setChallenges(challenges.map(c =>
                c.id === editChallenge
                    ? { ...formChallenge, id: editChallenge }
                    : c
            ));
        } else {
            setChallenges([
                ...challenges,
                {
                    ...formChallenge,
                    id: challenges.length + 1
                }
            ]);
        }
        setChallengeModalShow(false);
    };
    const handleDeleteChallenge = (id) => {
        setChallenges(challenges.filter(c => c.id !== id));
    };

    // ===== Render milestone rows =====
    const renderMilestoneRows = () => [
        ...sampleMilestones.map((ms, idx) => (
            <tr key={"sample-" + ms.id}>
                <td>{idx + 1}</td>
                <td>{ms.label}</td>
                <td>
                    {ms.status.map((s, i) => (
                        <div key={i}>
                            <b>{s.type}</b> ({s.percent}%): {s.content}
                        </div>
                    ))}
                </td>
                <td>
                    {/* ---------------------Sửa, Xóa của cấu hình tiến trình ---------------- */}
                    <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => openEditMilestoneModal(ms)}
                        title="Sửa"
                    >
                        <FaEdit />
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteMilestone(ms.id)}
                        title="Xóa"
                    >
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        )),
        ...milestones.map((ms, idx) => (
            <tr key={ms.id}>
                <td>{sampleMilestones.length + idx + 1}</td>
                <td>{ms.label}</td>
                <td>
                    {ms.status.map((s, i) => (
                        <div key={i}>
                            <b>{s.type}</b> ({s.percent}%): {s.content}
                        </div>
                    ))}
                </td>
                <td>
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => openEditMilestoneModal(ms)}><FaEdit /></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMilestone(ms.id)}><FaTrash /></Button>
                </td>
            </tr>
        ))
    ];

    // ===== Tiến trình người dùng  =====
    const renderUserRows = () => [
        ...userProgressList.map((u, idx) => (
            <tr key={"sample-user-" + u.userId}>
                <td>{idx + 1}</td>
                <td>{u.name}</td>
                <td>{u.quitCount}</td>
                <td>{u.savedMoney.toLocaleString()} vnđ</td>
                <td>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedUser(u)}>
                        Xem chi tiết
                    </Button>
                </td>
            </tr>
        )),
        ...users.map((u, idx) => (
            <tr key={u.userId}>
                <td>{userProgressList.length + idx + 1}</td>
                <td>{u.name}</td>
                <td>{u.quitCount}</td>
                <td>{u.savedMoney.toLocaleString()} vnđ</td>
                <td>
                    <Button variant="outline-primary" size="sm" onClick={() => setSelectedUser(u)}>
                        Xem chi tiết
                    </Button>
                </td>
            </tr>
        ))
    ];

    // ===== Render thử thách rows =====
    const renderChallengeRows = () => [
        ...challenges.map((c, idx) => (
            <tr key={c.id} className="align-middle text-center">
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>{c.target}</td>
                <td>{c.participants}</td>
                <td>{c.completed}</td>
                <td>{c.repeat}</td>
                <td>
                    <Button variant="link" size="sm" onClick={() => openEditChallengeModal(c)}>
                        <FaEdit />
                    </Button>
                    <Button variant="link" size="sm" onClick={() => handleDeleteChallenge(c.id)}>
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        )),
        ...(challenges.length === 0
            ? [<tr key="no-challenge"><td colSpan={7} className="text-center text-secondary">Chưa có dữ liệu</td></tr>]
            : [])
    ];

    // ===== Render kế hoạch rows =====
    const renderPlanRows = () => [
        ...plans.map((p, idx) => (
            <tr key={p.id} className="align-middle text-center">
                <td>{idx + 1}</td>
                <td>{p.question}</td>
                <td>{p.type}</td>
                <td>{renderPlanAnswerCell(p)}</td>
                <td>
                    <Button variant="link" size="sm" onClick={() => openEditPlanModal(p)}>
                        <FaEdit />
                    </Button>
                    <Button variant="link" size="sm" onClick={() => handleDeletePlan(p.id)}>
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        )),
        ...(plans.length === 0
            ? [<tr key="no-plan"><td colSpan={5} className="text-center text-secondary">Chưa có dữ liệu</td></tr>]
            : [])
    ];

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-success text-center">Quản lý tiến trình </h2>
            <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-3"
                justify
            >
                <Tab eventKey="milestone" title="Cấu hình tiến trình">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Các mốc tiến trình (Milestone)</h5>
                        <Button variant="outline-primary" onClick={openAddMilestoneModal}><FaPlus /> Thêm mốc</Button>
                    </div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mốc</th>
                                <th>Danh sách trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderMilestoneRows()}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="progress" title="Tiến trình người dùng">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th>Số điều đã bỏ</th>
                                <th>Số tiền tiết kiệm</th>
                                <th>Xem tiến trình chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderUserRows()}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="plan" title="Kế hoạch">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Kế hoạch khảo sát</h5>
                        <Button
                            variant="outline-primary"
                            className="rounded-pill px-4"
                            onClick={openAddPlanModal}
                        >
                            Thêm <FaPlus />
                        </Button>
                    </div>
                    <Table bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>STT</th>
                                <th>Câu hỏi</th>
                                <th>Loại đáp án</th>
                                <th>Đáp án (nếu là trắc nghiệm)</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderPlanRows()}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="challenge" title="Thử thách">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Danh sách thử thách</h5>
                        <Button
                            variant="outline-primary"
                            className="rounded-pill px-4"
                            onClick={openAddChallengeModal}
                        >
                            Thêm <FaPlus />
                        </Button>
                    </div>
                    <Table bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>Tên thử thách</th>
                                <th>Mô tả</th>
                                <th>Số điểm</th>
                                <th>Số người được duyệt</th>
                                <th>Số người đã thực hiện</th>
                                <th>Lặp</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderChallengeRows()}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {/* ===== MODAL THÊM/SỬA MILESTONE ===== */}
            <Modal show={milestoneModalShow} onHide={() => setMilestoneModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editMilestone ? "Sửa mốc tiến trình" : "Thêm mốc tiến trình"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên mốc</Form.Label>
                            <Form.Control
                                value={milestoneForm.label}
                                onChange={e => setMilestoneForm({ ...milestoneForm, label: e.target.value })}
                                placeholder="VD: 1 tiếng, 6 tiếng, 24 tiếng..."
                            />
                        </Form.Group>
                        <Form.Label>Danh sách trạng thái</Form.Label>
                        {milestoneForm.status.map((s, idx) => (
                            <InputGroup className="mb-2" key={idx}>
                                <Form.Control
                                    style={{ maxWidth: "120px" }}
                                    value={s.type}
                                    onChange={e => handleMilestoneFormStatusChange(idx, "type", e.target.value)}
                                    placeholder="Loại trạng thái"
                                />
                                <Form.Control
                                    style={{ maxWidth: "80px" }}
                                    type="number"
                                    value={s.percent}
                                    onChange={e => handleMilestoneFormStatusChange(idx, "percent", e.target.value)}
                                    placeholder="%"
                                />
                                <Form.Control
                                    value={s.content}
                                    onChange={e => handleMilestoneFormStatusChange(idx, "content", e.target.value)}
                                    placeholder="Nội dung trạng thái"
                                />
                                <Button
                                    variant="outline-danger"
                                    onClick={() => handleRemoveMilestoneStatusRow(idx)}
                                    disabled={milestoneForm.status.length === 1}
                                    style={{ borderRadius: "50%" }}
                                >
                                    <FaMinus />
                                </Button>
                            </InputGroup>
                        ))}
                        <Button variant="outline-primary" size="sm" className="my-1" onClick={handleAddMilestoneStatusRow}>
                            <FaPlus /> Thêm trạng thái
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMilestoneModalShow(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleMilestoneModalSave}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ===== MODAL THÊM/SỬA KẾ HOẠCH ===== */}
            <Modal
                show={planModalShow}
                onHide={() => setPlanModalShow(false)}
                centered
                backdrop="static"
            >
                <Modal.Header
                    className="bg-info-subtle"
                    style={{ borderBottom: 0, justifyContent: "center" }}
                >
                    <Modal.Title className="w-100 text-center fst-italic">
                        {editPlan ? "Sửa kế hoạch" : "Thêm kế hoạch"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={4} className="fst-italic">
                                Câu hỏi
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    value={formPlan.question}
                                    onChange={e =>
                                        setFormPlan({ ...formPlan, question: e.target.value })
                                    }
                                    className="rounded-pill"
                                    placeholder="Nhập câu hỏi"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={4} className="fst-italic">
                                Loại đáp án
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Select
                                    value={formPlan.type}
                                    onChange={e => handlePlanTypeChange(e.target.value)}
                                    className="rounded-pill"
                                >
                                    <option value="">Chọn loại đáp án</option>
                                    {answerTypeOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        {formPlan.type === "Trắc nghiệm" && (
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                <Form.Label column sm={4} className="fst-italic">
                                    Lựa chọn
                                </Form.Label>
                                <Col sm={8}>
                                    {mcAnswers.map((ans, idx) => (
                                        <InputGroup className="mb-2" key={idx}>
                                            <Form.Control
                                                value={ans}
                                                onChange={e => handleMcAnswerChange(idx, e.target.value)}
                                                className="rounded-pill"
                                                placeholder={`Lựa chọn ${idx + 1}`}
                                            />
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => handleRemoveMcAnswer(idx)}
                                                disabled={mcAnswers.length === 1}
                                                style={{ borderRadius: "50%", marginLeft: 8, padding: "0 10px" }}
                                            >
                                                <FaMinus />
                                            </Button>
                                        </InputGroup>
                                    ))}
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="rounded-pill fw-semibold mt-1"
                                        onClick={handleAddMcAnswer}
                                    >
                                        <FaPlus /> Thêm lựa chọn
                                    </Button>
                                </Col>
                            </Form.Group>
                        )}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                className="rounded-pill px-4 fw-semibold"
                                onClick={() => setPlanModalShow(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 fw-semibold"
                                onClick={handlePlanModalSave}
                            >
                                {editPlan ? "Lưu" : "Thêm"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ===== MODAL THÊM/SỬA THỬ THÁCH ===== */}
            <Modal
                show={challengeModalShow}
                onHide={() => setChallengeModalShow(false)}
                centered
                backdrop="static"
            >
                <Modal.Header
                    className="bg-info-subtle"
                    style={{ borderBottom: 0, justifyContent: "center" }}
                >
                    <Modal.Title className="w-100 text-center fst-italic">
                        {editChallenge ? "Sửa thử thách" : "Thêm thử thách"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={4} className="fst-italic">
                                Tên
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    value={formChallenge.name}
                                    onChange={e =>
                                        setFormChallenge({ ...formChallenge, name: e.target.value })
                                    }
                                    className="rounded-pill"
                                    placeholder="Nhập tên thử thách"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={4} className="fst-italic">
                                Điểm
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="number"
                                    value={formChallenge.target}
                                    onChange={e =>
                                        setFormChallenge({ ...formChallenge, target: e.target.value })
                                    }
                                    className="rounded-pill"
                                    placeholder="Nhập điểm"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={4} className="fst-italic">
                                Mô tả
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    value={formChallenge.description}
                                    onChange={e =>
                                        setFormChallenge({
                                            ...formChallenge,
                                            description: e.target.value,
                                        })
                                    }
                                    className="rounded-pill"
                                    placeholder="Nhập mô tả"
                                />
                            </Col>
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                className="rounded-pill px-4 fw-semibold"
                                onClick={() => setChallengeModalShow(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="primary"
                                className="rounded-pill px-4 fw-semibold"
                                onClick={handleChallengeModalSave}
                            >
                                {editChallenge ? "Lưu" : "Thêm"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ===== MODAL XEM TIẾN TRÌNH USER ===== */}
            <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tiến trình của: {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <b>Số điều đã bỏ:</b> {selectedUser?.quitCount} &nbsp;&nbsp;
                        <b>Số tiền tiết kiệm:</b> {selectedUser?.savedMoney?.toLocaleString()} vnđ
                    </div>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Mốc</th>
                                <th>Trạng thái</th>
                                <th>Hoàn thành</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...sampleMilestones, ...milestones].map(ms => (
                                ms.status.map((st, idx) => {
                                    const userMs = selectedUser?.milestones.find(m => m.milestoneId === ms.id);
                                    const userStatus = userMs ? userMs.status.find(s => s.type === st.type) : null;
                                    return (
                                        <tr key={ms.id + "-" + st.type}>
                                            <td>{idx === 0 ? ms.label : ""}</td>
                                            <td>
                                                <b>{st.type}</b> ({st.percent}%): {st.content}
                                            </td>
                                            <td>
                                                {userStatus?.done ? (
                                                    <span className="badge bg-success">Đã hoàn thành</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Chưa đạt</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ManagementPlan;