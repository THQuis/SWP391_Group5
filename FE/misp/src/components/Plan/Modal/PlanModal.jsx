import React from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";

const answerTypeOptions = [
    { value: "Tự luận", label: "Tự luận" },
    { value: "Trắc nghiệm", label: "Trắc nghiệm" },
    { value: "Ngày tháng năm", label: "Ngày tháng năm" },
];

function PlanModal({
    show,
    onHide,
    isEdit,
    form,
    setForm,
    mcAnswers,
    setMcAnswers,
    onSave,
}) {
    const handlePlanTypeChange = (value) => {
        setForm({ ...form, type: value, answer: null });
        if (value === "Trắc nghiệm") setMcAnswers([""]);
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

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header className="bg-info-subtle" style={{ borderBottom: 0, justifyContent: "center" }}>
                <Modal.Title className="w-100 text-center fst-italic">
                    {isEdit ? "Sửa kế hoạch" : "Thêm kế hoạch"}
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
                                value={form.question}
                                onChange={e => setForm({ ...form, question: e.target.value })}
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
                                value={form.type}
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
                    {form.type === "Trắc nghiệm" && (
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
                            onClick={onHide}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            className="rounded-pill px-4 fw-semibold"
                            onClick={onSave}
                        >
                            {isEdit ? "Lưu" : "Thêm"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default PlanModal;
