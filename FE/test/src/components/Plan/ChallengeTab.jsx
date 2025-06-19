import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ChallengeTab = ({ challenges, onAdd, onEdit, onDelete }) => {
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Danh sách thử thách</h5>
                <Button variant="outline-primary" className="rounded-pill px-4" onClick={onAdd}>
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
                    {challenges.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center text-secondary">Chưa có dữ liệu</td>
                        </tr>
                    ) : (
                        challenges.map((c) => (
                            <tr key={c.id} className="align-middle text-center">
                                <td>{c.name}</td>
                                <td>{c.description}</td>
                                <td>{c.target}</td>
                                <td>{c.participants}</td>
                                <td>{c.completed}</td>
                                <td>{c.repeat}</td>
                                <td>
                                    <Button variant="link" size="sm" onClick={() => onEdit(c)}><FaEdit /></Button>
                                    <Button variant="link" size="sm" onClick={() => onDelete(c.id)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default ChallengeTab;
