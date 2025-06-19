import React, { useState, useEffect, useMemo } from "react";
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Badge } from "react-bootstrap";
import "../../styles/QuitPlanPage.scss";

// Câu hỏi khảo sát động (giả lập)
// TODO: Sau này thay bằng lấy từ API thật
const mockApiQuestions = [
    {
        questionID: 1,
        questionText: "Bạn đã hút thuốc trong bao lâu?",
        questionType: "RADIO",
        answerOptions: [
            { answerOptionID: 101, answerText: "Dưới 1 năm" },
            { answerOptionID: 102, answerText: "1-5 năm" },
            { answerOptionID: 103, answerText: "6-10 năm" },
            { answerOptionID: 104, answerText: "Trên 10 năm" },
        ]
    },
    {
        questionID: 2,
        questionText: "Lý do bạn muốn cai thuốc (chọn các lý do chính)?",
        questionType: "CHECKBOX",
        answerOptions: [
            { answerOptionID: 201, answerText: "Cải thiện sức khỏe" },
            { answerOptionID: 202, answerText: "Tiết kiệm chi phí" },
            { answerOptionID: 203, answerText: "Bảo vệ gia đình khỏi khói thuốc" },
            { answerOptionID: 204, answerText: "Mang thai hoặc dự định mang thai" },
            { answerOptionID: 205, answerText: "Áp lực từ người thân/bác sĩ" },
        ]
    },
    {
        questionID: 3,
        questionText: "Những tác nhân nào thường khiến bạn muốn hút thuốc?",
        questionType: "CHECKBOX",
        answerOptions: [
            { answerOptionID: 301, answerText: 'Khi uống cà phê hoặc rượu bia' },
            { answerOptionID: 302, answerText: 'Khi cảm thấy căng thẳng (stress)' },
            { answerOptionID: 303, answerText: 'Sau bữa ăn' },
            { answerOptionID: 304, answerText: 'Khi nói chuyện điện thoại' },
        ]
    }
];

// PHẦN 1: Thói quen hiện tại (có chế độ edit)
const QuitPlanHabitSection = ({
    habitData,
    editable,
    onChange
}) => {
    const dailyCost = useMemo(() => {
        if (
            !habitData ||
            !habitData.cigarettesPerDayAtStart ||
            !habitData.pricePerPackAtStart ||
            !habitData.cigarettesPerPack ||
            habitData.cigarettesPerPack <= 0
        )
            return 0;
        return (
            (habitData.pricePerPackAtStart / habitData.cigarettesPerPack) *
            habitData.cigarettesPerDayAtStart
        );
    }, [habitData]);

    if (!habitData)
        return (
            <Card className="mb-4">
                <Card.Header as="h5">1. Thói quen hiện tại</Card.Header>
                <Card.Body>
                    <Alert variant="danger">Không lấy được dữ liệu thói quen.</Alert>
                </Card.Body>
            </Card>
        );

    return (
        <Card className="mb-4">
            <Card.Header as="h5">1. Thói quen hiện tại</Card.Header>
            <Card.Body>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                        Bạn hút bao nhiêu điếu mỗi ngày?
                    </Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            type="number"
                            name="cigarettesPerDayAtStart"
                            value={habitData.cigarettesPerDayAtStart || ""}
                            onChange={onChange}
                            disabled={!editable}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                        Một gói bạn hút có bao nhiêu điếu?
                    </Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            type="number"
                            name="cigarettesPerPack"
                            value={habitData.cigarettesPerPack || ""}
                            onChange={onChange}
                            disabled={!editable}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                        Giá tiền một gói (VND)?
                    </Form.Label>
                    <Col sm={6}>
                        <Form.Control
                            type="number"
                            name="pricePerPackAtStart"
                            value={habitData.pricePerPackAtStart || ""}
                            onChange={onChange}
                            disabled={!editable}
                        />
                    </Col>
                </Form.Group>
                {dailyCost > 0 && (
                    <Alert variant="info" className="mt-3">
                        <div className="d-flex justify-content-between">
                            <span>Chi phí mỗi ngày:</span>
                            <strong>{dailyCost.toLocaleString("vi-VN")} VND</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Chi phí mỗi tuần:</span>
                            <strong>{(dailyCost * 7).toLocaleString("vi-VN")} VND</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Chi phí mỗi tháng:</span>
                            <strong>{(dailyCost * 30).toLocaleString("vi-VN")} VND</strong>
                        </div>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

const QuitPlanGoalSection = ({
    formData,
    onChange,
    editable
}) => (
    <Card className="mb-4">
        <Card.Header as="h5">2. Thiết lập mục tiêu</Card.Header>
        <Card.Body>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ngày bắt đầu cai thuốc (*)</Form.Label>
                <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={onChange}
                    required
                    disabled={!editable}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ngày mong muốn cai hoàn toàn (tùy chọn)</Form.Label>
                <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={onChange}
                    disabled={!editable}
                />
            </Form.Group>
        </Card.Body>
    </Card>
);

const QuitPlanPage = () => {
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        otherReason: '',
        dynamicAnswers: {},
    });
    const [habitData, setHabitData] = useState(null);
    const [submitted, setSubmitted] = useState({ show: false, message: '', variant: 'success' });
    const [editMode, setEditMode] = useState(false); // true: cho phép sửa PHẦN 1 và PHẦN 2
    const [planCreated, setPlanCreated] = useState(false); // Đã tạo kế hoạch chưa

    const userId = localStorage.getItem("userId");

    // Lấy dữ liệu thói quen (phần 1)
    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/QuitPlan/user/${userId}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("userToken"),
                        "accept": "*/*"
                    }
                });
                const txt = await res.text();
                let data;
                try {
                    data = JSON.parse(txt);
                } catch {
                    setHabitData(null);
                    setIsLoading(false);
                    return;
                }
                if (Array.isArray(data)) {
                    setHabitData(data[0]);
                } else {
                    setHabitData(data);
                }
                setPlanCreated(!!data && data?.cigarettesPerDayAtStart); // Nếu có kế hoạch thì đã tạo rồi
                // Nếu đã tạo, cũng gán formData (PHẦN 2) từ dữ liệu server nếu có
                if (!!data && data?.startDate) {
                    setFormData(prev => ({
                        ...prev,
                        startDate: data.startDate ? data.startDate.slice(0, 10) : '',
                        endDate: data.endDate ? data.endDate.slice(0, 10) : '',
                        // có thể thêm các trường khác nếu backend trả về
                    }));
                }
            } catch (e) {
                setHabitData(null);
            } finally {
                setIsLoading(false);
            }
        };
        if (userId) fetchPlan();
    }, [userId]);

    // Lấy câu hỏi khảo sát động (dùng mock, sau này thay bằng API thật)
    useEffect(() => {
        setSurveyQuestions(mockApiQuestions);
    }, []);

    // Xử lý chỉnh sửa PHẦN 1 (Habit)
    const handleHabitChange = (e) => {
        const { name, value } = e.target;
        setHabitData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    // Xử lý câu hỏi động
    const handleDynamicChange = (e, questionID, questionType) => {
        const { value, checked } = e.target;
        const answerId = parseInt(value);

        setFormData(prev => {
            const newDynamicAnswers = { ...prev.dynamicAnswers };
            if (questionType === 'RADIO') {
                newDynamicAnswers[questionID] = answerId;
            } else if (questionType === 'CHECKBOX') {
                const currentAnswers = newDynamicAnswers[questionID] || [];
                if (checked) {
                    newDynamicAnswers[questionID] = [...currentAnswers, answerId];
                } else {
                    newDynamicAnswers[questionID] = currentAnswers.filter(id => id !== answerId);
                }
            }
            return { ...prev, dynamicAnswers: newDynamicAnswers };
        });
    };

    const handleStaticChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý Tạo mới hoặc Chỉnh sửa: CHUNG 1 NÚT cho PHẦN 1 và PHẦN 2
    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!habitData) return;

        // Dữ liệu phần 1
        const habitPayload = {
            cigarettesPerDayAtStart: habitData.cigarettesPerDayAtStart,
            pricePerPackAtStart: habitData.pricePerPackAtStart,
            cigarettesPerPack: habitData.cigarettesPerPack
        };

        // Dữ liệu phần 2
        const goalPayload = {
            startDate: formData.startDate,
            endDate: formData.endDate,
        };

        if (!planCreated) {
            // Tạo mới kế hoạch (POST)
            if (!formData.startDate) {
                alert('Vui lòng chọn ngày bắt đầu cai thuốc!');
                return;
            }
            const apiPayload = {
                userId: userId,
                reason: formData.otherReason,
                selectedAnswerIds: Object.values(formData.dynamicAnswers).flat(),
                ...habitPayload,
                ...goalPayload,
            };
            try {
                const res = await fetch('/api/QuitPlanAuto/auto-create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                    },
                    body: JSON.stringify(apiPayload)
                });
                if (res.ok) {
                    const data = await res.text();
                    setSubmitted({ show: true, message: data || 'Tạo kế hoạch thành công!', variant: 'success' });
                    setPlanCreated(true);
                    setEditMode(false);
                } else {
                    const errMsg = await res.text();
                    setSubmitted({ show: true, message: "Lỗi: " + errMsg, variant: 'danger' });
                }
            } catch (error) {
                setSubmitted({ show: true, message: "Lỗi kết nối: " + error.message, variant: 'danger' });
            }
        } else {
            // Chỉnh sửa kế hoạch (PATCH)
            try {
                const res = await fetch(`/api/QuitPlan/UpdateQuitPlan?userId=${userId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("userToken")
                    },
                    body: JSON.stringify({
                        ...habitPayload,
                        ...goalPayload,
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    setHabitData(data.plan);
                    setSubmitted({ show: true, message: "Cập nhật thành công!", variant: "success" });
                    setEditMode(false);
                } else {
                    setSubmitted({ show: true, message: "Cập nhật thất bại!", variant: "danger" });
                }
            } catch (error) {
                setSubmitted({ show: true, message: "Lỗi kết nối: " + error.message, variant: "danger" });
            }
        }
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center quit-plan-bg" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải dữ liệu...</h4>
            </Container>
        );
    }

    return (
        <div className="quit-plan-bg">
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <div className="text-center mb-4">
                            <h1>Lập kế hoạch cai thuốc</h1>
                            <div className="motivation-section animated fadeIn">
                                <p className="motivation-text" style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Hãy nhớ: Mỗi điều chỉnh hôm nay là một bước tiến tới sức khỏe và hạnh phúc của bạn!<br />
                                    Đừng bỏ cuộc – bạn hoàn toàn có thể làm được. Cộng đồng luôn đồng hành cùng bạn!
                                </p>
                            </div>
                            <p className="text-muted">
                                Trả lời các câu hỏi sau để nhận một lộ trình được cá nhân hóa.
                            </p>
                        </div>

                        {submitted.show && (
                            <Alert variant={submitted.variant} onClose={() => setSubmitted({ ...submitted, show: false })} dismissible>
                                {submitted.message}
                            </Alert>
                        )}

                        <Form onSubmit={handleCreateOrUpdate}>
                            {/* PHẦN 1: Thói quen hiện tại */}
                            <QuitPlanHabitSection
                                habitData={habitData}
                                editable={editMode || !planCreated}
                                onChange={handleHabitChange}
                            />

                            {/* PHẦN 2: Thiết lập mục tiêu */}
                            <QuitPlanGoalSection
                                formData={formData}
                                onChange={handleStaticChange}
                                editable={editMode || !planCreated}
                            />

                            {/* Nếu chưa tạo kế hoạch thì show survey (bây giờ là PHẦN 3) */}
                            {!planCreated && (
                                <Card className="mb-4">
                                    <Card.Header as="h5">3. Tìm hiểu về bạn</Card.Header>
                                    <Card.Body>
                                        {surveyQuestions.map(q => (
                                            <Form.Group key={q.questionID} className="mb-4">
                                                <Form.Label className="fw-bold">{q.questionText}</Form.Label>
                                                {q.answerOptions.map(opt => (
                                                    <Form.Check
                                                        key={opt.answerOptionID}
                                                        type={q.questionType.toLowerCase()}
                                                        id={`q-${q.questionID}-a-${opt.answerOptionID}`}
                                                        label={opt.answerText}
                                                        name={`question-${q.questionID}`}
                                                        value={opt.answerOptionID}
                                                        checked={
                                                            q.questionType === 'RADIO'
                                                                ? formData.dynamicAnswers[q.questionID] === opt.answerOptionID
                                                                : (formData.dynamicAnswers[q.questionID] || []).includes(opt.answerOptionID)
                                                        }
                                                        onChange={(e) => handleDynamicChange(e, q.questionID, q.questionType)}
                                                    />
                                                ))}
                                                {q.questionID === 2 && (
                                                    <Form.Control className="mt-2" type="text" name="otherReason" placeholder="Nhập lý do khác của bạn..." value={formData.otherReason} onChange={handleStaticChange} />
                                                )}
                                            </Form.Group>
                                        ))}
                                    </Card.Body>
                                </Card>
                            )}

                            <div className="d-grid mb-3">
                                {!planCreated || editMode ?
                                    <Button variant="success" size="lg" type="submit">
                                        {planCreated ? "Lưu thay đổi" : "Hoàn thành và Tạo kế hoạch"}
                                    </Button>
                                    :
                                    <Button variant="primary" size="lg" type="button" onClick={() => setEditMode(true)}>
                                        Chỉnh sửa kế hoạch
                                    </Button>
                                }
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default QuitPlanPage;