import React from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";

function MilestoneModal({
    show,
    onHide,
    isEdit,
    form,
    setForm,
    onSave,
}) {
    const handleStatusChange = (idx, field, value) => {
        const updated = [...form.status];
        updated[idx][field] = value;
        setForm({ ...form, status: updated });
    };

    const handleAddStatus = () => {
        setForm({ ...form, status: [...form.status, { type: "", content: "", percent: 0 }] });
    };

    const handleRemoveStatus = (idx) => {
        if (form.status.length > 1) {
            const updated = [...form.status];
            updated.splice(idx, 1);
            setForm({ ...form, status: updated });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Sửa mốc tiến trình" : "Thêm mốc tiến trình"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên mốc</Form.Label>
                        <Form.Control
                            value={form.label}
                            onChange={e => setForm({ ...form, label: e.target.value })}
                            placeholder="VD: 1 tiếng, 6 tiếng, 24 tiếng..."
                        />
                    </Form.Group>
                    <Form.Label>Danh sách trạng thái</Form.Label>
                    {form.status.map((s, idx) => (
                        <InputGroup className="mb-2" key={idx}>
                            <Form.Control
                                style={{ maxWidth: "120px" }}
                                value={s.type}
                                onChange={e => handleStatusChange(idx, "type", e.target.value)}
                                placeholder="Loại trạng thái"
                            />
                            <Form.Control
                                style={{ maxWidth: "80px" }}
                                type="number"
                                value={s.percent}
                                onChange={e => handleStatusChange(idx, "percent", e.target.value)}
                                placeholder="%"
                            />
                            <Form.Control
                                value={s.content}
                                onChange={e => handleStatusChange(idx, "content", e.target.value)}
                                placeholder="Nội dung trạng thái"
                            />
                            <Button
                                variant="outline-danger"
                                onClick={() => handleRemoveStatus(idx)}
                                disabled={form.status.length === 1}
                                style={{ borderRadius: "50%" }}
                            >
                                <FaMinus />
                            </Button>
                        </InputGroup>
                    ))}
                    <Button variant="outline-primary" size="sm" className="my-1" onClick={handleAddStatus}>
                        <FaPlus /> Thêm trạng thái
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={onSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MilestoneModal;
