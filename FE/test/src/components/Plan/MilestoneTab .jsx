import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";

// Dữ liệu mẫu, sau này bạn có thể thay bằng API
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

function MilestoneTab() {
    const [milestones, setMilestones] = useState([]);
    const [milestoneModalShow, setMilestoneModalShow] = useState(false);
    const [editMilestone, setEditMilestone] = useState(null);
    const [milestoneForm, setMilestoneForm] = useState({ label: "", status: [{ type: "", content: "", percent: 0 }] });

    useEffect(() => {
        // TODO: Gọi API để lấy danh sách milestones ở đây
        // Tạm thời dùng dữ liệu mẫu
        setMilestones(sampleMilestones);
    }, []);

    const openAddMilestoneModal = () => {
        setEditMilestone(null);
        setMilestoneForm({ label: "", status: [{ type: "", content: "", percent: 0 }] });
        setMilestoneModalShow(true);
    };

    const openEditMilestoneModal = (ms) => {
        setEditMilestone(ms.id);
        setMilestoneForm(JSON.parse(JSON.stringify(ms))); // Deep copy
        setMilestoneModalShow(true);
    };

    const handleDeleteMilestone = (id) => {
        // TODO: Gọi API xóa milestone
        setMilestones(milestones.filter(ms => ms.id !== id));
        toast.success("Xóa mốc (tạm thời) thành công!");
    };

    const handleMilestoneModalSave = () => {
        if (editMilestone) {
            // TODO: Gọi API PUT để cập nhật
            setMilestones(milestones.map(ms => ms.id === editMilestone ? { ...milestoneForm, id: editMilestone } : ms));
            toast.success("Cập nhật mốc thành công!");
        } else {
            // TODO: Gọi API POST để thêm mới
            setMilestones([...milestones, { ...milestoneForm, id: Date.now() }]);
            toast.success("Thêm mốc mới thành công!");
        }
        setMilestoneModalShow(false);
    };

    const handleMilestoneFormStatusChange = (idx, field, value) => {
        const newStatus = [...milestoneForm.status];
        newStatus[idx][field] = value;
        setMilestoneForm({ ...milestoneForm, status: newStatus });
    };

    const handleAddMilestoneStatusRow = () => {
        setMilestoneForm({ ...milestoneForm, status: [...milestoneForm.status, { type: "", content: "", percent: 0 }] });
    };

    const handleRemoveMilestoneStatusRow = (idx) => {
        if (milestoneForm.status.length > 1) {
            const newStatus = [...milestoneForm.status];
            newStatus.splice(idx, 1);
            setMilestoneForm({ ...milestoneForm, status: newStatus });
        }
    };

    return (
        <div>
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
                    {milestones.map((ms, idx) => (
                        <tr key={ms.id}>
                            <td>{idx + 1}</td>
                            <td>{ms.label}</td>
                            <td>
                                {ms.status.map((s, i) => (
                                    <div key={i}><b>{s.type}</b> ({s.percent}%): {s.content}</div>
                                ))}
                            </td>
                            <td>
                                <Button variant="outline-success" size="sm" className="me-2" onClick={() => openEditMilestoneModal(ms)}><FaEdit /></Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMilestone(ms.id)}><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal thêm/sửa Milestone */}
            <Modal show={milestoneModalShow} onHide={() => setMilestoneModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editMilestone ? "Sửa mốc tiến trình" : "Thêm mốc tiến trình"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* ... Nội dung Form của Modal Milestone ... */}
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Tên mốc</Form.Label><Form.Control value={milestoneForm.label} onChange={e => setMilestoneForm({ ...milestoneForm, label: e.target.value })} placeholder="VD: 1 tiếng, 6 tiếng..." /></Form.Group>
                        <Form.Label>Danh sách trạng thái</Form.Label>
                        {milestoneForm.status.map((s, idx) => (<InputGroup className="mb-2" key={idx}><Form.Control style={{ maxWidth: "120px" }} value={s.type} onChange={e => handleMilestoneFormStatusChange(idx, "type", e.target.value)} placeholder="Loại" /><Form.Control style={{ maxWidth: "80px" }} type="number" value={s.percent} onChange={e => handleMilestoneFormStatusChange(idx, "percent", e.target.value)} placeholder="%" /><Form.Control value={s.content} onChange={e => handleMilestoneFormStatusChange(idx, "content", e.target.value)} placeholder="Nội dung" /><Button variant="outline-danger" onClick={() => handleRemoveMilestoneStatusRow(idx)} disabled={milestoneForm.status.length === 1}><FaMinus /></Button></InputGroup>))}
                        <Button variant="outline-primary" size="sm" className="my-1" onClick={handleAddMilestoneStatusRow}><FaPlus /> Thêm trạng thái</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setMilestoneModalShow(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleMilestoneModalSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MilestoneTab;