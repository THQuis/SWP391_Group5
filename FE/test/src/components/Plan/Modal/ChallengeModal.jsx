import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function ChallengeModal({
    show,
    onHide,
    isEdit,
    form,
    setForm,
    onSave
}) {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header
                className="bg-info-subtle"
                style={{ borderBottom: 0, justifyContent: "center" }}
            >
                <Modal.Title className="w-100 text-center fst-italic">
                    {isEdit ? "Sửa thử thách" : "Thêm thử thách"}
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
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
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
                                value={form.target}
                                onChange={e => setForm({ ...form, target: e.target.value })}
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
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="rounded-pill"
                                placeholder="Nhập mô tả"
                            />
                        </Col>
                    </Form.Group>
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

export default ChallengeModal;
