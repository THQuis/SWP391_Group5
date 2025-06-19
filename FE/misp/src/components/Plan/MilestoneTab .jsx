// components/MilestoneTab.js
import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const MilestoneTab = ({ milestones, sampleMilestones, onAdd, onEdit, onDelete }) => {
    const renderMilestoneRows = () => [
        ...sampleMilestones.map((ms, idx) => (
            <tr key={"sample-" + ms.id}>
                <td>{idx + 1}</td>
                <td>{ms.label}</td>
                <td>
                    {ms.status.map((s, i) => (
                        <div key={i}>
                            <b>{s.type}</b> ({s.percent}%): {s.content}
                        </div>
                    ))}
                </td>
                <td>
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => onEdit(ms)}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(ms.id)}>
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        )),
        ...milestones.map((ms, idx) => (
            <tr key={ms.id}>
                <td>{sampleMilestones.length + idx + 1}</td>
                <td>{ms.label}</td>
                <td>
                    {ms.status.map((s, i) => (
                        <div key={i}>
                            <b>{s.type}</b> ({s.percent}%): {s.content}
                        </div>
                    ))}
                </td>
                <td>
                    <Button variant="outline-success" size="sm" className="me-2" onClick={() => onEdit(ms)}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(ms.id)}>
                        <FaTrash />
                    </Button>
                </td>
            </tr>
        ))
    ];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Các mốc tiến trình (Milestone)</h5>
                <Button variant="outline-primary" onClick={onAdd}><FaPlus /> Thêm mốc</Button>
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
                    {renderMilestoneRows()}
                </tbody>
            </Table>
        </>
    );
};

export default MilestoneTab;
