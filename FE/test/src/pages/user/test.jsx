import React, { useState, useEffect, useMemo } from "react";
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../styles/QuitPlanPage.scss";

// PHẦN 1: Sửa lại để dùng đúng tên thuộc tính từ API (vd: cigarettesPerDayAtStart)
const QuitPlanHabitSection = ({ habitData, editable, onChange }) => {
    const dailyCost = useMemo(() => {
        if (!habitData || !habitData.cigarettesPerDayAtStart || !habitData.pricePerPackAtStart || !habitData.cigarettesPerPack || habitData.cigarettesPerPack <= 0)
            return 0;
        return (habitData.pricePerPackAtStart / habitData.cigarettesPerPack) * habitData.cigarettesPerDayAtStart;
    }, [habitData]);

    const data = habitData || { cigarettesPerDayAtStart: '', pricePerPackAtStart: '', cigarettesPerPack: '' };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header as="h5" className="bg-light">1. Thói quen hiện tại</Card.Header>
            <Card.Body>
                <Form.Group as={Row} className="mb-3"><Form.Label column sm={6}>Bạn hút bao nhiêu điếu mỗi ngày?</Form.Label><Col sm={6}><Form.Control type="number" name="cigarettesPerDayAtStart" value={data.cigarettesPerDayAtStart} onChange={onChange} disabled={!editable} min="0" /></Col></Form.Group>
                <Form.Group as={Row} className="mb-3"><Form.Label column sm={6}>Một gói bạn hút có bao nhiêu điếu?</Form.Label><Col sm={6}><Form.Control type="number" name="cigarettesPerPack" value={data.cigarettesPerPack} onChange={onChange} disabled={!editable} min="0" /></Col></Form.Group>
                <Form.Group as={Row} className="mb-3"><Form.Label column sm={6}>Giá tiền một gói (VND)?</Form.Label><Col sm={6}><Form.Control type="number" name="pricePerPackAtStart" value={data.pricePerPackAtStart} onChange={onChange} disabled={!editable} min="0" /></Col></Form.Group>
                {dailyCost > 0 && <Alert variant="info" className="mt-3"><p className="mb-0 d-flex justify-content-between"><span>Chi phí mỗi tháng (ước tính):</span> <strong>{(dailyCost * 30).toLocaleString("vi-VN")} VND</strong></p></Alert>}
            </Card.Body>
        </Card>
    );
};

// PHẦN 2: COMPONENT CON CHO MỤC TIÊU
const QuitPlanGoalSection = ({ formData, onChange, editable }) => (
    <Card className="mb-4 shadow-sm">
        <Card.Header as="h5" className="bg-light">2. Thiết lập mục tiêu</Card.Header>
        <Card.Body>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Ngày bắt đầu cai thuốc (*)</Form.Label><Form.Control type="date" name="startDate" value={formData.startDate} onChange={onChange} required disabled={!editable} /></Form.Group>
        </Card.Body>
    </Card>
);
// ===================================================================================
// PHẦN 3: COMPONENT CON CHO KHẢO SÁT
// ===================================================================================
const QuitPlanSurveySection = ({ surveyQuestions, dynamicAnswers, otherTexts, onDynamicChange, onOtherTextChange, editable }) => {
    const mapQuestionTypeToInputType = (type) => type === 'SingleChoice' ? 'radio' : 'checkbox';

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header as="h5" className="bg-light">3. Tìm hiểu về bạn</Card.Header>
            <Card.Body>
                <fieldset disabled={!editable}>
                    {surveyQuestions.length > 0 ? surveyQuestions.map(q => {
                        const otherOption = q.answerOptions.find(opt => opt.answerText.toLowerCase().includes('khác'));
                        const isOtherSelected = otherOption && (dynamicAnswers[q.questionID] || []).includes(otherOption.answerOptionID);
                        return (
                            <Form.Group key={q.questionID} className="mb-4">
                                <Form.Label as="legend" column className="fw-bold">{q.questionText}</Form.Label>
                                {q.answerOptions.map(opt => {
                                    const isThisTheOtherOption = opt.answerText.toLowerCase().includes('khác');
                                    return (
                                        <div key={opt.answerOptionID}>
                                            <Form.Check type={mapQuestionTypeToInputType(q.questionType)} id={`q-${q.questionID}-a-${opt.answerOptionID}`} label={opt.answerText} name={`question-${q.questionID}`} value={opt.answerOptionID} checked={(dynamicAnswers[q.questionID] || []).includes(opt.answerOptionID)} onChange={(e) => onDynamicChange(e, q.questionID, q.questionType, opt.answerText)} />
                                            {isThisTheOtherOption && isOtherSelected && (<Form.Control type="text" placeholder="Vui lòng ghi rõ..." className="mt-2 ms-4" style={{ maxWidth: '90%' }} value={otherTexts[q.questionID] || ''} onChange={(e) => onOtherTextChange(q.questionID, e.target.value)} />)}
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [planCreated, setPlanCreated] = useState(false);
    const [habitData, setHabitData] = useState(null);
    const [formData, setFormData] = useState({ startDate: '', dynamicAnswers: {}, otherTexts: {} });
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const userId = localStorage.getItem("userId");

    const loadInitialData = async () => {
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem("userToken");
        // Dùng tên thuộc tính có `...AtStart` để khớp với API get
        const defaultHabitData = { cigarettesPerDayAtStart: '', pricePerPackAtStart: '', cigarettesPerPack: '' };

        try {
            const [planRes, questionsRes, userAnswersRes] = await Promise.all([
                fetch(`/api/QuitPlan/user/${userId}`, { headers: { "Authorization": token } }),
                fetch('/api/Questionnaire/ListQuestion', { headers: { "Authorization": token } }),
                // SỬA LẠI ĐÚNG URL API
                fetch(`/api/Questionnaire/answers-by-user?userId=${userId}`, { headers: { "Authorization": token } })
            ]);

            if (questionsRes.ok) setSurveyQuestions(await questionsRes.json());

            const planDataArray = await planRes.json().catch(() => null);

            // FIX: Lấy phần tử ĐẦU TIÊN của mảng mà API trả về
            const planData = (planDataArray && planDataArray.length > 0) ? planDataArray[0] : null;

            // Bây giờ, việc kiểm tra và set dữ liệu sẽ chính xác
            if (planRes.ok && planData && planData.quitPlanID) {
                setHabitData(planData);
                setFormData(prev => ({ ...prev, startDate: planData.startDate?.slice(0, 10) || '' }));
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
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = "Bearer " + localStorage.getItem('userToken');

        // VALIDATION
        if (!habitData || !habitData.cigarettesPerDayAtStart || habitData.cigarettesPerDayAtStart <= 0 || !habitData.cigarettesPerPack || habitData.cigarettesPerPack <= 0 || !habitData.pricePerPackAtStart || habitData.pricePerPackAtStart <= 0) {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ ở Phần 1.");
            setIsSubmitting(false); return;
        }
        if (!formData.startDate) {
            toast.error('Vui lòng chọn ngày bắt đầu cai thuốc!');
            setIsSubmitting(false); return;
        }

        // TẠO MỚI
        if (!planCreated) {
            try {
                // PAYLOAD CHO API 1: Phải khớp với API CreateQuitPlan
                const quitPlanPayload = {
                    userId: parseInt(userId),
                    // Ánh xạ từ tên state (`...AtStart`) sang tên API yêu cầu
                    cigarettesPerDay: habitData.cigarettesPerDayAtStart,
                    pricePerPack: habitData.pricePerPackAtStart,
                    cigarettesPerPack: habitData.cigarettesPerPack,
                    startDate: formData.startDate,
                };
                const createPlanRes = await fetch('/api/QuitPlan/CreateQuitPlan', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token }, body: JSON.stringify(quitPlanPayload) });
                if (!createPlanRes.ok) throw new Error("Lỗi khi tạo kế hoạch cơ bản.");

                // PAYLOAD CHO API 2 (giữ nguyên)
                const surveyPayload = [];
                Object.entries(formData.dynamicAnswers).forEach(([qId, aIds]) => aIds.forEach(aId => { /* ... */ }));
                if (surveyPayload.length > 0) {
                    const submitAnswerRes = await fetch(`/api/Questionnaire/SubmitAnwser?userId=${userId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token }, body: JSON.stringify(surveyPayload) });
                    if (!submitAnswerRes.ok) throw new Error("Kế hoạch đã tạo nhưng lỗi nộp khảo sát.");
                }

                toast.success("Tạo kế hoạch thành công!");
                await loadInitialData();
            } catch (error) { toast.error(error.message); }
            finally { setIsSubmitting(false); }
        }
        // CẬP NHẬT
        else {
            try {
                // DÒNG NÀY ĐÃ ĐƯỢC THÊM LẠI - SỬA LỖI
                const updatePlanPayload = {
                    cigarettesPerDayAtStart: habitData.cigarettesPerDayAtStart,
                    pricePerPackAtStart: habitData.pricePerPackAtStart,
                    cigarettesPerPack: habitData.cigarettesPerPack,
                    startDate: formData.startDate,
                };

                // PAYLOAD 2: Dành cho API update-by-user (PUT)
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

                // GỌI CẢ 2 API CẬP NHẬT CÙNG LÚC
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

                // KIỂM TRA KẾT QUẢ CỦA CẢ 2 API
                if (!planUpdateRes.ok || !surveyUpdateRes.ok) {
                    throw new Error("Có lỗi xảy ra trong quá trình cập nhật. Vui lòng thử lại.");
                }

                toast.success("Cập nhật thành công!");
                await loadInitialData(); // Tải lại toàn bộ dữ liệu để đảm bảo nhất quán

            } catch (error) {
                toast.error(error.message || "Đã có lỗi xảy ra khi cập nhật.");
            } finally {
                setIsSubmitting(false); // Bật lại nút bấm dù thành công hay thất bại
            }
        }
    };


    if (isLoading) return <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><Spinner animation="border" variant="success" /><h4 className="ms-3">Đang tải dữ liệu...</h4></Container>;

    return (
        <div className="quit-plan-bg">
            <Container className="">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="text-center mb-4">
                            <h1>Lập kế hoạch cai thuốc</h1>
                            <p className="text-muted">Trả lời các câu hỏi sau để nhận một lộ trình được cá nhân hóa.</p>
                        </div>

                        <Form onSubmit={handleCreateOrUpdate}>
                            <QuitPlanHabitSection habitData={habitData} onChange={handleHabitChange} editable={editMode || !planCreated} />
                            <QuitPlanGoalSection formData={formData} onChange={handleStaticChange} editable={editMode || !planCreated} />
                            <QuitPlanSurveySection surveyQuestions={surveyQuestions} dynamicAnswers={formData.dynamicAnswers} otherTexts={formData.otherTexts} onDynamicChange={handleDynamicChange} onOtherTextChange={handleOtherTextChange} editable={editMode || !planCreated} />

                            <div className="d-grid mb-3">
                                <Button
                                    variant={planCreated ? (editMode ? "success" : "primary") : "success"}
                                    size="lg"
                                    type={planCreated && !editMode ? "button" : "submit"}
                                    onClick={planCreated && !editMode ? (e) => { e.preventDefault(); setEditMode(true); } : undefined}
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> :
                                        (planCreated ? (editMode ? "Lưu thay đổi" : "Chỉnh sửa kế hoạch") : "Hoàn thành và Tạo kế hoạch")
                                    }
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default QuitPlanPage;