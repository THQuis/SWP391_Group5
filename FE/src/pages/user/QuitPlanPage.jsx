import React, { useState, useEffect, useMemo } from "react";
import { Modal, Container, Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/QuitPlanPage.scss";
import { useNavigate } from "react-router-dom";

// PHẦN 1: Thói quen hiện tại
const QuitPlanHabitSection = ({ habitData, editable, onChange }) => {
    const dailyCost = useMemo(() => {
        if (!habitData || !habitData.cigarettesPerDayAtStart || !habitData.pricePerPackAtStart || !habitData.cigarettesPerPack || habitData.cigarettesPerPack <= 0)
            return 0;
        return (habitData.pricePerPackAtStart / habitData.cigarettesPerPack) * habitData.cigarettesPerDayAtStart;
    }, [habitData]);

    const data = habitData || { cigarettesPerDayAtStart: '', pricePerPackAtStart: '', cigarettesPerPack: '' };

    return (
        <Card className="thq-card mb-4">
            <Card.Header as="h5" className="thq-card__header">1. Thói quen hiện tại</Card.Header>
            <Card.Body className="thq-card__body">
                <Form.Group as={Row} className="thq-form__group mb-3">
                    <Form.Label column sm={6} className="thq-form__label">Bạn hút bao nhiêu điếu mỗi ngày?</Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            className="thq-form__control"
                            type="number"
                            name="cigarettesPerDayAtStart"
                            value={data.cigarettesPerDayAtStart}
                            onChange={onChange}
                            disabled={!editable}
                            min="0"
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="thq-form__group mb-3">
                    <Form.Label column sm={6} className="thq-form__label">Một gói bạn hút có bao nhiêu điếu?</Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            className="thq-form__control"
                            type="number"
                            name="cigarettesPerPack"
                            value={data.cigarettesPerPack}
                            onChange={onChange}
                            disabled={!editable}
                            min="0"
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="thq-form__group mb-3">
                    <Form.Label column sm={6} className="thq-form__label">Giá tiền một gói (VND)?</Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            className="thq-form__control"
                            type="number"
                            name="pricePerPackAtStart"
                            value={data.pricePerPackAtStart}
                            onChange={onChange}
                            disabled={!editable}
                            min="0"
                        />
                    </Col>
                </Form.Group>
                {dailyCost > 0 && (
                    <Alert variant="info" className="thq-alert mt-3">
                        <p className="thq-alert__content mb-0 d-flex justify-content-between">
                            <span>Chi phí mỗi ngày (ước tính):</span>
                            <strong>{(dailyCost).toLocaleString("vi-VN")} VND</strong>
                        </p>
                    </Alert>
                )}
                {dailyCost > 0 && (
                    <Alert variant="info" className="thq-alert mt-3">
                        <p className="thq-alert__content mb-0 d-flex justify-content-between">
                            <span>Chi phí mỗi Tuần (ước tính):</span>
                            <strong>{(dailyCost * 7).toLocaleString("vi-VN")} VND</strong>
                        </p>
                    </Alert>
                )}
                {dailyCost > 0 && (
                    <Alert variant="info" className="thq-alert mt-3">
                        <p className="thq-alert__content mb-0 d-flex justify-content-between">
                            <span>Chi phí mỗi tháng (ước tính):</span>
                            <strong>{(dailyCost * 30).toLocaleString("vi-VN")} VND</strong>
                        </p>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

// PHẦN 2: Thiết lập mục tiêu
const QuitPlanGoalSection = ({ formData, onChange, editable, showEndDate }) => (
    <Card className="thq-card mb-4">
        <Card.Header as="h5" className="thq-card__header">2. Thiết lập mục tiêu</Card.Header>
        <Card.Body className="thq-card__body">
            <Form.Group className="thq-form__group mb-3">
                <Form.Label className="thq-form__label">Ngày bắt đầu cai thuốc (*)</Form.Label>
                <Form.Control
                    className="thq-form__control"
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={onChange}
                    disabled={!editable} // Chỉ vô hiệu hóa khi không thể chỉnh sửa
                />
            </Form.Group>
            {!showEndDate && (
                <Form.Group className="thq-form__group mb-3">
                    <Form.Label className="thq-form__label">Thời gian cai thuốc (chọn số tháng)</Form.Label>
                    <div>
                        {[3, 6, 9, 12].map(months => (
                            <Form.Check
                                key={months}
                                type="radio"
                                name="targetDurationMonths"
                                value={months}
                                label={`${months} tháng`}
                                checked={formData.targetDurationMonths === months}
                                onChange={onChange} // Không phải handleStaticChange
                                disabled={!editable}
                                className="thq-form__check"
                            />
                        ))}
                    </div>
                </Form.Group>
            )}
            {showEndDate && (
                <Form.Group className="thq-form__group mb-3">
                    <Form.Label className="thq-form__label">Ngày kết thúc cai thuốc</Form.Label>
                    <Form.Control
                        className="thq-form__control"
                        type="date"
                        name="endDate"
                        value={formData.endDate || ''}
                        disabled // Không thể chỉnh sửa
                    />
                </Form.Group>
            )}
        </Card.Body>
    </Card>
);
// PHẦN 3: Khảo sát
const QuitPlanSurveySection = ({
    surveyQuestions,
    dynamicAnswers,
    otherTexts,
    onDynamicChange,
    onOtherTextChange,
    editable,
}) => {
    const mapQuestionTypeToInputType = (type) => type === "SingleChoice" ? "radio" : "checkbox";

    return (
        <Card className="thq-card mb-4">
            <Card.Header as="h5" className="thq-card__header">3. Tìm hiểu về bạn</Card.Header>
            <Card.Body className="thq-card__body">
                <fieldset disabled={!editable}>
                    {surveyQuestions.length > 0 ? surveyQuestions.map(q => {
                        const otherOption = q.answerOptions.find(opt => opt.answerText.toLowerCase().includes('khác'));
                        const isOtherSelected = otherOption && (dynamicAnswers[q.questionID] || []).includes(otherOption.answerOptionID);
                        return (
                            <Form.Group key={q.questionID} className="thq-form__group mb-4">
                                <Form.Label as="legend" className="fw-bold thq-form__label">{q.questionText}</Form.Label>
                                {q.answerOptions.map(opt => {
                                    const isThisTheOtherOption = opt.answerText.toLowerCase().includes('khác');
                                    return (
                                        <div key={opt.answerOptionID}>
                                            <Form.Check
                                                className="thq-form__check"
                                                type={mapQuestionTypeToInputType(q.questionType)}
                                                id={`q-${q.questionID}-a-${opt.answerOptionID}`}
                                                label={opt.answerText}
                                                name={`question-${q.questionID}`}
                                                value={opt.answerOptionID}
                                                checked={(dynamicAnswers[q.questionID] || []).includes(opt.answerOptionID)}
                                                onChange={(e) => onDynamicChange(e, q.questionID, q.questionType, opt.answerText)}
                                            />
                                            {isThisTheOtherOption && isOtherSelected && (
                                                <Form.Control
                                                    className="thq-form__control mt-2 ms-4"
                                                    type="text"
                                                    placeholder="Vui lòng ghi rõ..."
                                                    style={{ maxWidth: "90%" }}
                                                    value={otherTexts[q.questionID] || ""}
                                                    onChange={(e) => onOtherTextChange(q.questionID, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </Form.Group>
                        );
                    }) : <p className="text-muted">Không có dữ liệu khảo sát.</p>}
                </fieldset>
            </Card.Body>
        </Card>
    );
};

// COMPONENT CHA: QUẢN LÝ TOÀN BỘ TRANG
const QuitPlanPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [planCreated, setPlanCreated] = useState(false);
    const [habitData, setHabitData] = useState(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        targetDurationMonths: null,
        dynamicAnswers: {},
        otherTexts: {}
    });
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const userId = localStorage.getItem("userId");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const loadInitialData = async () => {
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem("userToken");
        const defaultHabitData = { cigarettesPerDayAtStart: '', pricePerPackAtStart: '', cigarettesPerPack: '' };

        try {
            const [planRes, questionsRes, userAnswersRes] = await Promise.all([
                fetch(`/api/QuitPlan/user/${userId}`, { headers: { "Authorization": token } }),
                fetch('/api/Questionnaire/ListQuestion', { headers: { "Authorization": token } }),
                fetch(`/api/Questionnaire/answers-by-user?userId=${userId}`, { headers: { "Authorization": token } })
            ]);

            if (questionsRes.ok) setSurveyQuestions(await questionsRes.json());
            const planDataArray = await planRes.json().catch(() => null);
            const planData = (planDataArray && planDataArray.length > 0) ? planDataArray[0] : null;

            if (planRes.ok && planData && planData.quitPlanID) {
                setHabitData(planData);
                setFormData(prev => ({
                    ...prev,
                    startDate: planData.startDate?.slice(0, 10) || '',
                    endDate: planData.endDate?.slice(0, 10) || '',
                }));
                setPlanCreated(true);
                setEditMode(false);
            } else {
                setHabitData(defaultHabitData);
                setPlanCreated(false);
                setEditMode(true);
            }

            if (userAnswersRes.ok) {
                const savedAnswers = await userAnswersRes.json();
                if (savedAnswers && savedAnswers.length > 0) {
                    const newDynamicAnswers = {};
                    const newOtherTexts = {};
                    savedAnswers.forEach(ans => {
                        if (!newDynamicAnswers[ans.questionID]) newDynamicAnswers[ans.questionID] = [];
                        newDynamicAnswers[ans.questionID].push(ans.answerOptionID);
                        if (ans.customAnswerText) newOtherTexts[ans.questionID] = ans.customAnswerText;
                    });
                    setFormData(prev => ({ ...prev, dynamicAnswers: newDynamicAnswers, otherTexts: newOtherTexts }));
                }
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu ban đầu:", error);
            setHabitData(defaultHabitData);
            setPlanCreated(false);
            setEditMode(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadInitialData();
        else {
            setIsLoading(false);
            toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        }
    }, [userId]);

    const handleHabitChange = (e) => {
        const { name, value } = e.target;
        setHabitData(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
    };

    const handleStaticChange = (e) => {
        const { name, value } = e.target;
        // setFormData(prev => ({ ...prev, [name]: value }));
        setFormData(prev => ({
            ...prev,
            [name]: name === "targetDurationMonths" ? Number(value) : value
        }));
    };


    const handleDynamicChange = (e, questionID, questionType, answerText) => {
        const { value, checked } = e.target;
        const answerId = parseInt(value);
        const isOtherOption = answerText.toLowerCase().includes('khác');
        setFormData(prev => {
            const newDynamicAnswers = { ...prev.dynamicAnswers };
            const newOtherTexts = { ...prev.otherTexts };
            let currentAnswers = newDynamicAnswers[questionID] || [];

            if (questionType === 'MultipleChoice') {
                if (isOtherOption && checked) {
                    newDynamicAnswers[questionID] = [answerId];
                } else {
                    const otherOption = surveyQuestions.find(q => q.questionID === questionID)?.answerOptions.find(opt => opt.answerText.toLowerCase().includes('khác'));
                    let answers = [...currentAnswers];
                    if (otherOption) {
                        answers = answers.filter(id => id !== otherOption.answerOptionID);
                        delete newOtherTexts[questionID];
                    }
                    if (checked) { answers.push(answerId); }
                    else { answers = answers.filter(id => id !== answerId); }
                    newDynamicAnswers[questionID] = answers;
                }
            } else {
                newDynamicAnswers[questionID] = [answerId];
                if (!isOtherOption) { delete newOtherTexts[questionID]; }
            }
            return { ...prev, dynamicAnswers: newDynamicAnswers, otherTexts: newOtherTexts };
        });
    };

    const handleOtherTextChange = (questionID, value) => {
        setFormData(prev => ({ ...prev, otherTexts: { ...prev.otherTexts, [questionID]: value } }));
    };

    // SỬA ĐÚNG Ý MUỐN: scroll lên đầu trang ngay khi LƯU thành công (ngay sau toast.success)
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = "Bearer " + localStorage.getItem('userToken');


        if (!habitData || !habitData.cigarettesPerDayAtStart || habitData.cigarettesPerDayAtStart <= 0 || !habitData.cigarettesPerPack || habitData.cigarettesPerPack <= 0 || !habitData.pricePerPackAtStart || habitData.pricePerPackAtStart <= 0) {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ ở Phần 1.");
            setIsSubmitting(false); return;
        }
        if (!formData.startDate) {
            toast.error('Vui lòng chọn ngày bắt đầu cai thuốc!');
            setIsSubmitting(false); return;
        }

        if (!planCreated) {
            try {
                const quitPlanPayload = {
                    userId: parseInt(userId),
                    cigarettesPerDay: habitData.cigarettesPerDayAtStart,
                    pricePerPack: habitData.pricePerPackAtStart,
                    cigarettesPerPack: habitData.cigarettesPerPack,
                    startDate: formData.startDate,
                    targetDurationInMonths: formData.targetDurationMonths, // <-- ĐÚNG tên
                };

                const createPlanRes = await fetch('/api/QuitPlan/CreateQuitPlan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
                    body: JSON.stringify(quitPlanPayload),
                });

                if (!createPlanRes.ok) throw new Error("Lỗi khi tạo kế hoạch cơ bản.");

                const responseData = await createPlanRes.json();
                setFormData(prev => ({
                    ...prev,
                    endDate: responseData.endDate, // Cập nhật endDate từ API
                }));

                // TODO: Xử lý khảo sát nếu có
                // Xử lý gửi khảo sát sau khi tạo kế hoạch thành công
                const surveyPayload = [];
                Object.entries(formData.dynamicAnswers).forEach(([qId, aIds]) => {
                    aIds.forEach(aId => {
                        const q = surveyQuestions.find(i => i.questionID == qId);
                        const a = q?.answerOptions.find(o => o.answerOptionID == aId);
                        surveyPayload.push({
                            questionID: parseInt(qId, 10),
                            answerOptionID: aId,
                            customAnswerText: a?.answerText.toLowerCase().includes('khác') ? (formData.otherTexts[qId] || "") : ""
                        });
                    });
                });
                if (surveyPayload.length > 0) {
                    const submitAnswerRes = await fetch(`/api/Questionnaire/SubmitAnwser?userId=${userId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': token },
                        body: JSON.stringify(surveyPayload),
                    });
                    if (!submitAnswerRes.ok) throw new Error("Kế hoạch đã tạo nhưng lỗi nộp khảo sát.");
                }

                toast.success("Tạo kế hoạch thành công!");
                window.scrollTo({ top: 0, behavior: "smooth" }); // <-- scroll lên đầu trang ngay khi lưu thành công
                await loadInitialData();
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsSubmitting(false);
            }
        }
        else {
            try {
                const updatePlanPayload = {
                    cigarettesPerDayAtStart: habitData.cigarettesPerDayAtStart,
                    pricePerPackAtStart: habitData.pricePerPackAtStart,
                    cigarettesPerPack: habitData.cigarettesPerPack,
                };

                const updateSurveyPayload = [];
                Object.entries(formData.dynamicAnswers).forEach(([qId, aIds]) => aIds.forEach(aId => {
                    const q = surveyQuestions.find(i => i.questionID == qId);
                    const a = q?.answerOptions.find(o => o.answerOptionID == aId);
                    updateSurveyPayload.push({
                        questionID: parseInt(qId),
                        answerOptionID: aId,
                        customAnswerText: a?.answerText.toLowerCase().includes('khác') ? (formData.otherTexts[qId] || "") : ""
                    });
                }));

                const [planUpdateRes, surveyUpdateRes] = await Promise.all([
                    fetch(`/api/QuitPlan/UpdateQuitPlan?userId=${userId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", "Authorization": token },
                        body: JSON.stringify(updatePlanPayload)
                    }),
                    fetch(`/api/Questionnaire/update-by-user?userId=${userId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': token },
                        body: JSON.stringify(updateSurveyPayload)
                    })
                ]);

                if (!planUpdateRes.ok || !surveyUpdateRes.ok) {
                    throw new Error("Có lỗi xảy ra trong quá trình cập nhật. Vui lòng thử lại.");
                }

                toast.success("Cập nhật thành công!");
                window.scrollTo({ top: 0, behavior: "smooth" });
                await loadInitialData();
            } catch (error) {
                toast.error(error.message || "Đã có lỗi xảy ra khi cập nhật.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    const handleDeletePlan = async () => {
        setIsSubmitting(true);
        const token = "Bearer " + localStorage.getItem('userToken');
        try {
            const res = await fetch(`/api/QuitPlan/DeleteQuitPlanAndProgress?userId=${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            if (!res.ok) throw new Error("Xóa kế hoạch thất bại.");
            toast.success("Đã xóa tất cả kế hoạch và tiến trình!");
            await loadInitialData();
        } catch (error) {
            toast.error(error.message || "Đã có lỗi khi xóa kế hoạch.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
            <Spinner animation="border" variant="success" />
            <h4 className="ms-3">Đang tải dữ liệu...</h4>
        </Container>
    );

    return (
        <div className="thq-quit-plan">
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="thq-header text-center mb-4 pt-4">
                            <h1 className="thq-header__title">Lập kế hoạch cai thuốc</h1>
                            <p className="thq-header__subtitle">Trả lời các câu hỏi sau để nhận một lộ trình được cá nhân hóa.</p>
                        </div>

                        <Form onSubmit={handleCreateOrUpdate} className="thq-form">
                            <QuitPlanHabitSection
                                habitData={habitData}
                                onChange={handleHabitChange}
                                editable={editMode || !planCreated}
                            />
                            <QuitPlanGoalSection
                                formData={formData}
                                onChange={handleStaticChange}
                                editable={!planCreated}
                                showEndDate={planCreated} // Show endDate if the plan is created
                            />
                            <QuitPlanSurveySection
                                surveyQuestions={surveyQuestions}
                                dynamicAnswers={formData.dynamicAnswers}
                                otherTexts={formData.otherTexts}
                                onDynamicChange={handleDynamicChange}
                                onOtherTextChange={handleOtherTextChange}
                                editable={editMode || !planCreated}
                            />

                            <div className="thq-form__button-wrapper d-grid mb-3">
                                <Button
                                    className={`thq-button ${planCreated
                                        ? (editMode ? "thq-button--success" : "thq-button--primary")
                                        : "thq-button--success"
                                        }`}
                                    size="lg"
                                    type={planCreated && !editMode ? "button" : "submit"}
                                    onClick={planCreated && !editMode ? (e) => { e.preventDefault(); setEditMode(true); } : undefined}
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" className="thq-spinner" /> :
                                        (planCreated ? (editMode ? "Lưu thay đổi" : "Chỉnh sửa kế hoạch") : "Hoàn thành và Tạo kế hoạch")
                                    }
                                </Button>
                                {planCreated && !editMode && (
                                    <div className="d-flex flex-column gap-3 mt-3">
                                        <Button
                                            variant="warning"
                                            size="lg"
                                            className="thq-challenge-btn modern-glass"
                                            onClick={() => navigate("/User/Challenges")}
                                            style={{
                                                background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
                                                color: "#333", fontWeight: 600,
                                                border: "none",
                                                boxShadow: "0 4px 12px rgba(255, 204, 51, .12)",
                                                letterSpacing: ".02em"
                                            }}
                                        >
                                            🚩 Thử thách bản thân!
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="lg"
                                            className="thq-coach-btn"
                                            style={{
                                                background: "linear-gradient(90deg, #3CA55C 0%, #B5AC49 100%)",
                                                color: "#fff", fontWeight: 600,
                                                border: "none",
                                                boxShadow: "0 4px 12px rgba(60, 165, 92, .12)",
                                                letterSpacing: ".02em"
                                            }}
                                            onClick={() => navigate("/User/coachList")}
                                        >
                                            🧑‍🏫 Chọn Coach hỗ trợ
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="lg"
                                            className="thq-delete-btn"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            disabled={isSubmitting || isLoading}
                                            style={{
                                                fontWeight: 600,
                                                letterSpacing: ".02em"
                                            }}
                                        >
                                            🗑️ Xóa kế hoạch
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Modal
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa toàn bộ kế hoạch và tiến trình không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={async () => {
                            setShowDeleteConfirm(false);
                            await handleDeletePlan();
                        }}
                    >
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-right" autoClose={3000} />


        </div>
    );
};

export default QuitPlanPage;