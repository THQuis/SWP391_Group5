// components/PlanTab.js
import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const PlanTab = ({ plans, onAdd, onEdit, onDelete }) => {
    const renderPlanAnswerCell = (plan) => {
        if (plan.type === "Trắc nghiệm" && Array.isArray(plan.answer)) {
            return plan.answer.join("; ");
        }
        return "";
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Kế hoạch khảo sát</h5>
                <Button variant="outline-primary" className="rounded-pill px-4" onClick={onAdd}>
                    Thêm <FaPlus />
                </Button>
            </div>
            <Table bordered hover>
                <thead>
                    <tr className="text-center">
                        <th>STT</th>
                        <th>Câu hỏi</th>
                        <th>Loại đáp án</th>
                        <th>Đáp án (nếu là trắc nghiệm)</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center text-secondary">Chưa có dữ liệu</td>
                        </tr>
                    ) : (
                        plans.map((p, idx) => (
                            <tr key={p.id} className="align-middle text-center">
                                <td>{idx + 1}</td>
                                <td>{p.question}</td>
                                <td>{p.type}</td>
                                <td>{renderPlanAnswerCell(p)}</td>
                                <td>
                                    <Button variant="link" size="sm" onClick={() => onEdit(p)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="link" size="sm" onClick={() => onDelete(p.id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default PlanTab;
