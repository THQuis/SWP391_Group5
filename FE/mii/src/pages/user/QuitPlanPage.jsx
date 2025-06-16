import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import "../user/style.scss";

// --- GIẢ LẬP API ---

// 1. API trả về các câu hỏi khảo sát động
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

// 2. API trả về kế hoạch đã có của người dùng
// Để kiểm tra chế độ "Tạo mới", hãy đặt biến này thành `null`
const mockUserPlan = {
    id: 123,
    cigarettesPerDay: 15,
    cigarettesPerPack: 20,
    pricePerPack: 22000,
    startDate: '2025-06-10',
    endDate: '2025-09-10',
    otherReason: 'Bị vợ cằn nhằn',
    confidence: 7,
    dynamicAnswers: {
        "1": 103,
        "2": [201, 202],
        "3": [301]
    }
};
// const mockUserPlan = null; // Dùng dòng này để test chế độ TẠO MỚI


const QuitPlanPage = () => {
    // --- STATE ---
    const [existingPlan, setExistingPlan] = useState(null);
    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        cigarettesPerDay: 10,
        cigarettesPerPack: 20,
        pricePerPack: 20000,
        startDate: '',
        endDate: '',
        otherReason: '',
        confidence: 5,
        dynamicAnswers: {},
    });

    const [submitted, setSubmitted] = useState({ show: false, message: '', variant: 'success' });

    const isEditMode = existingPlan !== null;

    // --- LOGIC ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [questionsResponse, planResponse] = await Promise.all([
                    new Promise(resolve => setTimeout(() => resolve(mockApiQuestions), 500)),
                    new Promise(resolve => setTimeout(() => resolve(mockUserPlan), 500))
                ]);

                setSurveyQuestions(questionsResponse || []);

                if (planResponse) {
                    setExistingPlan(planResponse);
                    setFormData({
                        cigarettesPerDay: planResponse.cigarettesPerDay,
                        cigarettesPerPack: planResponse.cigarettesPerPack,
                        pricePerPack: planResponse.pricePerPack,
                        startDate: planResponse.startDate,
                        endDate: planResponse.endDate || '',
                        otherReason: planResponse.otherReason || '',
                        confidence: planResponse.confidence,
                        dynamicAnswers: planResponse.dynamicAnswers || {},
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const { dailyCost, weeklyCost, monthlyCost } = useMemo(() => {
        const { cigarettesPerDay, cigarettesPerPack, pricePerPack } = formData;
        if (!cigarettesPerDay || !cigarettesPerPack || !pricePerPack || cigarettesPerPack <= 0) {
            return { dailyCost: 0, weeklyCost: 0, monthlyCost: 0 };
        }
        const pricePerCigarette = pricePerPack / cigarettesPerPack;
        const daily = pricePerCigarette * cigarettesPerDay;
        return {
            dailyCost: daily,
            weeklyCost: daily * 7,
            monthlyCost: daily * 30,
        };
    }, [formData.cigarettesPerDay, formData.cigarettesPerPack, formData.pricePerPack]);

    const handleStaticChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.startDate) {
            alert('Vui lòng chọn ngày bắt đầu cai thuốc!');
            return;
        }

        const selectedAnswerIds = Object.values(formData.dynamicAnswers).flat();

        const apiPayload = {
            userId: 1,
            cigarettesPerDayAtStart: formData.cigarettesPerDay,
            cigarettesPerPack: formData.cigarettesPerPack,
            pricePerPackAtStart: formData.pricePerPack,
            startDate: formData.startDate,
            endDate: formData.endDate,
            reason: formData.otherReason,
            confidence: formData.confidence,
            selectedAnswerIds: selectedAnswerIds,
        };

        console.log("CHẾ ĐỘ:", isEditMode ? "CHỈNH SỬA" : "TẠO MỚI");
        console.log("DỮ LIỆU GỬI LÊN API:", apiPayload);

        if (isEditMode) {
            console.log(`Đang gửi PUT request đến /api/quit-plans/${existingPlan.id}`);
            setSubmitted({ show: true, message: 'Cập nhật kế hoạch thành công!', variant: 'primary' });

        } else {
            console.log(`Đang gửi POST request đến /api/quit-plans`);
            const newPlan = { id: Date.now(), ...formData, dynamicAnswers: formData.dynamicAnswers };
            setExistingPlan(newPlan);
            setSubmitted({ show: true, message: 'Tạo kế hoạch thành công!', variant: 'success' });
        }

        window.scrollTo(0, 0);
    };

    // --- RENDER ---
    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải dữ liệu...</h4>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <div className="text-center mb-4">
                        <h1>{isEditMode ? 'Chỉnh sửa Kế hoạch' : 'Lập kế hoạch cai thuốc'}</h1>
                        <div className="motivation-section animated fadeIn">
                            {/* Thay link ảnh bên dưới bằng hình động lực bạn muốn (ảnh minh họa, gif, v.v.) */}
                            {/* <img
                                src="https://github.com/THQuis/SWP391_Group5/blob/main/image/bannerpng.png?raw=true"
                                alt="Motivation"
                                style={{ maxWidth: 120, marginBottom: 10 }}
                            /> */}
                            <p className="motivation-text" style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                Hãy nhớ: Mỗi điều chỉnh hôm nay là một bước tiến tới sức khỏe và hạnh phúc của bạn!<br />
                                Đừng bỏ cuộc – bạn hoàn toàn có thể làm được. Cộng đồng luôn đồng hành cùng bạn!
                            </p>
                        </div>
                        <p className="text-muted">
                            {isEditMode
                                ? 'Bạn có thể điều chỉnh lại các thông tin và mục tiêu dưới đây.'
                                : 'Trả lời các câu hỏi sau để nhận một lộ trình được cá nhân hóa.'}
                        </p>
                    </div>

                    {submitted.show && (
                        <Alert variant={submitted.variant} onClose={() => setSubmitted({ ...submitted, show: false })} dismissible>
                            {submitted.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Card className="mb-4">
                            <Card.Header as="h5">1. Thói quen hiện tại</Card.Header>
                            <Card.Body>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={6}>Bạn hút bao nhiêu điếu mỗi ngày?</Form.Label>
                                    <Col sm={6}><Form.Control type="number" name="cigarettesPerDay" value={formData.cigarettesPerDay} onChange={handleStaticChange} /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={6}>Một gói bạn hút có bao nhiêu điếu?</Form.Label>
                                    <Col sm={6}><Form.Control type="number" name="cigarettesPerPack" value={formData.cigarettesPerPack} onChange={handleStaticChange} /></Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={6}>Giá tiền một gói (VND)?</Form.Label>
                                    <Col sm={6}><Form.Control type="number" name="pricePerPack" value={formData.pricePerPack} onChange={handleStaticChange} /></Col>
                                </Form.Group>
                                {dailyCost > 0 && (
                                    <Alert variant="info" className="mt-3">
                                        <div className="d-flex justify-content-between"><span>Chi phí mỗi ngày:</span> <strong>{dailyCost.toLocaleString('vi-VN')} VND</strong></div>
                                        <div className="d-flex justify-content-between"><span>Chi phí mỗi tuần:</span> <strong>{weeklyCost.toLocaleString('vi-VN')} VND</strong></div>
                                        <div className="d-flex justify-content-between"><span>Chi phí mỗi tháng:</span> <strong>{monthlyCost.toLocaleString('vi-VN')} VND</strong></div>
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header as="h5">2. Tìm hiểu về bạn</Card.Header>
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

                        <Card className="mb-4">
                            <Card.Header as="h5">3. Thiết lập mục tiêu</Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Ngày bắt đầu cai thuốc (*)</Form.Label>
                                    <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleStaticChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Ngày mong muốn cai hoàn toàn (tùy chọn)</Form.Label>
                                    <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleStaticChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Mức độ tự tin của bạn (1-10)</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Range name="confidence" min="1" max="10" value={formData.confidence} onChange={handleStaticChange} className="me-3" />
                                        <Badge pill bg="success" style={{ fontSize: '1rem' }}>{formData.confidence}</Badge>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <div className="d-grid">
                            <Button variant={isEditMode ? "primary" : "success"} size="lg" type="submit">
                                {isEditMode ? 'Lưu thay đổi' : 'Hoàn thành và Tạo kế hoạch'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default QuitPlanPage;