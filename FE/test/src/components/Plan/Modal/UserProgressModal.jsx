import React from "react";
import { Modal, Button } from "react-bootstrap";

function UserProgressModal({ show, onHide, user }) {
    if (!user) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết tiến trình của người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Họ tên:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Gói thành viên:</strong> {user.packageType}</p>
                <p><strong>Ngày đăng ký:</strong> {user.registrationDate}</p>
                {/* Bạn có thể thêm bảng tiến trình tại đây */}
                <div className="text-muted fst-italic">(Chi tiết tiến trình sẽ hiển thị ở đây...)</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserProgressModal;
