// src/pages/user/CoachProfileForUser.js

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, OverlayTrigger, Tooltip, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaTransgender, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaUserCheck, FaUserTimes, FaCalendarCheck } from "react-icons/fa";

// Giả lập API trả về thông tin chi tiết của một coach
const fetchCoachById = async (id) => {
    // ---- THAY THẾ BẰNG API THẬT ----
    // Ví dụ: const response = await fetch(`/api/user/coach-profile/${id}`);
    console.log(`Đang fetch thông tin cho coach ID: ${id}`);
    const FAKE_COACH_DB = [
        { UserID: 1, fullName: "Nguyễn Văn A", email: "coach.a@example.com", phoneNumber: "0901112222", profilePicture: null, gender: "male", registrationDate: "2024-01-15", description: "Chuyên gia với 10 năm kinh nghiệm hỗ trợ cai nghiện, tập trung vào liệu pháp nhận thức - hành vi." },
        { UserID: 2, fullName: "Trần Thị Bình", email: "coach.b@example.com", phoneNumber: "0902223333", profilePicture: null, gender: "female", registrationDate: "2023-11-20", description: "Tôi tin vào sức mạnh của sự đồng cảm và xây dựng một lộ trình cá nhân hóa cho từng học viên." },
    ];
    return new Promise(resolve => setTimeout(() => resolve(FAKE_COACH_DB.find(c => c.UserID === parseInt(id))), 500));
    // ---------------------------------
}

const CoachProfileForUser = () => {
    const { id } = useParams(); // Lấy ID của coach từ URL
    const navigate = useNavigate();

    const [coach, setCoach] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // TODO: Cần thêm logic để biết user đã chọn coach nào
    const [myChosenCoachId, setMyChosenCoachId] = useState(null);

    useEffect(() => {
        const getCoachProfile = async () => {
            setIsLoading(true);
            try {
                const coachData = await fetchCoachById(id);
                if (coachData) {
                    setCoach(coachData);
                } else {
                    toast.error("Không tìm thấy thông tin của chuyên gia này.");
                    navigate("/User/coachList"); // Chuyển hướng nếu không có coach
                }
            } catch (e) {
                toast.error(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            getCoachProfile();
        }
    }, [id, navigate]);

    // Xử lý các hành động (Chọn, Hủy, Đặt lịch) - Tạm thời chỉ hiện thông báo
    const handleChooseCoach = () => toast.success(`Đã gửi yêu cầu chọn Coach ${coach.fullName}!`);
    const handleUnchooseCoach = () => toast.info(`Đã hủy chọn Coach ${coach.fullName}.`);
    const handleBookAppointment = () => toast.info(`Mở form đặt lịch với Coach ${coach.fullName}.`);

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải hồ sơ chuyên gia...</h4>
            </Container>
        );
    }

    if (!coach) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">Không thể tải được thông tin của chuyên gia.</Alert>
            </Container>
        )
    }

    // Biến để kiểm tra trạng thái chọn coach
    const isThisCoachChosen = myChosenCoachId === coach.UserID;
    const hasChosenAnyCoach = myChosenCoachId !== null;

    return (
        <Container fluid className="py-4" style={{ background: "#d5f5df", minHeight: "100vh" }}>
            {/* Profile Card */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-center p-4 gap-4" style={{ minHeight: 230 }}>
                    <div className="text-center mb-2 mb-md-0">
                        <img
                            src={coach.profilePicture || `https://i.pravatar.cc/150?u=${coach.UserID}`}
                            alt="Avatar"
                            className="rounded-circle border border-3 border-success shadow"
                            style={{ width: '140px', height: '140px', objectFit: 'cover', background: "#fff" }}
                        />
                    </div>
                    <div className="flex-grow-1 text-center text-md-start">
                        <h2 className="fw-bold mb-2" style={{ lineHeight: 1.2 }}>{coach.fullName}</h2>
                        <div className="mb-1" style={{ fontSize: "1.13rem", color: "#555", lineHeight: 1.6 }}>
                            <span style={{ color: "#4d4d4d", fontWeight: 500 }}>Tiểu sử:&nbsp;</span>
                            <span>{coach.description || <span className="fst-italic text-muted">Chưa có tiểu sử.</span>}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Thông tin cá nhân của Coach */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body style={{ background: "#fff", borderRadius: 22, padding: "2rem" }}>
                    <h5 className="mb-4" style={{ color: "#3d1877", fontWeight: 700, letterSpacing: 1 }}>
                        <FaUser className="me-2" /> Thông tin chuyên gia
                    </h5>
                    <Row style={{ fontSize: "1.08rem", lineHeight: 2 }}>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="me-2" /><strong>Email:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.email}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaPhoneAlt className="me-2" /><strong>Số điện thoại:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.phoneNumber}</span>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaTransgender className="me-2" /><strong>Giới tính:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaCalendarAlt className="me-2" /><strong>Ngày tham gia:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{new Date(coach.registrationDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* THÊM MỚI: Khu vực các nút hành động */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body className="text-center">
                    <h5 className="mb-3">Tương tác với chuyên gia</h5>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        {/* Nếu user đã chọn coach này */}
                        {isThisCoachChosen && (
                            <Button variant="danger" size="lg" onClick={handleUnchooseCoach}>
                                <FaUserTimes className="me-2" /> Hủy chọn
                            </Button>
                        )}

                        {/* Nếu user chưa chọn coach nào */}
                        {!hasChosenAnyCoach && (
                            <Button variant="primary" size="lg" onClick={handleChooseCoach}>
                                <FaUserCheck className="me-2" /> Chọn làm người đồng hành
                            </Button>
                        )}

                        {/* Nút đặt lịch chỉ sáng khi user đã chọn coach này */}
                        <Button variant="success" size="lg" disabled={!isThisCoachChosen} onClick={handleBookAppointment}>
                            <FaCalendarCheck className="me-2" /> Đặt lịch tư vấn
                        </Button>
                    </div>
                    {/* Thông báo nếu user đã chọn coach khác */}
                    {hasChosenAnyCoach && !isThisCoachChosen && (
                        <Alert variant="warning" className="mt-3">
                            Bạn đã có một chuyên gia đồng hành khác. Vui lòng hủy chọn chuyên gia hiện tại trước khi chọn người mới.
                        </Alert>
                    )}
                </Card.Body>
            </Card>

        </Container>
    );
};

export default CoachProfileForUser;