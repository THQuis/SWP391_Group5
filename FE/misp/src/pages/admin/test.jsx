import React, { useState, useEffect } from "react";
import { Table, Tabs, Tab, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaMinus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
    const [userPlans, setUserPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [userProgressHistory, setUserProgressHistory] = useState([]);


    const [milestones, setMilestones] = useState([]);
    const [milestoneModalShow, setMilestoneModalShow] = useState(false);
    const [editMilestone, setEditMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ label: "", status: [{ type: "", content: "", percent: 0 }] });

    // // Kế hoạch

    const [questions, setQuestions] = useState([]);
    const [planModalShow, setPlanModalShow] = useState(false);
    const [editPlan, setEditPlan] = useState(null);
    const [formPlan, setFormPlan] = useState({
        questionText: "", // Đổi tên từ question thành questionText cho khớp API
        questionType: "", // Đổi tên từ type thành questionType cho khớp API
    });
    const [mcAnswers, setMcAnswers] = useState([""]);

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
    // useEffect(() => {
    //     setMilestones([]); // Nếu có API thì load ở đây
    //     setUsers([]);      // Nếu có API thì load ở đây
    //     setPlans(fakePlans);
    //     setChallenges(fakeChallenges);
    // }, []);
    useEffect(() => {
        const token = localStorage.getItem("userToken");

        fetch("/api/admin/quitplan/ListAllPlans", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                const filtered = data.map(p => ({
                    userID: p.userID,
                    startDate: p.startDate,
                    reason: p.reason,
                    status: p.status,
                    cigarettesPerDayAtStart: p.cigarettesPerDayAtStart,
                    pricePerPackAtStart: p.pricePerPackAtStart,
                    cigarettesPerPack: p.cigarettesPerPack,
                    quitProgresses: p.quitProgresses
                }));
                setUserPlans(filtered);
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách kế hoạch:", err);
            });
    }, []);
    //  THÊM useEffect ĐỂ GỌI API LẤY DANH SÁCH CÂU HỎI ====
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
            return;
        }

        // Thay bằng URL đầy đủ của API của bạn nếu cần
        const apiUrl = "/api/admin/AdminQuestionnaire/all";

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setQuestions(data); // Lưu dữ liệu vào state
            })
            .catch(error => {
                console.error('Lỗi khi tải danh sách câu hỏi:', error);
                toast.error('Không thể tải được danh sách câu hỏi từ server.');
            });
    }, []); // Mảng rỗng để useEffect chỉ chạy 1 lần khi component mount


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
        setEditPlan(null); // Đảm bảo đang ở chế độ thêm mới
        setPlanModalShow(true);
        setFormPlan({
            questionText: "",
            questionType: "",
        });
        setMcAnswers([""]);
    };

    // THAY ĐỔI 1: CẬP NHẬT HÀM MỞ MODAL SỬA
    const openEditPlanModal = (question) => {
        setEditPlan(question); // Lưu lại toàn bộ object câu hỏi đang sửa
        setPlanModalShow(true);

        // Điền thông tin của câu hỏi vào form
        setFormPlan({
            questionText: question.questionText,
            questionType: question.questionType,
        });

        // Điền các lựa chọn trả lời vào form
        if (question.answerOptions && question.answerOptions.length > 0) {
            setMcAnswers(question.answerOptions.map(opt => opt.answerText));
        } else {
            setMcAnswers([""]);
        }
    };

    const handleDeletePlan = (questionId) => {
        // ... (Cần code để gọi API xóa)g
        toast.info("Chức năng xóa chưa được kết nối với API.");
    };

    // Sửa lại hàm này để nhận trực tiếp `value` thay vì `event`
    const handlePlanTypeChange = (value) => {
        // Bây giờ `value` chính là giá trị mới, không cần e.target.value nữa
        const newType = value;
        setFormPlan({ ...formPlan, questionType: newType });

        if (newType !== "SingleChoice" && newType !== "MultipleChoice") {
            setMcAnswers([]);
        } else if (mcAnswers.length === 0) {
            // Nếu chuyển sang loại trắc nghiệm mà chưa có lựa chọn nào thì thêm 1 lựa chọn trống
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
        // Nếu không có editPlan, đây là trường hợp "Thêm mới"
        if (!editPlan) {
            toast.info("Chức năng 'Thêm mới' chưa được triển khai.");
            // Nơi để code logic thêm mới sau này
            setPlanModalShow(false);
            return;
        }

        // Nếu có editPlan, đây là trường hợp "Sửa"
        const token = localStorage.getItem("userToken");
        if (!token) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        // Xây dựng payload gửi đi, đúng với cấu trúc API yêu cầu
        const payload = {
            questionID: editPlan.questionID,
            questionText: formPlan.questionText,
            questionType: formPlan.questionType,
            displayOrder: editPlan.displayOrder, // Giữ lại displayOrder và isActive từ bản gốc
            isActive: editPlan.isActive,
            answerOptions: mcAnswers.map((text, index) => {
                const originalAnswer = editPlan.answerOptions[index];
                return {
                    // Nếu có câu trả lời gốc, giữ lại ID. Nếu là câu trả lời mới, ID là 0
                    answerOptionID: originalAnswer ? originalAnswer.answerOptionID : 0,
                    answerText: text,
                    // Giữ lại displayOrder của câu trả lời, nếu là câu mới thì tự tăng
                    displayOrder: originalAnswer ? originalAnswer.displayOrder : index + 1,
                };
            }),
        };

        const apiUrl = `/api/admin/AdminQuestionnaire/update/${editPlan.questionID}`;

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (!response.ok) {
                    // Nếu có lỗi, thử đọc message từ body response
                    return response.json().then(err => { throw new Error(err.message || 'Cập nhật thất bại') });
                }
                return response.json();
            })
            .then(data => {
                toast.success(data.message || "Cập nhật câu hỏi thành công!");

                // Cập nhật lại state `questions` trên giao diện để không cần tải lại trang
                setQuestions(prevQuestions =>
                    prevQuestions.map(q =>
                        q.questionID === editPlan.questionID ? payload : q
                    )
                );

                setPlanModalShow(false); // Đóng modal sau khi thành công
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật câu hỏi:', error);
                toast.error(error.message || 'Đã có lỗi xảy ra khi cập nhật.');
            });
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
    // bảng Tiến trình người dùng
    const handleDeleteUserProgress = (userId) => {
        if (!window.confirm("Bạn có chắc muốn xoá kế hoạch và tiến trình của người dùng này?")) return;

        const token = localStorage.getItem("userToken");

        fetch(`/api/admin/quitplan/DeleteQuitPlanAndProgressUserID?userId=${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.ok) {
                    setUserPlans(prev => prev.filter(p => p.userID !== userId));
                    toast.success("Xóa tiến trình thành công!");  // Hiển thị thông báo thành công
                } else {
                    toast.error("Xóa thất bại. Vui lòng thử lại.");  // Hiển thị thông báo lỗi
                }
            })
            .catch(err => {
                console.error("Lỗi khi xóa:", err);
                toast.error("Đã xảy ra lỗi khi xoá.");
            });
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
    const renderUserRows = () => (
        userPlans.length === 0 ? (
            <tr>
                <td colSpan={8} className="text-center text-muted">Không có dữ liệu</td>
            </tr>
        ) : userPlans.map((plan, idx) => (
            <tr key={idx}>
                <td>{plan.userID}</td>
                <td>{new Date(plan.startDate).toLocaleDateString("vi-VN")}</td>
                <td>{plan.cigarettesPerDayAtStart}</td>
                <td>{plan.pricePerPackAtStart.toLocaleString()} vnđ</td>
                <td>{plan.cigarettesPerPack}</td>
                <td>{plan.quitProgresses ? "Có" : "Không"}</td>
                <td>{plan.reason}</td>
                <td>{plan.status}</td>
                <td>{new Date(plan.createdDate).toLocaleDateString("vi-VN")}</td>
                <td>
                    <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => {
                            setSelectedUser(plan); // giữ lại user đang chọn
                            const token = localStorage.getItem("userToken");
                            fetch(`/api/admin/quitplan/GetUserIDProgress?userId=${plan.userID}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            })
                                .then(res => res.json())
                                .then(data => setUserProgressHistory(data))
                                .catch(err => console.error("Lỗi tải tiến trình:", err));
                        }}
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUserProgress(plan.userID)}
                    >
                        Xoá
                    </Button>

                </td>
            </tr>
        ))
    );



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
    const renderQuestionRows = () => {
        if (questions.length === 0) {
            return (
                <tr key="no-plan">
                    <td colSpan={5} className="text-center text-secondary">
                        Chưa có dữ liệu hoặc đang tải...
                    </td>
                </tr>
            );
        }
        return questions.map((question, idx) => (
            <tr key={question.questionID} className="align-middle">
                <td className="text-center">{idx + 1}</td>
                <td>{question.questionText}</td>
                <td className="text-center">{question.questionType}</td>
                <td>
                    {/* Hiển thị các lựa chọn trả lời nếu có */}
                    {question.answerOptions && question.answerOptions.length > 0
                        ? (
                            <ul className="list-unstyled mb-0">
                                {question.answerOptions.map(opt => (
                                    <li key={opt.answerOptionID}>- {opt.answerText}</li>
                                ))}
                            </ul>
                        )
                        : "Không có đáp án trắc nghiệm"
                    }
                </td>
                <td className="text-center">
                    <Button variant="link" size="sm" title="Sửa" onClick={() => openEditPlanModal(question)}>
                        <FaEdit />
                    </Button>
                    <Button variant="link" size="sm" title="Xoá" onClick={() => handleDeletePlan(question.questionID)}>
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        ));
    };

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
                                <th>Mã người dùng</th>
                                <th>Ngày bắt đầu</th>
                                <th>Điếu/ngày</th>
                                <th>Giá mỗi gói</th>
                                <th>Số điếu/gói</th>
                                <th>Tiến trình</th>
                                <th>Lý do</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderUserRows()}
                        </tbody>
                    </Table>
                    <ToastContainer />
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
                                <th style={{ width: '5%' }}>STT</th>
                                <th style={{ width: '35%' }}>Câu hỏi</th>
                                <th style={{ width: '15%' }}>Loại đáp án</th>
                                <th>Đáp án (nếu là trắc nghiệm)</th>
                                <th style={{ width: '10%' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Gọi hàm render mới */}
                            {renderQuestionRows()}
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
                                    value={formPlan.questionType}
                                    // SỬA LẠI DÒNG NÀY: Dùng arrow function để truyền e.target.value
                                    onChange={e => handlePlanTypeChange(e.target.value)}
                                    className="rounded-pill"
                                >
                                    <option value="">Chọn loại đáp án</option>
                                    {/* Thêm các loại câu hỏi của bạn ở đây */}
                                    <option value="SingleChoice">SingleChoice</option>
                                    <option value="MultipleChoice">MultipleChoice</option>
                                    {/* Ví dụ thêm các loại khác nếu có */}
                                    <option value="Tự luận">Tự luận</option>
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

            {/* ===== MODAL XEM CHI TIẾT tiến trình lịch sửsử===== */}
            <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tiến trình của người dùng #{selectedUser?.userID}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>Ngày bắt đầu:</b> {new Date(selectedUser?.startDate).toLocaleDateString("vi-VN")}</p>
                    <p><b>Số điếu/ngày:</b> {selectedUser?.cigarettesPerDayAtStart}</p>
                    <p><b>Giá mỗi gói:</b> {selectedUser?.pricePerPackAtStart?.toLocaleString()} vnđ</p>
                    <p><b>Số điếu/gói:</b> {selectedUser?.cigarettesPerPack}</p>
                    <hr />
                    <h5>Lịch sử tiến trình</h5>
                    <Table bordered hover>
                        <thead>
                            <tr className="text-center">
                                <th>Ngày</th>
                                <th>Điếu baseline</th>
                                <th>Điếu hôm nay</th>
                                <th>Điếu bỏ hôm nay</th>
                                <th>Tổng bỏ</th>
                                <th>Tiền tiết kiệm</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userProgressHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted">
                                        Không có dữ liệu tiến trình
                                    </td>
                                </tr>
                            ) : (
                                userProgressHistory.map((item, idx) => (
                                    <tr key={idx} className="text-center">
                                        <td>{new Date(item.progressDate).toLocaleDateString("vi-VN")}</td>
                                        <td>{item.cigarettesPerDayBaseline ?? "N/A"}</td>
                                        <td>{item.cigarettesSmokedToday ?? "N/A"}</td>
                                        <td>{item.cigarettesDropped ?? "N/A"}</td>
                                        <td>{item.totalCigarettesDropped ?? "N/A"}</td>
                                        <td>{item.totalMoneySaved != null ? item.totalMoneySaved.toLocaleString() + " vnđ" : "0 vnđ"}</td>
                                        <td>{item.notes || "Không có ghi chú"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>



        </div>
    );
}

export default ManagementPlan;