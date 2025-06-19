import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

// Dữ liệu mẫu
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

function ChallengeTab() {
    const [challenges, setChallenges] = useState([]);
    const [challengeModalShow, setChallengeModalShow] = useState(false);
    const [editChallenge, setEditChallenge] = useState(null);
    const [formChallenge, setFormChallenge] = useState({ name: "", description: "", target: "", repeat: "" });

    useEffect(() => {
        // TODO: Gọi API để lấy danh sách thử thách
        setChallenges(fakeChallenges);
    }, []);

    const openAddChallengeModal = () => {
        setEditChallenge(null);
        setFormChallenge({ name: "", description: "", target: "", repeat: "" });
        setChallengeModalShow(true);
    };

    const openEditChallengeModal = (challenge) => {
        setEditChallenge(challenge.id);
        setFormChallenge({ ...challenge });
        setChallengeModalShow(true);
    };

    const handleDeleteChallenge = (id) => {
        // TODO: Gọi API xóa thử thách
        setChallenges(challenges.filter(c => c.id !== id));
        toast.success("Xóa thử thách thành công!");
    };

    const handleChallengeModalSave = () => {
        if (editChallenge) {
            // TODO: Gọi API PUT để cập nhật
            setChallenges(challenges.map(c => c.id === editChallenge ? { ...formChallenge, id: editChallenge } : c));
            toast.success("Cập nhật thử thách thành công!");
        } else {
            // TODO: Gọi API POST để thêm mới
            setChallenges([...challenges, { ...formChallenge, id: Date.now() }]);
            toast.success("Thêm thử thách mới thành công!");
        }
        setChallengeModalShow(false);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Danh sách thử thách</h5>
                <Button variant="outline-primary" className="rounded-pill px-4" onClick={openAddChallengeModal}>
                    Thêm <FaPlus />
                </Button>
            </div>
            <Table bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>Tên thử thách</th>
                        <th>Mô tả</th>
                        <th>Mục tiêu</th>
                        <th>Lặp lại</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {challenges.length === 0 ? (
                        <tr><td colSpan={5} className="text-center text-muted">Chưa có thử thách</td></tr>
                    ) : challenges.map((c) => (
                        <tr key={c.id} className="align-middle text-center">
                            <td>{c.name}</td>
                            <td>{c.description}</td>
                            <td>{c.target}</td>
                            <td>{c.repeat}</td>
                            <td>
                                <Button variant="link" size="sm" onClick={() => openEditChallengeModal(c)}><FaEdit /></Button>
                                <Button variant="link" size="sm" onClick={() => handleDeleteChallenge(c.id)}><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal thêm/sửa Challenge */}
            <Modal show={challengeModalShow} onHide={() => setChallengeModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editChallenge ? "Sửa thử thách" : "Thêm thử thách"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3"><Form.Label>Tên thử thách</Form.Label><Form.Control value={formChallenge.name} onChange={e => setFormChallenge({ ...formChallenge, name: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Mô tả</Form.Label><Form.Control as="textarea" value={formChallenge.description} onChange={e => setFormChallenge({ ...formChallenge, description: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Mục tiêu</Form.Label><Form.Control type="number" value={formChallenge.target} onChange={e => setFormChallenge({ ...formChallenge, target: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Lặp lại</Form.Label><Form.Control value={formChallenge.repeat} onChange={e => setFormChallenge({ ...formChallenge, repeat: e.target.value })} placeholder="VD: Hàng ngày, Hàng tuần..." /></Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setChallengeModalShow(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleChallengeModalSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ChallengeTab;